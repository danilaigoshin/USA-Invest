import styled from 'styled-components';
import { Grid } from '../../componenets/Grid/Grid';
import { AppState, Theme } from '../../store/interfaces';
import { device } from '../../themes/device';
import Search from '../Search/Search';
import SideNav from './Sidenav';
import Link from 'next/link';
import { Modal } from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { changeModal } from '../../store/actions/modal';

// import { ToogleTheme } from '../ToogleTheme';

const Nav = styled.div`
  margin: 0 25px;
  padding-top: 15px;
`;

const Img = styled.img`
  width: 80px;
  height: 80px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const LogoLink = styled.a`
  display: inline-block;
  grid-column: 1/2;
  grid-row: 1;

  @media (max-width: 768px) {
    display: flex;
    grid-column: 9/9;
    justify-content: flex-end;
    align-self: center;
  }
`;

const ImgUserSocial = styled.img`
  width: 30px;
  border-radius: 50%;
`;

const ImgUserDefault = styled(ImgUserSocial)`
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const UserName = styled.span`
  padding-left: 15px;
`;

const UserLink = styled.a`
  display: flex;
  align-items: center;
`;

const Ul = styled.ul`
  display: flex;
  grid-column: 6/9;
  justify-content: flex-end;
  align-self: center;
  cursor: pointer;

  @media ${device.laptop} {
    grid-column: 5/9;
  }

  @media ${device.tablet}, ${device.mobile} {
    display: none;
  }
`;

const Li = styled.li`
  max-width: 150px;
  margin: auto;
`;

const Links = [
  { name: 'Идеи', icon: '/SideNav/ideas-icon.svg', href: '/ideas' },
  { name: 'Скринер', icon: '/SideNav/screener-icon.svg', href: '/screener' },
  { name: 'Циклы', icon: '/SideNav/cycle-icon.svg', href: '/cycles' },
];

const Navbar = () => {
  const modal = useSelector((state: AppState) => state.modal.modalOpen);
  const user = useSelector((state: AppState) => state.auth?.user);

  const dispatch = useDispatch();

  const changeModalHandler = () => {
    dispatch(changeModal({ modalOpen: true, currentModal: 'login' }));
  };

  return (
    <>
      <Nav>
        <Grid>
          <SideNav Links={Links} />

          <Link href="/" passHref>
            <LogoLink>
              <Img src="/logo.svg" />
            </LogoLink>
          </Link>

          <Search />

          <Ul>
            {Links.map((LinkNav, index) => {
              return (
                <Li key={index}>
                  <Link href={LinkNav.href}>
                    <a>{LinkNav.name}</a>
                  </Link>
                </Li>
              );
            })}

            {user && (
              <Li>
                <Link href="/my" passHref>
                  <UserLink>
                    {user.externalPhotoLink && (
                      <ImgUserSocial src={user.externalPhotoLink} />
                    )}
                    {!user.externalPhotoLink && (
                      <ImgUserDefault src="/SideNav/user-icon.svg" />
                    )}
                    <UserName>{user.name}</UserName>
                  </UserLink>
                </Link>
              </Li>
            )}

            {!user && <Li onClick={changeModalHandler}>Войти</Li>}

            {/* <ToogleTheme /> */}
          </Ul>
        </Grid>

        {modal && <Modal />}
      </Nav>
    </>
  );
};

export default Navbar;
