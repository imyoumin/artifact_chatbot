// src/pages/GiwaHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout'; // 공통 레이아웃 import
import artifactGif from '../assets/artifact.gif';
import questionIcon from '../assets/question.png';

export default function Home() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/giwa/chat');
    }
  };

  // 페이지 인디케이터
  const PageIndicator = ({ step, onDotClick }) => (
    <IndicatorWrapper>
      {[1, 2, 3, 4].map((num) => (
        <Dot
          key={num}
          $active={step === num}
          onClick={() => onDotClick(num)}
          role="button"
          aria-label={`Go to step ${num}`}
        />
      ))}
    </IndicatorWrapper>
  );

  return (
    <Layout>
      {step === 1 && (
        <>
          <Title>
            유물과의 대화가 <br /> 시작됩니다
          </Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>
          <ArtifactImage src={artifactGif} alt="움직이는 유물 이미지" /> 
          <Description>
            <p>이 유물은 수백 년의 시간을 지나 지금, <br /> 당신 앞에 도착했습니다.</p>
            <p>오랜 기간 침묵했지만, 기억은 여전히 살아있습니다.<br />세월의 층을 지나 지금 다시 깨어납니다.<br />이제 당신의 말이 필요합니다.</p>
            <p>무엇이든 자유롭게 물어보세요.<br />이 공간은 인공지능을 통해<br />유물의 목소리로 답을 전합니다.</p>
          </Description>
        </>
      )}

      {step === 2 && (
        <>
          <Title>유물과의 대화가 <br /> 시작됩니다</Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>
          <Description>
            <p>이 둥근 조각은 단순한 장식이 아닙니다.<br />
               시간을 머금은 화문기와(花紋瓦)는 조선시대 선비의 책상 위에 놓였던 섬세한 도구입니다.</p>
            <p>연꽃 문양엔 평안과 정결의 바람이 담겼고,<br /> 비와 바람 속에서도 꺾이지 않던 마음이 새겨졌습니다.</p>
            <p>이 유물은 단지 흙으로 만든 기와가 아닌, 누군가의 염원이 머물던 시간의 조각입니다.</p>
          </Description>
        </>
      )}

      {step === 3 && (
        <>
          <Title>유물과의 대화가 <br /> 시작됩니다</Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>
          <GuideWrapper>
            <Icon src={questionIcon} alt="질문 아이콘" />
            <QuestionGuide>이렇게 질문해봐요</QuestionGuide>
          </GuideWrapper>
          <QuestionBox>예전에는 어떤 사람들과 어떤 상황에서 사용되었는지 알고 싶어요.</QuestionBox>
          <QuestionBox>당신이 기억하는 이야기 중에 지금 꼭 전하고 싶은 것이 있다면 무엇인가요?</QuestionBox>
          <QuestionBox>수백 년의 시간이 흘렀지만, 아직도 기억 속에 남아 있는 장면이 있나요?</QuestionBox>
        </>
      )}

      {step === 4 && (
        <>
          <Title>유물과의 대화가 <br /> 시작됩니다</Title>
          <Subtitle>유물과의 대화는 소중한 기록입니다</Subtitle>
          <NoticeCard>
            <NoticeIcon src={require('../assets/info.png')} alt="안내 아이콘" />
            <p>유물과 나누는 대화는 <Highlight>더 나은 경험을 만들기 위한 소중한 기록</Highlight>이 됩니다.</p>
            <p>모든 대화 내용은 별도의 DB에 저장되며, <Highlight>전시 개선 및 연구 목적</Highlight>에 활용될 수 있습니다.</p>
            <p><Highlight>개인 정보는 수집되지 않으며,</Highlight><br /> 대화 내용은 <Highlight>익명으로 안전하게 처리</Highlight>됩니다.</p>
            <p>안심하고 유물과 대화를 시작해보세요.</p>
          </NoticeCard>
        </>
      )}

      <PageIndicator step={step} onDotClick={setStep} />

      {/* ✅ 고정된 버튼 */}
      <NextButton onClick={handleNext} label={step < 4 ? '다음' : '유물과 대화해보기'} />
    </Layout>
  );
}

// ==================== Styled Components ====================
const Title = styled.h1`
  font-size: 35px;
  font-weight: 600;
  line-height: 1.0;
  margin-bottom: 25px;
  margin-top: 30px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 200;
  color: #cccccc;
  line-height: 1.5;
  margin-bottom: 1.2rem;
`;

const ArtifactImage = styled.img`
  width: 300px;
  height: auto;
  margin: 1.2rem auto;
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #eeeeee;
  line-height: 1.6;
  margin: 0.1rem 0 1.5rem;

  p {
    margin-bottom: 1.2rem;
  }
`;

const QuestionBox = styled.div`
  background-color: #2e2f36;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  margin: 0.5rem 0;
  width: 100%;
  font-size: 0.9rem;
  color: #fff;
  text-align: left;
`;

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
  gap: 1rem;
`;

const Dot = styled.div`
  width: 30px;
  height: 3px;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? '#948979' : '#3F4149')};
  transition: background-color 0.3s;
  cursor: pointer;
`;

const NoticeCard = styled.div`
  background-color: #1e293b;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  color: #ffffff;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  margin: 1rem 0;

  p {
    margin-bottom: 1rem;
  }
`;

const NoticeIcon = styled.img`
  width: 20px;
  height: auto;
  margin: 1px auto 10px;
  display: block;
  filter: brightness(0) invert(1);
`;

const Highlight = styled.span`
  color: #b6a089;
`;

const GuideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 1.2rem 0;
`;

const Icon = styled.img`
  width: 30px;
  height: auto;
  filter: brightness(0) invert(1);
`;

const QuestionGuide = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
`;

/* ✅ 하단 고정 버튼 컴포넌트 */
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 1.2rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 400;
  background-color: #948979;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: #7F776A;
    transform: scale(1.05);
  }
`;

/* ✅ 실제 버튼 컴포넌트 */
function NextButton({ onClick, label }) {
  return (
    <ButtonWrapper>
      <Button onClick={onClick}>{label}</Button>
    </ButtonWrapper>
  );
}
