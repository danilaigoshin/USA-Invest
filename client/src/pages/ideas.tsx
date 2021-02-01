import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { StackCards } from '../containers/Screener/Card/StackCards';
import { Filter } from '../containers/Screener/Filter/Filter';
import { Header } from '../containers/Header/Header';
import Navbar from '../containers/Navbar';
import { HeaderTitle } from '../componenets/Header';
import Footer from '../containers/Footer';
import { NextPage, NextPageContext } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, Theme } from '../store/interfaces';
import { Grid } from '../componenets/Grid';
import { Button } from '../componenets/Button';
import { changeModal } from '../store/actions/modal';
import { useRouter } from 'next/router';
import { device } from '../themes/device';

const Wrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  padding: 20px 0;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }
`;

const GridColumn = styled.div`
  grid-column: 1/9;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
  margin-right: 20px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescWrapper = styled.div`
  padding: 30px 0;
  max-width: 552px;
  font-size: 32px;
  line-height: 4rem;
  white-space: pre-line;
  text-align: center;

  @media ${device.mobile}, ${device.tablet} {
    font-size: 26px;
    line-height: 3.5rem;
  }
`;

const categories = [
  {
    name: 'Все',
    logo: '',
    url: '/api/stocks/ideas/all',
  },
  {
    name: 'Растущие',
    logo: '/logo.svg',
    url: '/api/stocks/growrecommendations',
  },
  {
    name: 'Дивидендные',
    logo: '/logo.svg',
    url: '/api/stocks/dividends',
  },
  {
    name: 'Биотехи',
    logo: '/logo.svg',
    url: '/api/stocks/biotech',
  },
  {
    name: 'Венчурные',
    logo: '/logo.svg',
    url: '/api/stocks/venture',
  },
];

interface IStock {
  Id: number;
  Ticker: string;
  Name: string;
  LogoUrl: string;
  Status: string;
  Price: number;
  FinancialStrength: number;
  ProfitabilityRank: number;
  ValuationRank: number;
  FutureForecast?: {
    Date: string;
    PriceDifference: number;
  };
}

interface IFilter {
  name: string;
  value: number;
}

interface ICategory {
  name: string;
  logo: string;
  url: string;
}

const initFilters = {
  name: 'Все',
  value: 0,
};

const initOverallAssessment = {
  name: 'Все',
};

interface IProps {
  initStocksServer: IStock[];
}

const Ideas: NextPage<IProps> = ({ initStocksServer }) => {
  const user = useSelector((state: AppState) => state.auth?.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [initStocks, setInitStocks] = useState<IStock[]>(initStocksServer);
  const [currentStocks, setCurrentStocks] = useState<IStock[]>(
    initStocksServer
  );
  const [currentCategory, setCurrentCategory] = useState<ICategory>(
    categories[0]
  );
  const [filterFinancialStrength, setFilterFinancialStrength] = useState(
    initFilters
  );
  const [filterProfitabilityRank, setFilterProfitabilityRank] = useState(
    initFilters
  );
  const [filterValuationRank, setFilterValuationRank] = useState(initFilters);
  const [overallAssessment, setOverallAssessment] = useState(
    initOverallAssessment
  );

  const filterStocks = (
    financialStrength: IFilter,
    profitabilityRank: IFilter,
    valuationRank: IFilter,
    overallAssessment: { name: string }
  ) => {
    if (initStocks) {
      const filterStocks = initStocks.filter((stock) => {
        if (
          stock.FinancialStrength > financialStrength.value &&
          stock.ProfitabilityRank > profitabilityRank.value &&
          stock.ValuationRank >= valuationRank.value
        ) {
          if (stock.Status === overallAssessment.name) {
            return stock;
          }

          if (overallAssessment.name === 'Все') {
            return stock;
          }
        }
      });

      setCurrentStocks(filterStocks);
    }

    setFilterFinancialStrength(financialStrength);
    setFilterProfitabilityRank(profitabilityRank);
    setFilterValuationRank(valuationRank);
    setOverallAssessment(overallAssessment);
  };

  const setStockHandler = (stocks: IStock[]) => {
    setInitStocks(stocks);
    setCurrentStocks(stocks);

    setFilterFinancialStrength(initFilters);
    setFilterProfitabilityRank(initFilters);
    setFilterValuationRank(initFilters);
    setOverallAssessment(initOverallAssessment);
  };

  const setCategoryHandler = (category: ICategory) => {
    setCurrentCategory(category);
  };

  const buyHandler = () => {
    if (!user) {
      dispatch(changeModal({ modalOpen: true, currentModal: 'login' }));
    } else {
      router.push('/pricing');
    }
  };

  return (
    <>
      <HeaderTitle
        title="Идеи - USA Invest"
        desc="Мы анализируем и выбираем самые интересные и актуальные идеи на американском фондовом рынке."
      />

      <Navbar />

      <Wrapper>
        {user && user?.role !== 'User' && (
          <>
            <Header
              currentCategory={currentCategory}
              setCategoryHandler={setCategoryHandler}
              setStockHandler={setStockHandler}
              categories={categories}
            />

            <Filter
              financialStrength={filterFinancialStrength}
              valuationRank={filterValuationRank}
              profitabilityRank={filterProfitabilityRank}
              overallAssessment={overallAssessment}
              filterStocks={filterStocks}
              buyAssessmentList={true}
            />
            {currentStocks && <StackCards currentStocks={currentStocks} />}
          </>
        )}

        {(!user || user?.role === 'User') && (
          <Grid style={{ height: '70vh' }}>
            <GridColumn>
              <HeaderWrapper>
                <Img src="/SideNav/ideas-icon.svg" alt="Идеи иконка" />
                <h1>USA Invest Идеи</h1>
              </HeaderWrapper>

              <DescWrapper>
                <p>
                  USA Invest Идеи: получайте самые интересные и актуальные идеи
                  на американском фондовом рынке.
                </p>
              </DescWrapper>

              <Button onClick={buyHandler}>Купить</Button>
            </GridColumn>
          </Grid>
        )}
      </Wrapper>

      <Footer />
    </>
  );
};

Ideas.getInitialProps = async (ctx: NextPageContext) => {
  if (!process.browser) {
    try {
      const { data } = await axios.get(
        'http://usa-invest.ru/api/stocks/ideas/all',
        {
          headers: { Host: 'usa-invest.ru', cookie: ctx.req!.headers.cookie },
        }
      );

      return { initStocksServer: data };
    } catch {
      return { initStocksServer: [] };
    }
  } else {
    try {
      const { data } = await axios.get('/api/stocks/ideas/all');

      return { initStocksServer: data };
    } catch {
      return { initStocksServer: [] };
    }
  }
};

export default Ideas;
