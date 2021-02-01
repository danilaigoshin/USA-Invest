import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logoutUser } from '../../../store/actions/auth';
import { changeModal } from '../../../store/actions/modal';
import { AppState, Theme } from '../../../store/interfaces';

interface INav {
  open: boolean;
}

const StyledMenu = styled.nav<INav>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }: Theme) => theme.colors.secondary};
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  z-index: 99;
  cursor: pointer;

  img {
    width: 40px;
    height: 100%;
    margin-right: 25px;
    filter: ${({ theme }: Theme) => theme.colors.logo};
  }

  @media (max-width: 576px) {
    width: 100%;
  }

  a {
    font-size: 1.45rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    text-decoration: none;
    transition: color 0.3s linear;
    padding-left: 15px;

    @media (max-width: 576px) {
      font-size: 1.4rem;
      text-align: center;
    }
  }
`;

const ImgSocial = styled.img`
  filter: none !important;
  border-radius: 50%;
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface IProps {
  open: boolean;
  Links: {
    name: string;
    icon: string;
    href: string;
  }[];
  menuHandler: () => void;
}

const Menu: FC<IProps> = ({ open, Links, menuHandler }) => {
  const user = useSelector((state: AppState) => state.auth?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const openModalHandler = () => {
    dispatch(changeModal({ modalOpen: true, currentModal: 'login' }));
    menuHandler();
  };

  const LogoutHandler = async () => {
    await axios.get('/api/accounts/signout');
    dispatch(logoutUser());
    menuHandler();
    router.push('/');
  };

  return (
    <StyledMenu open={open}>
      {Links.map((LinkNav, index) => {
        return (
          <Link key={index} href={LinkNav.href}>
            <a>
              <MenuWrapper>
                <img src={LinkNav.icon} />

                {LinkNav.name}
              </MenuWrapper>
            </a>
          </Link>
        );
      })}

      {!user && (
        <a onClick={openModalHandler}>
          <MenuWrapper>
            <img src="/SideNav/user-icon.svg" alt="Иконка пользователя" />
            Войти
          </MenuWrapper>
        </a>
      )}

      {user && (
        <>
          <Link href="/my">
            <a>
              <MenuWrapper>
                {user.externalPhotoLink && (
                  <ImgSocial
                    src={user.externalPhotoLink}
                    alt="Иконка пользователя"
                  />
                )}
                {!user.externalPhotoLink && (
                  <img src="/SideNav/user-icon.svg" alt="Иконка пользователя" />
                )}
                Мои данные
              </MenuWrapper>
            </a>
          </Link>

          <Link href="/my/portfolio">
            <a>
              <MenuWrapper>
                <img src="/SideNav/briefcase-icon.svg" alt="Иконка портфеля" />
                Портфель
              </MenuWrapper>
            </a>
          </Link>

          <a onClick={LogoutHandler}>
            <MenuWrapper>
              <img src="/SideNav/logout-icon.svg" alt="Иконка выхода" />
              Выйти
            </MenuWrapper>
          </a>
        </>
      )}
    </StyledMenu>
  );
};

export { Menu };
