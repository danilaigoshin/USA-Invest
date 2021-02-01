import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logoutUser } from '../../../store/actions/auth';
import { AppState } from '../../../store/interfaces';

const WelcomeUser = styled.div`
  font-size: 20px;
  line-height: 1.5;
`;

const LinksWrapper = styled.div`
  padding: 60px 0;
  font-size: 18px;
`;

const FullWidth = styled.div`
  width: 100%;
  padding: 14px 0;
`;

const Links = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth!.user);

  const LogoutHandler = async () => {
    await axios.get('/api/accounts/signout');
    dispatch(logoutUser());
    router.push('/');
  };

  return (
    <>
      {user && (
        <>
          <WelcomeUser>
            <p>Добро пожаловать,</p>
            <p>{user.name}</p>
          </WelcomeUser>

          <LinksWrapper>
            <FullWidth>
              <Link href="/my">
                <a>Мои данные</a>
              </Link>
            </FullWidth>
            <FullWidth>
              <Link href="/my/portfolio">
                <a>Мой портфель</a>
              </Link>
            </FullWidth>
            <FullWidth>
              <a style={{ cursor: 'pointer' }} onClick={LogoutHandler}>
                Выйти
              </a>
            </FullWidth>
          </LinksWrapper>
        </>
      )}
    </>
  );
};

export { Links };
