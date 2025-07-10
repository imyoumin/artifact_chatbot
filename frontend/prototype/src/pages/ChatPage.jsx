// src/pages/ChatPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: 'gpt', text: '무엇이 궁금하신가요?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // GPT 응답 시뮬레이션
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'gpt', text: '이 유물은 고려 시대에 만들어졌습니다.' }
      ]);
    }, 1000);
  };

  return (
    <ChatContainer>
      <ArtifactImage src="/artifact.jpg" alt="artifact" />
      <MessagesArea>
        {messages.map((msg, idx) => (
          <Message key={idx} isUser={msg.sender === 'user'}>
            {msg.text}
          </Message>
        ))}
      </MessagesArea>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="유물에게 질문해보세요"
        />
        <SendButton onClick={handleSend}>전송</SendButton>
      </InputArea>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  background-color: #0d0d0d;
  color: white;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArtifactImage = styled.img`
  width: 240px;
  height: auto;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const MessagesArea = styled.div`
  width: 100%;
  max-width: 600px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Message = styled.div`
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? '#1e90ff' : '#1a1a1a')};
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  max-width: 80%;
  font-size: 1rem;
`;

const InputArea = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 8px 0 0 8px;
  border: none;
  outline: none;
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #187bcd;
  }
`;