// src/pages/home/NextButton.jsx
import React from "react";
import styled from "styled-components";

export default function NextButton({ onClick, label }) {
  return (
    <Wrapper>
      <Button onClick={onClick}>{label}</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;   /* ✅ 하단 고정 */
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
  font-family: 'SeoulHangang CL', sans-serif;
  background-color: #948979;
  border: none;
  border-radius: 6px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: #7F776A;
    transform: scale(1.05);
  }
`;
