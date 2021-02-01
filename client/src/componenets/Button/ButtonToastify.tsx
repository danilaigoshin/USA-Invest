import { darken, lighten } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { ToastContainer, Slide, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MyToastContainerProps extends ToastContainerProps {
  bgColor: string;
}

const WrappedToastContainer = ({
  className,
  ...rest
}: MyToastContainerProps & { className?: string }) => (
  <div className={className}>
    <ToastContainer {...rest} />
  </div>
);

const StyledContainer = styled(WrappedToastContainer).attrs((props) => ({
  bgColor: props.bgColor,
}))`
  .Toastify__progress-bar {
    background: ${(props) => props.bgColor};
  }

  .Toastify__toast {
    background: ${({ theme }: Theme) => theme.colors.secondary};
    color: ${({ theme }: Theme) => theme.colors.text};
    border-radius: 10px;
    margin-right: 10px;
  }

  .Toastify__close-button {
    color: ${({ theme }: Theme) => theme.colors.text};
  }
`;

const Button = styled.button`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;

  align-items: center;
  justify-content: center;
  text-align: center;
  height: 32px;
  background: none;
  padding: 19px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.7', theme.colors.text)};

  border-radius: 15px;
  color: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.1', theme.colors.text)
      : darken('0.05', theme.colors.text)};

  outline: none;
  font-size: 15px;
  cursor: pointer;
`;

const ButtonText = styled.p`
  justify-content: center;
  align-items: center;
  display: flex;
  margin-left: 10px;
`;

const CloseIcon = styled.img`
  height: 17px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

interface IProps {
  toastifyColor: string;
  eventHandler: () => Promise<void>;
}

const ButtonToastify: FC<IProps> = ({ toastifyColor, eventHandler }) => {
  return (
    <>
      <Button onClick={() => eventHandler()}>
        <ButtonText>
          В портфель{' '}
          <span style={{ margin: '3px 0 0 16px' }}>
            <CloseIcon src="/Icons/briefcase.svg" />
          </span>
        </ButtonText>
      </Button>

      <StyledContainer limit={1} bgColor={toastifyColor} transition={Slide} />
    </>
  );
};

export { ButtonToastify };
