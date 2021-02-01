import styled from 'styled-components';
import { darken, lighten } from 'polished';
import { Theme } from '../../store/interfaces';

export const ButtonModal = styled.button`
  padding: 15px 20px;
  border: 0px;
  background: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? darken('0.1', theme.colors.text)
      : lighten('0.2', theme.colors.text)};

  margin: 10px 0;
  border-radius: 20px;
  color: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.05', theme.colors.background)
      : darken('0.05', theme.colors.background)};
  outline: none;
  width: 100%;
  font-size: 13px;
  cursor: pointer;
`;
