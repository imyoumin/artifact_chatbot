// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMenu, FiVolume2, FiSend } from 'react-icons/fi';
import { FiEye, FiCornerUpLeft } from 'react-icons/fi'; //  드롭 아이콘
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 상태
  const navigate = useNavigate();   

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

  console.log("현재 fetch URL: http://127.0.0.1:8000/chat"); // ← 디버깅용 로그

  const userMessage = { sender: 'user', text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  const formData = new FormData();
  const userId = localStorage.getItem('user_id');
  formData.append('user_id', userId);
  formData.append('message', input);

  try {
    const res = await fetch('http://127.0.0.1:8000/chat', {  // ← 포트 8000으로 변경
        method: 'POST',
        body: formData,
    });


    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { sender: 'gpt', text: data.response, audio_url: data.audio_url },
    ]);

    // 음성 응답 자동 재생
    if (data.audio_url) {
      const audio = new Audio(data.audio_url);
      audio.play().catch(err => console.error('오디오 재생 실패:', err));
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
        <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu size={22} />
        </MenuButton>
        <FiVolume2 size={20} />
        {menuOpen && (
          <DropdownMenu>
            <MenuItem onClick={() => navigate('/detail')}>
              <FiEye /> 유물 살펴보기
            </MenuItem>
            <MenuItem onClick={() => setMenuOpen(false)}>
              <FiCornerUpLeft /> 다시 대화로 돌아가기
            </MenuItem>
          </DropdownMenu>
        )}
      </TopBar>

      <MessagesArea>
        {messages.length === 0 ? (
          <Placeholder>무엇이든 물어보세요. 유물이 답합니다.</Placeholder>
        ) : (
          messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === 'user'}>
              {msg.text}

              {/* GPT 답변이고 audio_url이 있을 때만 스피커 버튼 추가 */}
              {msg.sender === 'gpt' && msg.audio_url && (
                <SpeakerButton onClick={() => {
                    console.log("재생할 오디오 URL:", msg.audio_url);
                    const audio = new Audio(msg.audio_url);
                    audio.play().catch(err => console.error('오디오 재생 실패:', err));
                  }}
                >
                  🔊
                </SpeakerButton>
              )}
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
            onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
            }}
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
  position: relative; /* 메뉴 위치 기준 */
`;

const TopBar = styled.div`
  height: 48px;
  padding: 0 1rem;
  background-color: #0f1722;
  border-bottom: 1px solid #ffffff33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
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

const MenuButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  left: 10px;
  background-color: #1e293b;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 0.6rem 0.8rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 6px;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
`;

const SpeakerButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    opacity: 0.8;
  }
`;
