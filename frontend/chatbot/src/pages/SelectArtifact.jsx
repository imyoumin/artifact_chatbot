import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';

export default function SelectArtifact() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container>
        <Title>🛠 개발자 전용 유물 선택</Title>
        <Subtitle>어떤 유물 페이지로 이동할까요?</Subtitle>

        <ButtonGroup>
          <SelectButton onClick={() => navigate('/giwa/home')}>
            기와 페이지로 이동
          </SelectButton>
          <SelectButton onClick={() => navigate('/baekja/home')}>
            백자 페이지로 이동
          </SelectButton>
        </ButtonGroup>
      </Container>
    </Layout>
  );
}

// ======================== Styled Components ========================
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #ccc;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 280px;
`;

const SelectButton = styled.button`
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #948979;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #7f776a;
    transform: scale(1.05);
  }
`;
