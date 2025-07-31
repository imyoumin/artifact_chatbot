// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import artifactGif from '../assets/artifact.gif';
import questionIcon from '../assets/question.png'; // 아이콘 파일 추가


export default function Home() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/chat');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Container>
      {step === 1 && (
        <>
          <Title>유물과의 대화가 시작됩니다</Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>
          <ArtifactImage src={artifactGif} alt="움직이는 유물 이미지" />
          <Description>
            <p>
              이 유물은 수백 년의 시간을 지나 지금, 당신 앞에 도착했습니다. <br />
              오래기간 침묵했지만, 기억은 여전히 살아있습니다.<br /> 
              세월의 층을 지나 지금 다시 깨어납니다.<br />
            </p>
            <p>
            이젠 당신과 이야기를 나눌 준비가 되었습니다.<br /> 
            무엇이든 자유롭게 물어보세요.<br /> 
            이 공간은 인공지능을 통해 유물의 목소리로 답을 전합니다.
            </p>
          </Description>
        </>
      )}

      {step === 2 && (
        <>
          <Title>유물과의 대화가 시작됩니다</Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>
          <Description>
            <p>
            이 작고 매끄러운 물체는 단순한 장식이 아닙니다<br />
            푸른 유약 속에 숨겨진 이 물고기 모양의 연적(硯滴)은, 조선시대 선비의 책상 위에 놓였던 섬세한 도구입니다.<br />
            </p>
            <p>
            먹을 갈기 전, 한 방울씩 떨어뜨리는 물처럼 천천히, 
            그러나 분명히 시간을 흘려보낸 이 유물은 한때는 글을 쓰는 사람 곁에서 조용히 이야기를 지켜보던 존재였습니다.
            </p>
            <p>
            물고기 모양에는 '지혜'와 '행운'의 의미가 담겨있고,<br />
            선비들은 그 의미를 벼루 위에 한 방울씩 적셔내며 생각을 펼쳤습니다.
            그런 준비가 되셨다면, 저를 불러주세요.
            </p>
          </Description>
        </>
      )}

      {step === 3 && (
        <>
          <Title>유물과의 대화가 시작됩니다</Title>
          <Subtitle>무엇이든 물어보세요. 유물이 답합니다.</Subtitle>

          <GuideWrapper>
            <Icon src={questionIcon} alt="질문 아이콘" />
            <QuestionGuide>이렇게 질문해보세요</QuestionGuide>
          </GuideWrapper>

          <QuestionBox>예전에는 어떤 사람들과 어떤 상황에서 당신이 사용되었는지 알고 싶어요.</QuestionBox>
          <QuestionBox>당신이 기억하는 이야기 중에 지금 꼭 전하고 싶은 것이 있다면 무엇인가요?</QuestionBox>
          <QuestionBox>수백 년의 시간이 흘렀지만, 아직도 기억 속에 남아 있는 장면이 있나요?</QuestionBox>
        </>
      )}

      {/* 페이지 인디케이터 (클릭 가능) */}
      <PageIndicator step={step} onDotClick={setStep} />

      {/* 이전 / 다음 버튼 */}
      <ButtonWrapper>
        {step > 1 && <PreviousButton onClick={handlePrevious}>이전</PreviousButton>}
        <NextButton onClick={handleNext}>
          {step < 3 ? '다음' : '유물과 대화해보기'}
        </NextButton>
      </ButtonWrapper>
    </Container>
  );
}

// ==================== Styled Components ====================
const Container = styled.div`
  background-color: #0f1722;
  color: #ffffff;
  height: 100vh;
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Helvetica Neue', sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.4;  /* 타이틀은 좀 더 타이트 */
  margin-bottom: 0.8rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: #cccccc;
  line-height: 1.5;  /* 조금 여유 */
  margin-bottom: 1.2rem;
`;

const ArtifactImage = styled.img`
  width: 300px;
  height: auto;
  margin: 1.2rem auto;
`;

const Description = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #eeeeee;
  line-height: 1.6;  /* 본문은 읽기 좋게 넉넉한 간격 */
  margin: 0 0 1.5rem;

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

// 페이지 인디케이터
const PageIndicator = ({ step, onDotClick }) => {
  return (
    <IndicatorWrapper>
      {[1, 2, 3].map((num) => (
        <Dot
          key={num}
          active={step === num}
          onClick={() => onDotClick(num)}
          role="button"
          aria-label={`Go to step ${num}`}
        />
      ))}
    </IndicatorWrapper>
  );
};

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 0.5rem;
  gap: 1rem;
`;

const Dot = styled.div`
  width: 30px;              
  height: 3px;              
  border-radius: 10px;       
  background-color: ${({ active }) => (active ? '#948979' : '#3F4149')};
  transition: background-color 0.3s;
  cursor: pointer;
`;



// 버튼 영역
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NextButton = styled.button`
  padding: 0.7rem 1.5rem;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  font-family: 'SeoulHangang CL', sans-serif;
  background-color: #948979; /* Figma 색상 */
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); /* 20% 화이트 하이라이트 */

  &:hover {
    background-color: #7F776A;
    transform: scale(1.05);
  }
`;

const PreviousButton = styled.button`
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 400;
  font-family: 'SeoulHangang CL', sans-serif;
  background-color: #3F4149;
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); /* 동일한 하이라이트 */

  &:hover {
    background-color: #5A5B61;
    transform: scale(1.05);
  }
`;

const GuideWrapper = styled.div`
  display: flex;
  flex-direction: column;   /* 세로 정렬 */
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.2rem 0;
`;

const Icon = styled.img`
  width: 50px; /* 크기 키움 */
  height: 50px;
  filter: brightness(0) invert(1); /* 아이콘을 흰색으로 변환 */
`;

const QuestionGuide = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
`;

