// src/pages/GiwaDetail.jsx
import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import ArtifactViewer from '../components/ArtifactViewer';
import giwaModel from '../assets/giwa_3d.glb';

export default function GiwaDetail() {
  return (
    <Layout gradient>
      <ContentWrapper>
        <Title>화문기와(花紋瓦)</Title>

        {/* 3D 모델 뷰어 */}
        <ViewerWrapper>
          <ArtifactViewer modelPath={giwaModel} />
        </ViewerWrapper>

        <InfoBox>
          <InfoItem><Label>명칭 |</Label> 화문기와</InfoItem>
          <InfoItem><Label>시대 |</Label> 조선시대</InfoItem>
          <InfoItem><Label>재질 |</Label> 토기(점토를 고온에서 구운 재질)</InfoItem>
          <InfoItem><Label>크기 |</Label> 지름 9cm</InfoItem>
          <InfoItem><Label>용도 |</Label> 건축 장식용 기와</InfoItem>
        </InfoBox>

        <BackButton onClick={() => window.history.back()}>
          다시 대화로 돌아가기
        </BackButton>
      </ContentWrapper>
    </Layout>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 0.5rem; /* 제목과 모델 간격 줄임 */
`;

const ViewerWrapper = styled.div`
  width: 100%;
  max-width: 500px;   /* PC에서는 최대 500px */
  aspect-ratio: 1;    /* 정사각형 유지 → 반응형 */
`;

const InfoBox = styled.div`
  background-color: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  width: 90%;          /* 반응형 너비 */
  max-width: 400px;    /* 너무 넓어지지 않도록 제한 */
  margin-top: 0.3rem;  /* 유물과 텍스트 박스 간격 최소화 */
  margin-bottom: 1rem;
  text-align: left;
`;

const InfoItem = styled.p`
  font-size: 0.95rem;
  margin: 0.2rem 0;
  line-height: 1.5;
`;

const Label = styled.span`
  color: #948979;
  font-weight: 500;
  margin-right: 0.4rem;
`;

const BackButton = styled.button`
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  background-color: #948979;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;

  /* InfoBox와 같은 너비 */
  width: 90%;
  max-width: 400px;

  &:hover {
    background-color: #7f776a;
  }
`;
