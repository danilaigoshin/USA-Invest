import styled from 'styled-components';
import { lighten } from 'polished';
import { Theme } from '../../store/interfaces';
import { device } from '../../themes/device';

export const Input = styled.input`
  padding: 15px 20px;
  border: 0px;
  background: ${({ theme }: Theme) => theme.colors.secondary};
  border-radius: 20px;
  color: ${({ theme }: Theme) => lighten('0.05', theme.colors.text)};
  outline: none;
  width: 100%;
  font-size: 13px;

  ::placeholder {
    color: ${({ theme }: Theme) => lighten('0.05', theme.colors.text)};

    @media ${device.mobile} {
      font-size: 11px;
    }
  }
`;
