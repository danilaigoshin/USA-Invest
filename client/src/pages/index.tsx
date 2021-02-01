import React from 'react';
import styled from 'styled-components';
import Footer from '../containers/Footer';
import { Grid } from '../componenets/Grid';
import { HeaderTitle } from '../componenets/Header';
import { Info } from '../containers/MainPage/Info/Info';
import { Welcome } from '../containers/MainPage/WelcomeSection/Welcome';
import { device } from '../themes/device';

const IdeasWrapper = styled.div`
  grid-column: 1/5;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/9;
  }
`;

const SectorsWrapper = styled.div`
  grid-column: 5/9;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/9;
  }
`;

const Margins = styled.div`
  margin: 0 25px;
`;

const IdeasInfo = {
  header: 'Инвест идеи с большим потенциалом',
  desc:
    'Мы анализируем и выбираем самые интересные и актуальные идеи на американском фондовом рынке.',
  buttonText: 'Инвест идеи',
  image: '/MainPage/IdeasLight.png',
  link: '/ideas',
};

const SectorsInfo = {
  header: 'Экономические циклы',
  desc:
    'На нашем сайте вы можете проанализировать в какой фазе находится рынок и узнать какие сектора экономики проявляют лучше динамику.',
  buttonText: 'Экономические циклы',
  image: '/MainPage/CyclesLight.png',
  link: '/cycles',
};

const Home = () => {
  return (
    <>
      <HeaderTitle
        title="USA Invest - инвест идеи с большим потенциалом"
        desc="USA Invest - помогаем инвесторам подобрать лучшие компании на американском фондовом рынке"
      />

      <Welcome />

      <Margins>
        <Grid style={{ gap: 25, padding: '80px 0' }}>
          <IdeasWrapper>
            <Info info={IdeasInfo} />
          </IdeasWrapper>

          <SectorsWrapper>
            <Info info={SectorsInfo} />
          </SectorsWrapper>
        </Grid>
      </Margins>

      <Footer />
    </>
  );
};

export default Home;
