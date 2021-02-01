import { createGlobalStyle } from 'styled-components';
import { Theme } from '../store/interfaces';

export const GlobalStyle = createGlobalStyle`
  @keyframes fadeIn{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    min-height: 0;
    min-width: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  html, body {
    height: 100%;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: ${({ theme }: Theme) => theme.colors.background};
    color: ${({ theme }: Theme) => theme.colors.text};
    overflow-x: hidden;
  }
  .rc-dropdown {
    position: absolute;
    z-index: 1070;
  }
  .rc-dropdown-hidden {
    display: none;
  }
  #nprogress {
    pointer-events: none;
  }
  #nprogress .bar {
    background: ${({ theme }: Theme) => theme.colors.text};
    position: fixed;
    z-index: 1031;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
  }
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #fff, 0 0 5px #fff;
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }
  ul,li {
    list-style: none;
  }

  /* width */
  ::-webkit-scrollbar {
    border-radius: 7px;
    width: 11px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #f1f1f1; 
  }
 
  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    border-radius: 10px;
    background: #555; 
  }

  .chartContainer {
    border-radius: 10px;
  }
  
  .highcharts-root {
    font-family: 'Roboto', sans-serif !important;
  }

  body :not(input):not(textarea):not([contenteditable="true"]) {
    user-select: auto !important;
  }
`;
