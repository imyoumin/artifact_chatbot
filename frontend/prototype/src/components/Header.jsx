// src/components/Header.jsx
import React from 'react';
import styled from 'styled-components';

export default function Header() {
  return (
    <HeaderBar>
      Talk to the Artifact
    </HeaderBar>
  );
}

const HeaderBar = styled.header`
  background-color: #1a1a1a;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 1px solid #333;
  color: #1e90ff;
  text-align: center;
`;
