import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { darken, lighten } from 'polished';
import React, { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logoutUser } from '../../store/actions/auth';
import { changeModal } from '../../store/actions/modal';
import { AppState, Theme } from '../../store/interfaces';
import { device } from '../../themes/device';

const Background = styled.div`
  border-top: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.8', theme.colors.text)
        : lighten('0.8', theme.colors.text)};
`;

const FooterWrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  padding: 50px 0;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SiteName = styled.p`
  font-size: 14px;
  text-align: center;
`;

const HR = styled.hr`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.8', theme.colors.text)
        : lighten('0.8', theme.colors.text)};
`;

const Info = styled.p`
  padding-top: 10px;
  text-align: left;
  color: ${({ theme }: Theme) => theme.colors.text};
  line-height: 1.3;

  @media ${device.mobile} {
    font-size: 14px;
  }
`;

const Ul = styled.div`
  display: inline-block;
  text-align: left;
  width: 200px;
`;

const Li = styled.div`
  width: 100%;
  padding-bottom: 20px;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const Img = styled.img`
  width: 80px;
  height: 80px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const Footer = () => {
  const user = useSelector((state: AppState) => state.auth?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const changeCurrentModal = (e: MouseEvent<HTMLElement>, value: string) => {
    e.preventDefault();
    dispatch(changeModal({ modalOpen: true, currentModal: value }));
  };

  const LogoutHandler = async () => {
    await axios.get('/api/accounts/signout');
    dispatch(logoutUser());
    router.push('/');
  };

  return (
    <Background>
      <FooterWrapper>
        <MainInfo>
          <Ul>
            <Li>
              <Link href="/ideas">
                <a>Идеи</a>
              </Link>
            </Li>
            <Li>
              <Link href="/screener">
                <a>Скринер</a>
              </Link>
            </Li>
            <Li>
              <Link href="/cycles">
                <a>Циклы</a>
              </Link>
            </Li>
            <Li>
              <Link href="/terms">
                <a>Договор оферты</a>
              </Link>
            </Li>
          </Ul>

          {user && (
            <Ul>
              <Li>
                <Link href="/my">
                  <a>Мои данные</a>
                </Link>
              </Li>
              <Li>
                <Link href="/my/portfolio">
                  <a>Портфель</a>
                </Link>
              </Li>
              <Li>
                <a onClick={LogoutHandler}>Выйти</a>
              </Li>
              <Li>
                <Link href="/contacts">
                  <a>Контакты и реквизиты</a>
                </Link>
              </Li>
            </Ul>
          )}

          {!user && (
            <Ul>
              <Li>
                <a onClick={(e) => changeCurrentModal(e, 'login')}>Вход</a>
              </Li>
              <Li>
                <a onClick={(e) => changeCurrentModal(e, 'register')}>
                  Регистрация
                </a>
              </Li>
              <Li>
                <a onClick={(e) => changeCurrentModal(e, 'forgot')}>
                  Забыли пароль
                </a>
              </Li>
              <Li>
                <Link href="/contacts">
                  <a>Контакты и реквизиты</a>
                </Link>
              </Li>
            </Ul>
          )}

          <Ul>
            <ImageWrapper>
              <Img src="/logo.svg" />
            </ImageWrapper>
            <SiteName>© {new Date().getFullYear()} USA-Invest.ru</SiteName>
          </Ul>
        </MainInfo>

        <HR />
        <Info>
          Любая информация, предоставленная на сайте USA-Invest.ru, носит
          исключительно справочный характер, не является публичной офертой к
          купле/продаже каких-либо ценных бумаг или осуществлению любых иных
          инвестиций, и используется Пользователем исключительно на свой страх и
          риск. Материалы USA-Invest.ru не могут рассматриваться или
          использоваться в качестве индивидуальных инвестиционных рекомендаций.
          USA-Invest.ru не осуществляет деятельность по инвестиционному
          консультированию и не является инвестиционным советником. Для лиц
          старше 18 лет.
        </Info>
      </FooterWrapper>
    </Background>
  );
};

export default Footer;
