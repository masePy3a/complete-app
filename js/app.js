let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// クイズを読み込む
function loadQuiz() {
  const quiz = quizData[currentIndex];

  // 単語と例文（例文はヒント用）
  document.getElementById("word").textContent = quiz.word;
  document.getElementById("example").textContent = quiz.example;

  // ヒント画像とヒントテキストを初期状態で非表示
  document.getElementById("hintImage").src = "";
  document.getElementById("hintImage").style.display = "none";
  document.getElementById("hintText").classList.add("hidden");
  document.getElementById("hintSentence").textContent = "";

  // フィードバックと正解アニメーションをリセット
  document.getElementById("feedback").textContent = "";
  document.getElementById("celebration").classList.add("hidden");

  // 選択肢を生成
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  quiz.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(choice);
    choicesDiv.appendChild(btn);
  });
}

// 回答処理
function handleAnswer(selected) {
  const quiz = quizData[currentIndex];
  const feedback = document.getElementById("feedback");

  if (selected === quiz.correct) {
    correctCount++;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("celebration").classList.remove("hidden");

    // 正解音声の再生（再生位置をリセット）
    const sound = document.getElementById("correctSound");
    sound.currentTime = 0;
    sound.play();

    feedback.textContent = "🎉 正解！";
  } else {
    incorrectCount++;
    document.getElementById("incorrectCount").textContent = incorrectCount;
    feedback.textContent = "❌ 不正解";
  }

  // 選択肢を無効化
  document.querySelectorAll("#choices button").forEach(btn => btn.disabled = true);
}

// ヒント表示ボタンの処理
document.getElementById("showHintBtn").addEventListener("click", () => {
  const quiz = quizData[currentIndex];
  document.getElementById("hintImage").src = quiz.hintImage;
  document.getElementById("hintImage").style.display = "block";
  document.getElementById("hintSentence").textContent = quiz.example;
  document.getElementById("hintText").classList.remove("hidden");
});

// ヒント音声ボタンの処理
document.getElementById("playHintVoiceBtn").addEventListener("click", () => {
  const quiz = quizData[currentIndex];
  speakText(quiz.example);
});

// TTS音声再生関数
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1.0;
  speechSynthesis.speak(utterance);
}

// Google検索で発音を確認する関数
function searchPronunciation(text) {
  const query = encodeURIComponent(text + " pronunciation");
  const url = "https://www.google.com/search?q=" + query;
  window.open(url, "_blank");
}

// Google発音確認ボタンのイベント登録
document.getElementById("googlePronounceBtn").addEventListener("click", () => {
  const quiz = quizData[currentIndex];
  if (quiz.example) {
    searchPronunciation(quiz.example);
  } else {
    alert("例文が見つかりませんでした");
  }
});

// 次の問題へ
document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < quizData.length) {
    loadQuiz();
  } else {
    alert("すべての問題が終了しました！");
  }
});

// 初期読み込み
loadQuiz();