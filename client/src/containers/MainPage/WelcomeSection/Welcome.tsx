import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Navbar from '../../Navbar';
import { Theme } from '../../../store/interfaces';
import { device } from '../../../themes/device';
import { Button } from '../../../componenets/Button';
import { Grid } from '../../../componenets/Grid';

const AboutColumn = styled.div`
  grid-column: 1/5;
  align-self: center;

  @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
    grid-column: 1/6;
  }
`;

const MainImage = styled.div`
  grid-column: 5/9;

  margin: auto 0;

  @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
    grid-column: 6/9;
  }
`;

const Leading = styled.p`
  margin: 20px 0;
  font-size: 1.1em;
  line-height: 1.7em;

  @media ${device.mobile} {
    font-size: 1em;
    margin: 25px 0;
    line-height: 1.4em;
  }
`;

const Background = styled.div`
  background: ${({ theme }: Theme) => theme.colors.background}
    url('/MainPage/background.svg');
  background-position: center;
  background-size: cover;
  padding: 0 0 50px 0;
`;

const ExchangeWrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const ImgExchange = styled.img`
  height: 50px;

  @media ${device.mobile}, ${device.tablet}, ${device.laptop} {
    height: 40px;
  }
`;

const Paddings = styled.div`
  padding-top: 90px;
  padding-bottom: 90px;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const Welcome = () => {
  const currentTheme = useSelector(
    ({ theme }: Theme) => theme.colors.currentTheme
  );

  return (
    <Background>
      <Navbar />

      <Paddings>
        <Grid>
          <AboutColumn>
            <h1 style={{ letterSpacing: 2 }}>USA Invest</h1>
            <Leading>
              Помогаем инвесторам подобрать лучшие компании на американском
              фондовом рынке
            </Leading>
            <Link href="/screener" passHref>
              <a>
                <Button>Подобрать акции</Button>
              </a>
            </Link>
          </AboutColumn>

          <MainImage>
            <img src="/MainPage/mainImage.svg" />
          </MainImage>
        </Grid>
      </Paddings>

      <ExchangeWrapper>
        <ImgExchange src="/MainPage/NYSE_logo.svg" />
        {currentTheme === 'dark' ? (
          <ImgExchange src="/MainPage/NASDAQ_WHITE.svg" />
        ) : (
          <ImgExchange src="/MainPage/NASDAQ_BLACK.svg" />
        )}
      </ExchangeWrapper>
    </Background>
  );
};

export { Welcome };
