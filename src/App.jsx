import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  return (
    <div style={{ padding: 20 }}>
      <h1>GrimEnglish1 퀴즈 앱</h1>
      <p>당신의 이름을 입력하세요:</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="예: 홍길동"
      />
      {name && <h2>환영합니다, {name}님!</h2>}
    </div>
  );
}

export default App;