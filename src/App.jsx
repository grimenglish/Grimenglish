import React, { useState, useEffect } from "react";

const questions = [
  { english: "Hi", korean: "안녕" },
  { english: "Good to see you", korean: "만나서 반가워" },
  { english: "Where do you live?", korean: "어디사니" },
  { english: "I'm waiting for mom.", korean: "엄마를 기다리고 있어" }
];

export default function App() {
  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const current = questions[index];

  useEffect(() => {
    if (mode === "practice") {
      setShowAnswer(false);
      const t = setTimeout(() => setShowAnswer(true), 3000);
      return () => clearTimeout(t);
    }
  }, [index, mode]);

  const next = () => {
    setIndex((i) => (i + 1) % questions.length);
  };

  if (!mode) {
    return (
      <div>
        <h1>GrimEnglish1 퀴즈 앱</h1>
        <button onClick={() => setMode("practice")}>연습 모드</button>
      </div>
    );
  }

  if (mode === "practice") {
    return (
      <div>
        <h2>뜻: {current.korean}</h2>
        {showAnswer ? <h3>영어: {current.english}</h3> : <h3>3초 후 정답 공개</h3>}
        <button onClick={next}>다음</button>
      </div>
    );
  }

  return <div>모드 준비 중...</div>;
}