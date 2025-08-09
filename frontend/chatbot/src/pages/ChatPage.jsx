// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMenu, FiVolume2, FiVolumeX, FiSend, FiEye, FiCornerUpLeft, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 상태
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate(); 

  // 사용자 ID 설정
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
  setMessages((prev) => {
      const updated = [...prev, userMessage];
      localStorage.setItem('chat_messages', JSON.stringify(updated));
      return updated;
    });
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

    const gptMessage = {
      sender: 'gpt',
      text: data.response,
      audio_url: data.audio_url,
    };

    setMessages((prev) => {
      const updated = [...prev, gptMessage];
      localStorage.setItem('chat_messages', JSON.stringify(updated));
      return updated;
    });

      // 오디오 재생 처리
      if (data.audio_url && isVolumeOn) {
        const audio = new Audio(data.audio_url);
        setIsSpeaking(true);

        audio.play()
          .then(() => {
            audio.onended = () => setIsSpeaking(false);
          })
          .catch((err) => {
            console.error('오디오 재생 실패:', err);
            setIsSpeaking(false);
          });

        audio.onerror = () => {
          console.error('오디오 재생 오류 발생');
          setIsSpeaking(false);
        };
      }

    } catch (err) {
      console.error('API 요청 실패:', err);
      const errorMessage = { sender: 'gpt', text: '죄송합니다. 응답을 가져오는 데 실패했어요.' };
      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        localStorage.setItem('chat_messages', JSON.stringify(updated));
        return updated;
      });
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

        {isVolumeOn ? (
          <FiVolume2
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsVolumeOn(false)}
          />
        ) : (
          <FiVolumeX
            size={20}
            style={{ cursor: 'pointer', opacity: 0.6 }}
            onClick={() => setIsVolumeOn(true)}
          />
        )}

        {menuOpen && (
          <DropdownMenu>
            <MenuItem onClick={() => navigate('/detail')}>
              <FiEye /> 유물 살펴보기
            </MenuItem>
            <MenuItem onClick={() => setMenuOpen(false)}>
              <FiCornerUpLeft /> 다시 대화로 돌아가기
            </MenuItem>

            {/* 대화 초기화 메뉴 항목 추가 */}
            <MenuItem
            onClick={() => {
              sessionStorage.removeItem('chat_messages'); 
              setMessages([]);                             
              setMenuOpen(false);                          
            }}
          >
            <FiTrash2 /> 대화 초기화
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
                    if (!isVolumeOn) return;
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

      {isSpeaking && <TypingAlert>🗣 유물이 말하고 있어요...</TypingAlert>}

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

const TypingAlert = styled.div`
  background-color: #1f2937;
  color: #e2e8f0;
  font-size: 0.85rem;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  text-align: center;
  margin: 0 auto 0.4rem auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: fit-content;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
