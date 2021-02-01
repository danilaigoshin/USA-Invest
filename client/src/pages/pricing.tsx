import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { HeaderTitle } from '../componenets/Header';
import Footer from '../containers/Footer';
import Navbar from '../containers/Navbar';
import { changeModal } from '../store/actions/modal';
import { AppState, Theme } from '../store/interfaces';
import { device } from '../themes/device';

const ConItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;

  @media (max-width: 1050px) {
    flex-direction: column;
    height: 100%;
    margin: 20px 0;
  }
`;

const Item = styled.div`
  width: 360px;
  min-height: 300px;
  background: ${({ theme }: Theme) => theme.colors.secondary};
  border-radius: 40px;
  margin: 0px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.25s ease;
  position: relative;

  @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
    margin-bottom: 30px;
    margin-top: 15px;
  }

  &.color {
    background: ${({ theme }: Theme) => theme.colors.text};
    color: ${({ theme }: Theme) => theme.colors.background};
    transform: scale(1.1);

    @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
      transform: none;
    }
  }

  & b {
    padding: 0px 4px;
    display: inline-block;
  }
  &:hover {
    transform: scale(1.05);
  }
  & .color:hover {
    transform: scale(1.15);
  }

  & header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    width: 100%;
  }
  & header h3 {
    font-size: 2rem;
  }
  & header p {
    font-size: 1.2rem;
  }
  & ul {
    padding: 20px 0px;
    flex: 1;
    width: 100%;
  }
  & ul li {
    width: 100%;
    padding: 10px;
    text-align: center;
  }
  & ul li i {
    font-size: 1.6rem;
    margin-right: 15px;
  }
  & button {
    padding: 14px 20px;
    width: 100%;
    background: ${({ theme }: Theme) => theme.colors.text};
    border: 3px solid transparent;
    border-radius: 20px;
    color: ${({ theme }: Theme) => theme.colors.background};
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.25s ease;
    outline: none;
  }
  &.color button {
    background: ${({ theme }: Theme) => theme.colors.secondary};
    color: ${({ theme }: Theme) => theme.colors.text};
  }
  & button:not(.border):hover {
    transform: translate(0, 5px);
  }
`;

const Item2 = styled.div`
  z-index: 2;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.1);

    @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
      transform: scale(1.05);
    }
  }
`;

const Pricing = () => {
  const user = useSelector((state: AppState) => state.auth!.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const buyHandler = (tariff: string) => {
    if (user) {
      if (user.email) {
        router.push(`/api/my/buysubscription/${tariff}`);
      } else {
        dispatch(changeModal({ modalOpen: true, currentModal: 'email' }));
      }
    } else {
      dispatch(changeModal({ modalOpen: true, currentModal: 'login' }));
    }
  };

  return (
    <>
      <HeaderTitle
        title="Тарифы - USA Invest"
        desc="USA Invest - помогаем инвесторам подобрать лучшие компании на американском фондовом рынке"
      />
      <Navbar />

      <ConItems>
        <Item style={{ paddingRight: 45 }}>
          <header>
            <h3>Базовый</h3>
            <p>
              <b>300 ₽</b>
            </p>
          </header>
          <ul>
            <li>Подписка на идеи</li>
            <li>на 1 месяц</li>
          </ul>
          <button onClick={() => buyHandler('basic')}>Выбрать</button>
        </Item>
        <Item2>
          <Item className="color">
            <header>
              <h3>Стандарт</h3>
              <p>
                <b>1500 ₽</b>
              </p>
            </header>
            <ul>
              <li>Подписка на идеи</li>
              <li>на 6 месяцев</li>
            </ul>

            <button onClick={() => buyHandler('standart')} className="border">
              Выбрать
            </button>
          </Item>
        </Item2>
        <Item style={{ paddingLeft: 45 }}>
          <header>
            <h3>Премиум</h3>
            <p>
              <b>2700 ₽</b>
            </p>
          </header>
          <ul>
            <li>Подписка на идеи</li>
            <li>на 12 месяцев</li>
          </ul>
          <button onClick={() => buyHandler('premium')}>Выбрать</button>
        </Item>
      </ConItems>

      <Footer />
    </>
  );
};

export default Pricing;
