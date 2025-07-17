// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;