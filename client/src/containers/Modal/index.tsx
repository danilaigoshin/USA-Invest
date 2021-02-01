import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { changeModal } from '../../store/actions/modal';
import { AppState, Theme } from '../../store/interfaces';
import { Email } from './Email';
import { Forgot } from './Forgot';
import { Login } from './Login';
import { Register } from './Register';

const ModalBackdrop = styled.div`
  background-color: rgba(10, 9, 19, 0.6);
  z-index: 3;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const ModalWrapper = styled.div`
  background: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? theme.colors.secondary
      : theme.colors.background};

  z-index: 2000;
  border-radius: 15px;
  max-width: 1060px;
  margin: auto;
  width: 100%;

  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  box-sizing: border-box;
  display: grid;

  padding: 40px 0;
`;

const CloseWrapper = styled.div`
  width: 100%;
  text-align: end;
`;

const ModalText = styled.div`
  grid-column: 4/9;
  padding: 0 40px;

  @media (max-width: 1100px) {
    grid-column: 1/9;
  }
`;

const ModalImage = styled.div`
  grid-column: 2/4;
  margin-top: auto;
  margin-bottom: auto;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const ImgClose = styled.img`
  width: 35px;
  height: 35px;
  z-index: 2000;
  cursor: pointer;
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const Img = styled.img`
  width: 100%;
`;

const Modal = () => {
  const dispatch = useDispatch();
  const currentModal = useSelector(
    (state: AppState) => state.modal.currentModal
  );

  const closeModal = () => {
    dispatch(changeModal({ modalOpen: false, currentModal: '' }));
  };

  return (
    <ModalBackdrop>
      <ModalWrapper>
        <ModalImage>
          <Img src="/Icons/bg.svg" />
        </ModalImage>

        <ModalText>
          <CloseWrapper>
            <ImgClose onClick={closeModal} src="/Icons/close.svg" />
          </CloseWrapper>

          {currentModal === 'login' && <Login />}

          {currentModal === 'register' && <Register />}

          {currentModal === 'forgot' && <Forgot />}

          {currentModal === 'email' && <Email />}
        </ModalText>
      </ModalWrapper>
    </ModalBackdrop>
  );
};

export { Modal };
