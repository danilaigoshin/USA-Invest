import { darken, lighten } from 'polished';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { ButtonCommon } from './ButtonCommon';

export const Button = styled(ButtonCommon)`
  padding: 19px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.3', theme.colors.text)
        : lighten('0.2', theme.colors.text)};

  border-radius: 15px;
  color: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.1', theme.colors.text)
      : darken('0.05', theme.colors.text)};

  outline: none;
  width: 200px;
  font-size: 15px;
  cursor: pointer;
`;
