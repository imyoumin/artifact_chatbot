// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './GlobalStyle'; 

// Giwa 세트
import GiwaHome from './pages/GiwaHome';
import GiwaChat from './pages/GiwaChat';
import GiwaDetail from './pages/GiwaDetail';

// Baekja 세트
import BaekjaHome from './pages/BaekjaHome';
import BaekjaChat from './pages/BaekjaChat';
import BaekjaDetail from './pages/BaekjaDetail';

// 개발자 전용 선택 페이지
import SelectArtifact from './pages/SelectArtifact';

function App() {
  return (
    <>
      <GlobalStyle /> 
      <Router>
        <Routes>
          {/* 🔹 개발자 전용: 유물 선택 */}
          <Route path="/" element={<SelectArtifact />} />

          {/* 🔹 기와 전용 */}
          <Route path="/giwa/home" element={<GiwaHome />} />
          <Route path="/giwa/chat" element={<GiwaChat />} />
          <Route path="/giwa/detail" element={<GiwaDetail />} />

          {/* 🔹 백자 전용 */}
          <Route path="/baekja/home" element={<BaekjaHome />} />
          <Route path="/baekja/chat" element={<BaekjaChat />} />
          <Route path="/baekja/detail" element={<BaekjaDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
