const questions = [
  {emoji:"🦆", name:"あひる", answer:"あ", choices:["と","ね","あ","ふ"]},
  {emoji:"🐱", name:"ねこ", answer:"ね", choices:["ぬ","ね","の","め"]},
  {emoji:"🐙", name:"たこ", answer:"た", choices:["な","た","に","ち"]},
  {emoji:"🍎", name:"りんご", answer:"り", choices:["い","り","れ","ろ"]},
  {emoji:"🐻", name:"くま", answer:"く", choices:["へ","く","け","こ"]},
  {emoji:"🐸", name:"かえる", answer:"か", choices:["か","や","は","さ"]},
  {emoji:"🐰", name:"うさぎ", answer:"う", choices:["す","つ","う","ふ"]},
  {emoji:"🍌", name:"ばなな", answer:"ば", choices:["ぱ","は","ば","ま"]},
  {emoji:"🐟", name:"さかな", answer:"さ", choices:["き","ち","さ","し"]},
  {emoji:"🌷", name:"はな", answer:"は", choices:["ほ","は","ま","よ"]}
];
let index = 0, stars = 0, locked = false;
const $ = id => document.getElementById(id);
function speak(text) {
  return new Promise(resolve => {
    if (!("speechSynthesis" in window)) return resolve();
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP"; utter.rate = 0.82; utter.pitch = 1.12;
    utter.onend = resolve; utter.onerror = resolve;
    speechSynthesis.speak(utter);
    setTimeout(resolve, 2500);
  });
}
function render() {
  const q = questions[index];
  $("progress").textContent = `${index + 1} / ${questions.length} もん`;
  $("stars").textContent = `⭐ ${stars}`;
  $("picture").textContent = q.emoji;
  $("picture").setAttribute("aria-label", q.name + "の絵");
  $("word").textContent = "□" + q.name.slice(1);
  $("feedback").textContent = "もじを えらんでね！";
  $("next").hidden = true;
  $("choices").innerHTML = "";
  q.choices.forEach((choice, i) => {
    const button = document.createElement("button");
    button.className = "choice"; button.textContent = `${i + 1}　${choice}`;
    button.addEventListener("click", () => choose(choice));
    $("choices").appendChild(button);
  });
}
async function choose(value) {
  if (locked) return;
  locked = true;
  document.querySelectorAll(".choice").forEach(b => b.disabled = true);
  const q = questions[index];
  if (value === q.answer) {
    stars++;
    $("stars").textContent = `⭐ ${stars}`;
    $("word").textContent = q.name;
    $("feedback").textContent = "せいかい！ やったね！";
    await speak("せいかい！ やったね！ " + q.name);
  } else {
    $("feedback").textContent = "おしい！ もういちど かんがえてね";
    await speak("おしい！ もういちど かんがえてね");
    locked = false;
    document.querySelectorAll(".choice").forEach(b => b.disabled = false);
    return;
  }
  $("next").hidden = false;
  $("next").textContent = index === questions.length - 1 ? "けっかをみる ▶" : "つぎへ ▶";
}
function finish() {
  $("complete").hidden = false;
  $("progress").hidden = true; $("stars").hidden = true;
  $("question").hidden = true; $("choices").hidden = true;
  $("feedback").hidden = true; $("next").hidden = true;
  $("result").textContent = `${questions.length}もん ちゅう ${stars}こ せいかい！`;
  speak("よくがんばったね！");
}
$("next").addEventListener("click", () => {
  index++;
  if (index >= questions.length) return finish();
  locked = false; render();
});
$("retry").addEventListener("click", () => {
  index = 0; stars = 0; locked = false;
  $("complete").hidden = true;
  $("progress").hidden = false; $("stars").hidden = false;
  $("question").hidden = false; $("choices").hidden = false;
  $("feedback").hidden = false; render();
});
render();
