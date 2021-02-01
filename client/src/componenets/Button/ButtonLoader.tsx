import { darken, lighten } from 'polished';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../store/interfaces';
import { ButtonModal } from './ButtonModal';

const load8 = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`;

const ButtonModalLoader = styled(ButtonModal)`
  padding: 8px 20px;
  justify-content: center;
  display: flex;
`;

const Loader = styled.div`
  border-radius: 50%;
  width: 10em;
  height: 10em;
  font-size: 3px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid ${({ theme }: Theme) => theme.colors.text};
  border-right: 1.1em solid ${({ theme }: Theme) => theme.colors.text};
  border-bottom: 1.1em solid ${({ theme }: Theme) => theme.colors.text};
  border-left: 1.1em solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? lighten('0.1', theme.colors.secondary)
        : darken('0.05', theme.colors.background)};
  transform: translateZ(0);
  animation: ${load8} 1.1s infinite linear;
`;

const ButtonLoader = () => {
  return (
    <ButtonModalLoader>
      <Loader>Loading...</Loader>
    </ButtonModalLoader>
  );
};

export { ButtonLoader };
