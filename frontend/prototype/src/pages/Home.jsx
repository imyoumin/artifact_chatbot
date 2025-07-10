// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Talk to the Artifact</Title>
      <Subtitle>유물에게 말을 걸어보세요.</Subtitle>
      <StartButton onClick={() => navigate('/chat')}>시작하기</StartButton>
    </Container>
  );
}

const Container = styled.div`
  background-color: #0d0d0d;
  color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Helvetica Neue', sans-serif;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #cccccc;
`;

const StartButton = styled.button`
  padding: 0.9rem 2.2rem;
  font-size: 1rem;
  background-color: #1e90ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #187bcd;
    transform: scale(1.05);
  }
`;