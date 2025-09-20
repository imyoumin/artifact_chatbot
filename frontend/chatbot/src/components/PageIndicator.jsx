// src/components/PageIndicator.jsx
import React from "react";
import styled from "styled-components";

export default function PageIndicator({ step, onDotClick }) {
  return (
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
}

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;   /* 고정 */
  bottom: 100px;      /* 버튼 위 */
  left: 0;
  right: 0;
  max-width: 420px;
  margin: 0 auto;
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
