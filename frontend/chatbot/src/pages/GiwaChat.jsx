// src/pages/GiwaChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiMenu, FiVolume2, FiVolumeX, FiSend, FiEye, FiCornerUpLeft, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { sendChatMessage } from '../api/chat';   // 공통 API 함수

export default function GiwaChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages_giwa');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVolumeOn, setIsVolumeOn] = useState(true);  // 음소거 상태
  const navigate = useNavigate();
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const audioRef = useRef(null); // ✅ 오디오 객체 저장

  // 사용자 ID 설정
  useEffect(() => {
    let storedId = localStorage.getItem('user_id_giwa');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('user_id_giwa', storedId);
    }
  }, []);

  // GPT 응답 받아오기
  const handleSend = async () => {
    if (!input.trim()) return;

    const userId = localStorage.getItem('user_id_giwa');
    const userMessage = { sender: 'user', text: input };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      localStorage.setItem('chat_messages_giwa', JSON.stringify(updated));
      return updated;
    });

    setInput('');
    setIsTyping(true);

    try {
      // API 호출 (artifactId = "b" → 기와용)
      const data = await sendChatMessage({
        userId,
        message: input,
        artifactId: "b",
      });

      const gptMessage = {
        sender: 'gpt',
        text: data.response,
        audio_url: data.audio_url,
      };

      setMessages((prev) => {
        const updated = [...prev, gptMessage];
        localStorage.setItem('chat_messages_giwa', JSON.stringify(updated));
        return updated;
      });

      // 오디오 자동 재생
      if (data.audio_url && isVolumeOn) {
        handlePlayAudio(data.audio_url, messages.length);
      }

    } catch (err) {
      console.error('API 요청 실패:', err);
      const errorMessage = { sender: 'gpt', text: '⚠️ 서버 응답 실패' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 오디오 재생 제어 함수
  const handlePlayAudio = (url, idx) => {
    if (!isVolumeOn) return;

    // 이미 재생 중이면 정지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setSpeakingIndex(null);

      // 같은 버튼이면 return
      if (speakingIndex === idx) return;
    }

    // 새 오디오 생성 후 재생
    const audio = new Audio(url);
    audioRef.current = audio;
    setSpeakingIndex(idx);

    audio.play()
      .then(() => {
        audio.onended = () => {
          setSpeakingIndex(null);
          audioRef.current = null;
        };
      })
      .catch((err) => {
        console.error('오디오 재생 실패:', err);
        setSpeakingIndex(null);
        audioRef.current = null;
      });
  };

  return (
    <Layout>
      <ChatWrapper>
        {/* 상단바 */}
        <TopBar>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={22} />
          </MenuButton>

          {/* 음소거 토글 */}
          {isVolumeOn ? (
            <FiVolume2 size={20} style={{ cursor: 'pointer' }} onClick={() => setIsVolumeOn(false)} />
          ) : (
            <FiVolumeX size={20} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setIsVolumeOn(true)} />
          )}

          {menuOpen && (
            <DropdownMenu>
              <MenuItem onClick={() => navigate('/giwa/detail')}>
                <FiEye /> 유물 살펴보기
              </MenuItem>
              <MenuItem onClick={() => setMenuOpen(false)}>
                <FiCornerUpLeft /> 다시 대화로 돌아가기
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem('chat_messages_giwa');
                  setMessages([]);
                  setMenuOpen(false);
                }}
              >
                <FiTrash2 /> 대화 초기화
              </MenuItem>
            </DropdownMenu>
          )}
        </TopBar>

        {/* 대화 영역 */}
        <MessagesArea>
          {messages.length === 0 ? (
            <Placeholder>무엇이든 물어보세요. 유물이 답합니다.</Placeholder>
          ) : (
            messages.map((msg, idx) => (
              <MessageWrapper key={idx} $isUser={msg.sender === 'user'}>
                <Message $isUser={msg.sender === 'user'}>
                  {msg.text}
                </Message>

                {/* GPT 답변에만 스피커 버튼 */}
                {msg.sender === 'gpt' && msg.audio_url && (
                  <SpeakerButton onClick={() => handlePlayAudio(msg.audio_url, idx)}>
                    {speakingIndex === idx ? "🔊" : "🔇"}
                  </SpeakerButton>
                )}
              </MessageWrapper>
            ))
          )}
          {isTyping && <TypingIndicator />}
        </MessagesArea>

        {/* 현재 말하는 상태 표시 */}
        {speakingIndex !== null && <TypingAlert>🗣 유물이 말하고 있어요...</TypingAlert>}

        {/* 입력 영역 */}
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
      </ChatWrapper>
    </Layout>
  );
}

// ======================== TypingIndicator ========================
function TypingIndicator() {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => setDotCount((prev) => (prev % 3) + 1), 400);
    return () => clearInterval(interval);
  }, []);
  return <TypingBubble>{'·'.repeat(dotCount)}</TypingBubble>;
}

// ======================== Styled Components ========================
const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TopBar = styled.div`
  height: 48px;
  padding: 0 1rem;
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

const MessageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  margin: 0.6rem 0;
`;

const Message = styled.div`
  background-color: ${(props) => (props.$isUser ? '#b6a089' : '#1e293b')};
  color: ${(props) => (props.$isUser ? '#ffffff' : '#e5e5e5')};
  padding: 0.8rem 1rem;
  border-radius: 16px;
  max-width: 75%;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
  text-align: left;
`;

const SpeakerButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 60px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: #d1d5db;
  }
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
  letter-spacing: 2px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
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
