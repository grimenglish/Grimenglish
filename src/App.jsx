import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newEnglish, setNewEnglish] = useState("");
  const [newKorean, setNewKorean] = useState("");

  const current = sentences[index];

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };

  const loadSentences = async () => {
    const q = query(collection(db, "sentences"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => doc.data());
    setSentences(result);
  };

  const addSentence = async () => {
    if (!newEnglish || !newKorean) return;
    await addDoc(collection(db, "sentences"), {
      english: newEnglish,
      korean: newKorean,
      createdAt: serverTimestamp(),
    });
    setNewEnglish("");
    setNewKorean("");
    loadSentences();
  };

  const next = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % sentences.length);
  };

  useEffect(() => {
    if (mode === "practice") {
      const t = setTimeout(() => setShowAnswer(true), 3000);
      return () => clearTimeout(t);
    }
  }, [index, mode]);

  return (
    <div style={{ padding: 20 }}>
      <h1>GrimEnglish1 퀴즈 앱</h1>
      {!user ? (
        <button onClick={login}>Google 로그인</button>
      ) : (
        <>
          <p>환영합니다, {user.displayName}님!</p>

          <div style={{ marginBottom: 20 }}>
            <h3>✍️ 문장 추가</h3>
            <input
              value={newKorean}
              onChange={(e) => setNewKorean(e.target.value)}
              placeholder="뜻 (한국어)"
            />
            <input
              value={newEnglish}
              onChange={(e) => setNewEnglish(e.target.value)}
              placeholder="영어 문장"
            />
            <button onClick={addSentence}>추가</button>
          </div>

          <div>
            <button onClick={() => { setMode("practice"); loadSentences(); }}>
              연습 모드
            </button>
          </div>

          {mode === "practice" && sentences.length > 0 && current && (
            <div style={{ marginTop: 30 }}>
              <h2>뜻: {current.korean}</h2>
              {showAnswer ? <h3>영어: {current.english}</h3> : <p>3초 후 정답 공개</p>}
              <button onClick={next}>다음</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
