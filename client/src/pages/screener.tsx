import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StackCards } from '../containers/Screener/Card/StackCards';
import { Filter } from '../containers/Screener/Filter/Filter';
import { Header } from '../containers/Header/Header';
import Navbar from '../containers/Navbar';
import { HeaderTitle } from '../componenets/Header';
import Footer from '../containers/Footer';

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

const categories = [
  {
    name: 'Все',
    logo: '',
    url: '/api/stocks/sectors/all',
  },
  {
    name: 'Здравоохранение',
    logo: '/logo.svg',
    url: '/api/stocks/healthcare',
  },
  {
    name: 'Сервисы',
    logo: '/logo.svg',
    url: '/api/stocks/communicationservices',
  },
  {
    name: 'Технологические',
    logo: '/logo.svg',
    url: '/api/stocks/technology',
  },
  {
    name: 'Финансовые',
    logo: '/logo.svg',
    url: '/api/stocks/financial',
  },
  {
    name: 'Промышленные',
    logo: '/logo.svg',
    url: '/api/stocks/industrials',
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

const Screener = () => {
  const [initStocks, setInitStocks] = useState<IStock[]>();
  const [currentStocks, setCurrentStocks] = useState<IStock[]>();
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(categories[0].url);
      setCurrentStocks(res.data);
      setInitStocks(res.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <HeaderTitle
        title="Скринер акций - USA Invest"
        desc="Поиск акций в США. Подбор компаний по мультипликаторам, надежности и прибыльности."
      />

      <Navbar />

      <Wrapper>
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
          buyAssessmentList={false}
        />

        {currentStocks && <StackCards currentStocks={currentStocks} />}
      </Wrapper>

      <Footer />
    </>
  );
};

export default Screener;
