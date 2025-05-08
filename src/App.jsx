import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const App = () => {
  const [sentences, setSentences] = useState([]);
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongList, setWrongList] = useState([]);

  const fetchSentences = async () => {
    const querySnapshot = await getDocs(collection(db, "sentences"));
    const data = querySnapshot.docs.map(doc => doc.data());
    setSentences(data);
  };

  const handleAdd = async () => {
    if (korean && english) {
      await addDoc(collection(db, "sentences"), { korean, english });
      setKorean(""); setEnglish("");
      fetchSentences();
    }
  };

  const playSound = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    setShow(false);
    setCurrentIndex((prev) => (prev + 1) % sentences.length);
  };

  const handleWrong = () => {
    setWrongList([...wrongList, sentences[currentIndex]]);
    handleNext();
  };

  useEffect(() => {
    fetchSentences();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>GrimEnglish1 연습모드</h1>

      <div>
        <input placeholder="한국어" value={korean} onChange={e => setKorean(e.target.value)} />
        <input placeholder="영어" value={english} onChange={e => setEnglish(e.target.value)} />
        <button onClick={handleAdd}>문장 추가</button>
      </div>

      <hr />

      {sentences.length > 0 && (
        <div
          onClick={() => {
            if (!show) {
              setShow(true);
              setTimeout(() => {
                playSound(sentences[currentIndex].english);
              }, 300);
            }
          }}
          style={{
            marginTop: 30,
            width: "90%",
            maxWidth: 400,
            margin: "0 auto",
            padding: 40,
            border: "1px solid #ccc",
            borderRadius: 12,
            textAlign: "center",
            transition: "all 0.3s",
            background: show ? "#f0f0f0" : "#fff",
            cursor: "pointer"
          }}
        >
          <div style={{ fontSize: 20 }}>
            {show
              ? sentences[currentIndex].english
              : sentences[currentIndex].korean}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={handleNext}>다음</button>
        <button onClick={handleWrong}>오답</button>
      </div>

      <h3>📕 오답 노트</h3>
      <ul>
        {wrongList.map((item, idx) => (
          <li key={idx}>{item.korean} → {item.english}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
