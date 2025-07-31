// src/pages/DetailPage.jsx
import React from 'react';
import styled from 'styled-components';
import artifactImg from '../assets/artifact.gif'; // 유물 이미지

export default function DetailPage() {
  return (
    <Container>
      <ContentWrapper>
        <Tag>유물</Tag>

        <Title>물고기 연적(硯滴)</Title>

        <ArtifactImage src={artifactImg} alt="유물 이미지" />

        <InfoBox>
          <InfoItem><Label>명칭 |</Label> 물고기 모양 연적</InfoItem>
          <InfoItem><Label>시대 |</Label> 조선시대 (18세기 추정)</InfoItem>
          <InfoItem><Label>재질 |</Label> 백자</InfoItem>
          <InfoItem><Label>크기 |</Label> 길이 9.2cm × 높이 4.5cm</InfoItem>
          <InfoItem><Label>용도 |</Label> 먹을 갈 때 물을 떨어뜨리는 도구</InfoItem>
        </InfoBox>

        <BackButton onClick={() => window.history.back()}>다시 대화로 돌아가기</BackButton>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  background: radial-gradient(
    circle at center,
    #1c2230 0%,
    #0f1722 70%
  );
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;   /* 세로 중앙 */
  align-items: center;       /* 가로 중앙 */
  text-align: center;
  padding: 0;                /* 여백 제거 */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem; /* 요소 간 간격 */
`;


const Tag = styled.div`
  background-color: #948979;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ArtifactImage = styled.img`
  width: 380px;
  height: auto;
  margin: 1.5rem 0;
`;

const InfoBox = styled.div`
  background-color: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 2rem;
  text-align: left; /* 왼쪽 정렬 */
`;

const InfoItem = styled.p`
  font-size: 0.95rem;
  margin: 0.3rem 0;
  line-height: 1.6;
`;

const Label = styled.span`
  color: #948979;
  font-weight: 500;
  margin-right: 0.4rem;
`;

const BackButton = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #948979;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  margin-top: auto;

  &:hover {
    background-color: #7f776a;
  }
`;
