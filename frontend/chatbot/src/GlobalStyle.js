// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'SeoulHangang CL', sans-serif;
  }
  body {
    background-color: #0f1722;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
