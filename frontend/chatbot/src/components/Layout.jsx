// src/components/Layout.jsx
import React from "react";
import styled from "styled-components";

/**
 * 모든 페이지에 공통 적용되는 Layout
 * - 기본 배경 다크톤 (#0f1722)
 * - gradient prop이 true면 radial-gradient 배경
 */
export default function Layout({ children, gradient }) {
  return <Container $gradient={gradient}>{children}</Container>;
}

const Container = styled.div`
  background: ${({ $gradient }) =>
    $gradient
      ? "radial-gradient(circle at center, #1c2230 0%, #0f1722 70%)"
      : "#0f1722"};
  color: #ffffff;
  min-height: 100vh;
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;
