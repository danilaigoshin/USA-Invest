import { NextPageContext } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Footer from '../../containers/Footer';
import { Grid } from '../../componenets/Grid';
import { Links } from '../../componenets/My/Links';
import Navbar from '../../containers/Navbar';
import { Promo } from '../../containers/My/Promo';
import { AppState } from '../../store/interfaces';
import { device } from '../../themes/device';
import { redirect } from '../../utils/redirect';
import { UserInfo } from '../../containers/My/UserInfo';

const Paddings = styled.div`
  padding: 100px;
  padding-bottom: 100px;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  @media ${device.mobile}, ${device.tablet} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const LinksWrapper = styled.div`
  grid-column: 1/3;

  @media ${device.mobile}, ${device.tablet} {
    display: none;
  }
`;

const MainWrapper = styled.div`
  grid-column: 3/9;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/9;
  }
`;

const UserInfoGridWrapper = styled.div`
  grid-column: 1/4;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/5;
  }
`;

const UserPlanGridWrapper = styled.div`
  grid-column: 4/9;
  margin-left: 20px;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 5/9;
  }
`;

const UserPlanGridWrapperSocial = styled.div`
  grid-column: 1/9;
`;

const My = () => {
  const user = useSelector((state: AppState) => state.auth!.user);

  return (
    <>
      <Navbar />

      <Paddings>
        <Grid>
          <LinksWrapper>
            <Links />
          </LinksWrapper>

          <MainWrapper>
            <h1 style={{ paddingBottom: 40, fontSize: 26, fontWeight: 500 }}>
              Учётные данные
            </h1>

            {user && user.loginMethod !== 'External' && (
              <Grid>
                <UserInfoGridWrapper>
                  <UserInfo />
                </UserInfoGridWrapper>

                <UserPlanGridWrapper>
                  <Promo />
                </UserPlanGridWrapper>
              </Grid>
            )}

            {user && user.loginMethod === 'External' && (
              <Grid>
                <UserPlanGridWrapperSocial>
                  <Promo />
                </UserPlanGridWrapperSocial>
              </Grid>
            )}
          </MainWrapper>
        </Grid>
      </Paddings>

      <Footer />
    </>
  );
};

My.getInitialProps = ({ res, req }: NextPageContext) => {
  if (!process.browser) {
    if (!req?.headers.cookie) {
      redirect(res);
    }
  }
};

export default My;
