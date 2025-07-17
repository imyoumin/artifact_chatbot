// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMenu, FiVolume2, FiSend } from 'react-icons/fi';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
  const storedId = localStorage.getItem('user_id');
  if (!storedId) {
    const newId = crypto.randomUUID(); // 브라우저 지원됨
    localStorage.setItem('user_id', newId);
    }
  }, []);

  // GPT 응답 받아오기
  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  const formData = new FormData();
  const userId = localStorage.getItem('user_id');
  formData.append('user_id', userId);
  formData.append('message', input);

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { sender: 'gpt', text: data.response },
    ]);

    // 음성 응답이 있다면: 자동재생(선택사항)
    if (data.audio_url) {
      const audio = new Audio(data.audio_url);
      audio.play();
    }

  } catch (err) {
    console.error('API 요청 실패:', err);
    setMessages((prev) => [
      ...prev,
      { sender: 'gpt', text: '죄송합니다. 응답을 가져오는 데 실패했어요.' },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  return (
    <ChatContainer>
      <TopBar>
        <FiMenu size={20} />
        <FiVolume2 size={20} />
      </TopBar>

      <MessagesArea>
        {messages.length === 0 ? (
          <Placeholder>무엇이든 물어보세요. 유물이 답합니다.</Placeholder>
        ) : (
          messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === 'user'}>
              {msg.text}
            </Message>
          ))
        )}
        {isTyping && <TypingIndicator />}
      </MessagesArea>

      <InputArea>
        <StyledInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요"
        />
        <SendButton onClick={handleSend}>
          <FiSend size={18} />
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
}

// ======================== TypingIndicator 컴포넌트 ========================

function TypingIndicator() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <TypingBubble>
      {'·'.repeat(dotCount)}
    </TypingBubble>
  );
}

// ======================== Styled Components ========================

const ChatContainer = styled.div`
  background-color: #0f1722;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 48px;
  padding: 0 1rem;
  background-color: #0f1722;
  border-bottom: 1px solid #1e1e1e;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Placeholder = styled.div`
  color: #888;
  font-size: 0.95rem;
  text-align: center;
  margin-top: 2rem;
`;

const Message = styled.div`
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) =>
    props.isUser ? '#b6a089' : '#1e293b'};
  color: ${(props) => (props.isUser ? '#ffffff' : '#e5e5e5')};
  padding: 0.8rem 1rem;
  border-radius: 16px;
  margin: 0.4rem 0;
  max-width: 75%;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const TypingBubble = styled.div`
  align-self: flex-start;
  background-color: #1e293b;
  color: #e5e5e5;
  padding: 0.7rem 1rem;
  border-radius: 16px;
  font-size: 1rem;
  margin: 0.4rem 0;
  max-width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 2px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  background-color: #0f1722;
  border-top: 1px solid #1e1e1e;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 18px 0 0 18px;
  background-color: #1e293b;
  color: white;
  font-size: 0.95rem;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  background-color: #b6a089;
  border: none;
  border-radius: 0 18px 18px 0;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #9e8a73;
  }

  svg {
    color: white;
  }
`;
