import styled from 'styled-components';
import { darken, lighten } from 'polished';
import { Theme } from '../../store/interfaces';

export const InputModal = styled.input`
  padding: 15px 20px;
  border: 0px;
  background: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.1', theme.colors.secondary)
      : darken('0.05', theme.colors.background)};

  margin: 15px 0;
  border-radius: 20px;
  color: ${({ theme }: Theme) => theme.colors.text};
  outline: none;
  width: 100%;
  font-size: 13px;

  ::placeholder {
    color: ${({ theme }: Theme) => theme.colors.text};
  }
`;
