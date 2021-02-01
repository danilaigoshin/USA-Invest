import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { changeTheme } from '../../store/actions/theme';
import { themeDark, themeWhite } from '../../themes';

const ToogleThemeButton = styled.input.attrs({ type: 'checkbox' })`
  position: relative;

  width: 45px;
  height: 22px;
  margin-left: 20px;

  vertical-align: top;

  background: ${({ theme }: Theme) => theme.colors.background};
  border: 1px solid #bbc1e1;
  border-radius: 30px;
  outline: none;
  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  transition: all 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2);

  &::after {
    content: '';

    position: absolute;
    left: 3px;
    top: 2px;

    width: 16px;
    height: 16px;
    background-color: ${({ theme }: Theme) => theme.colors.text};
    border-radius: 50%;

    transform: translateX(0);

    transition: all 0.3s cubic-bezier(0.2, 0.85, 0.32, 1.2);
  }

  &:checked::after {
    transform: translateX(calc(100% + 3px));
    background-color: ${({ theme }: Theme) => theme.colors.text};
  }

  &:checked {
    background-color: ${({ theme }: Theme) => theme.colors.background};
  }
`;

export const ToogleTheme = () => {
  const [theme, setTheme] = useState('dark');
  const dispatch = useDispatch();

  const toogleThemeHandler = () => {
    if (theme === 'dark') {
      dispatch(changeTheme(themeWhite));
      setTheme('white');
    } else {
      dispatch(changeTheme(themeDark));
      setTheme('dark');
    }
  };

  return <ToogleThemeButton onClick={toogleThemeHandler} />;
};
