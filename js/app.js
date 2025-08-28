let currentIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// クイズを読み込む
function loadQuiz() {
  const quiz = quizData[currentIndex];

  // 単語と例文
  document.getElementById("word").textContent = quiz.word;
  document.getElementById("example").textContent = quiz.example;

  // ヒント画像とテキストの初期化
  document.getElementById("hintImage").src = "";
  document.getElementById("hintImage").style.display = "none";
  document.getElementById("hintText").classList.add("hidden");
  document.getElementById("hintSentence").textContent = "";

  // フィードバックとアニメーションの初期化
  document.getElementById("feedback").textContent = "";
  document.getElementById("celebration").classList.add("hidden");

  // 選択肢の生成
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

    // 正解音声の再生
    const sound = document.getElementById("correctSound");
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        console.warn("音声再生がブロックされました");
      });
    }

    feedback.textContent = "🎉 正解！";
  } else {
    incorrectCount++;
    document.getElementById("incorrectCount").textContent = incorrectCount;
    feedback.textContent = "❌ 不正解";
  }

  // 選択肢を無効化
  document.querySelectorAll("#choices button").forEach(btn => btn.disabled = true);
}

// ヒント表示ボタン
document.getElementById("showHintBtn").addEventListener("click", () => {
  const quiz = quizData[currentIndex];
  document.getElementById("hintImage").src = quiz.hintImage;
  document.getElementById("hintImage").style.display = "block";
  document.getElementById("hintSentence").textContent = quiz.example;
  document.getElementById("hintText").classList.remove("hidden");
});

// ヒント音声ボタン
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

// Google検索で発音を確認
function searchGooglePronunciation(text) {
  const query = encodeURIComponent(text + " pronunciation");
  const url = "https://www.google.com/search?q=" + query;
  window.open(url, "_blank");
}

// Forvoで単語の発音を確認
function searchForvoPronunciation(word) {
  const query = encodeURIComponent(word);
  const url = "https://forvo.com/word/" + query + "/";
  window.open(url, "_blank");
}

// 発音確認ボタンのイベント登録
document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("googlePronounceBtn");
  const forvoBtn = document.getElementById("forvoPronounceBtn");

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const quiz = quizData[currentIndex];
      if (quiz.example) {
        searchGooglePronunciation(quiz.example);
      } else {
        alert("例文が見つかりませんでした");
      }
    });
  }

  if (forvoBtn) {
    forvoBtn.addEventListener("click", () => {
      const quiz = quizData[currentIndex];
      if (quiz.word) {
        searchForvoPronunciation(quiz.word);
      } else {
        alert("単語が見つかりませんでした");
      }
    });
  }

  // 初期読み込み
  loadQuiz();
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