import React, { useState, useEffect } from "react";

const questions = [
  { english: "I'm waiting for mom.", korean: "엄마를 기다리고 있어" },
  { english: "You look down today.", korean: "기운 없어보인다" },
  { english: "Catch you later.", korean: "나중에 보자" },
  { english: "What do squirrels eat?", korean: "다람쥐는 뭐 먹지?" },
  { english: "Let's give a cucumber.", korean: "오이를 주자" }
];

export default function App() {
  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [wrong, setWrong] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);

  const current = questions[index];
  const blanked = current.english.split(" ");
  const blankIndex = Math.floor(Math.random() * blanked.length);
  const answerWord = blanked[blankIndex];
  blanked[blankIndex] = "____";

  useEffect(() => {
    if (mode && startTime) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, startTime]);

  const speak = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.pitch = 1;
    speechSynthesis.speak(u);
  };

  const check = () => {
    let correct;
    if (mode === "translate") {
      correct = current.english.toLowerCase();
      if (answer.trim().toLowerCase() === correct) {
        setFeedback("정답입니다!");
        setScore(score + 1);
      } else {
        setFeedback(`오답! 정답은: ${current.english}`);
        setWrong([...wrong, current.english]);
      }
    } else {
      correct = answerWord.toLowerCase();
      if (answer.trim().toLowerCase() === correct) {
        setFeedback("정답입니다!");
        setScore(score + 1);
      } else {
        setFeedback(`오답! 정답은: ${current.english}`);
        setWrong([...wrong, current.english]);
      }
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % questions.length);
    setAnswer("");
    setFeedback("");
  };

  if (!mode) {
    return (
      <div style={{ padding: 20 }}>
        <h1>GrimEnglish1 영어 퀴즈 앱</h1>
        <button onClick={() => { setMode("translate"); setStartTime(new Date()); }}>영작 퀴즈</button>
        <button onClick={() => { setMode("blank"); setStartTime(new Date()); }}>빈칸 퀴즈</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div>⏱️ {timer}s | 점수: {score}</div>
      {mode === "translate" ? (
        <p><strong>{current.korean}</strong> → 영어로?</p>
      ) : (
        <p>빈칸에 알맞은 단어는? → <strong>{blanked.join(" ")}</strong></p>
      )}
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="정답 입력" />
      <div style={{ marginTop: 10 }}>
        <button onClick={check}>정답 확인</button>
        <button onClick={next}>다음 문제</button>
      </div>
      {feedback && <p>{feedback}</p>}
      {wrong.length > 0 && (
        <div>
          <h3>오답 노트</h3>
          <ul>{wrong.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
