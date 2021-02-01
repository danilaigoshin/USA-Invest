import { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../store/interfaces';

interface IButton {
  open: boolean;
}

const StyledBurger = styled.button<IButton>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 999;

  &:focus {
    outline: none;
  }

  div {
    width: 100%;
    height: 0.15rem;
    background: ${({ theme }: Theme) => theme.colors.text};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }

    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }

    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

const Background = styled.nav`
  position: absolute;
  top: 28px;
  left: 30px;
  padding: 15px;
  border-radius: 50%;
  background: ${({ theme }: Theme) => theme.colors.secondary};
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  z-index: 999;
`;

interface IPros {
  open: boolean;
  menuHandler: () => void;
}

const Burger: FC<IPros> = ({ open, menuHandler }) => {
  return (
    <Background>
      <StyledBurger open={open} onClick={() => menuHandler()}>
        <div />
        <div />
        <div />
      </StyledBurger>
    </Background>
  );
};

export { Burger };
