const allKana = [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'];
const app = document.querySelector('#app');
let questions = [], questionIndex = 0, stars = 0, streak = 0, locked = false, soundOn = true;
const shuffle = items => [...items].sort(() => Math.random() - .5);
function makeQuestion(answer) { return { answer, choices: shuffle([answer, ...shuffle(allKana.filter(k => k !== answer)).slice(0, 3)]) }; }
function makeStage() { questions = shuffle(allKana).slice(0, 10).map(makeQuestion); questionIndex = 0; streak = 0; locked = false; render(); }
function speak(text) { if (!soundOn || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = .82; u.pitch = 1.15; window.speechSynthesis.speak(u); }
function shell(content) {
 app.innerHTML = `<div class="scene"><div class="sun"></div><div class="cloud cloud-a"></div><div class="cloud cloud-b"></div><div class="tree tree-left">🌳</div><div class="tree tree-right">🌳</div><div class="hill hill-back"></div><div class="hill hill-front"></div><header class="topbar"><button class="home-btn" aria-label="ホーム">⌂</button><div class="logo">🌟 もじを <span>さがそう！</span> 🌟</div><div class="score">⭐ <b id="star-count">${stars}</b></div></header>${content}<div class="mascot bear" aria-hidden="true">🐻<span>いっしょに<br>がんばろう！</span></div><div class="mascot bird" aria-hidden="true">🐦</div><div class="mascot bunny" aria-hidden="true">🐰</div><div class="flowers" aria-hidden="true">🌼　🌸　🌼　🌷　🌼</div></div>`;
 app.querySelector('.home-btn').addEventListener('click', showHome);
}
function render() {
 const q = questions[questionIndex];
 shell(`<main class="game-card"><div class="progress-row"><div class="question-count">もんだい <b>${questionIndex + 1}</b> / 10</div><div class="progress-dots">${questions.map((_, i) => `<i class="${i < questionIndex ? 'done' : i === questionIndex ? 'current' : ''}"></i>`).join('')}</div><button class="sound-btn" id="sound">${soundOn ? '🔊' : '🔇'}</button></div><section class="prompt"><div class="prompt-small">この もじを みつけてね！</div><div class="target">${q.answer}</div><button class="listen" id="listen">🔈 もういちど きく</button></section><div class="choices">${q.choices.map((c, i) => `<button class="choice choice-${i}" data-choice="${c}" aria-label="${c}">${c}</button>`).join('')}</div><div class="feedback" id="feedback" aria-live="polite">せいかいを タッチしてね！</div><div class="streak">${streak >= 2 ? `🔥 ${streak}れんぞく せいかい！` : '⭐ ほしを あつめよう！'}</div></main>`);
 app.querySelectorAll('[data-choice]').forEach(btn => btn.addEventListener('click', () => choose(btn.dataset.choice)));
 app.querySelector('#listen').addEventListener('click', () => speak(q.answer));
 app.querySelector('#sound').addEventListener('click', () => { soundOn = !soundOn; render(); });
 speak(q.answer);
}
function choose(value) {
 if (locked) return;
 const q = questions[questionIndex], buttons = [...app.querySelectorAll('[data-choice]')];
 if (value === q.answer) {
  locked = true; stars++; streak++;
  buttons.find(b => b.dataset.choice === value).classList.add('correct');
  app.querySelector('#star-count').textContent = String(stars);
  const feedback = app.querySelector('#feedback'); feedback.textContent = streak >= 3 ? '🎉 すごい！ かんぺき！' : '🌟 せいかい！ やったね！'; feedback.classList.add('good');
  speak('せいかい！ やったね！');
  setTimeout(() => { questionIndex++; if (questionIndex >= 10) showComplete(); else { locked = false; render(); } }, 1050);
 } else {
  streak = 0; const chosen = buttons.find(b => b.dataset.choice === value); chosen.classList.add('wrong');
  app.querySelector('#feedback').textContent = 'おしい！ もういちど さがしてみよう'; speak('おしい！ もういちど！');
  setTimeout(() => chosen.classList.remove('wrong'), 650);
 }
}
function showHome() {
 window.speechSynthesis?.cancel();
 shell(`<main class="start-card"><div class="welcome">どうぶつたちと いっしょに<br><strong>ひらがなを さがそう！</strong></div><div class="welcome-animals">🐻　🐰　🐦</div><p>もじを みつけて タッチしてね！</p><button class="start-btn" id="start">ゲーム スタート！ ▶</button><div class="tiny-note">ぜんぶで 10もん · ほしを あつめよう</div></main>`);
 app.querySelector('#start').addEventListener('click', makeStage);
}
function showComplete() {
 locked = true;
 shell(`<main class="complete-card"><div class="confetti">🎊 🌟 🎉</div><h1>ステージ クリア！</h1><div class="big-stars">⭐⭐⭐</div><p>10もん ぜんぶ できたね！</p><p class="earned">ほしを ${stars}こ あつめたよ！</p><div class="complete-animals">🐻 🐰 🐦</div><button class="start-btn" id="again">もういちど あそぶ！</button><button class="sub-btn" id="home-again">タイトルへ</button></main>`);
 speak('ステージクリア！ すごいね！');
 app.querySelector('#again').addEventListener('click', makeStage); app.querySelector('#home-again').addEventListener('click', showHome);
}
showHome();
