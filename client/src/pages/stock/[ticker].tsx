import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Grid } from '../../componenets/Grid';
import { ChartMedPS } from '../../containers/Charts/ChartMedPS';
import { useRouter } from 'next/router';
import { ChartAnalytics } from '../../containers/Charts/ChartAnalytics';
import { DropdownPeriod } from '../../componenets/Dropdown/DropdownPeriod';
import { ChartLoading } from '../../componenets/Loading';
import { ChartProfit } from '../../containers/Charts/ChartFinancials/ChartProfit';
import { ChartCashToDebt } from '../../containers/Charts/ChartFinancials/ChartCashToDebt';
import { HeaderTitle } from '../../componenets/Header';
import { Header } from '../../containers/StockPage/Header';
import { StockInfo } from '../../containers/StockPage/StockInfo';
import Navbar from '../../containers/Navbar';
import Footer from '../../containers/Footer';
import { CompanyRanks } from '../../containers/StockPage/CompanyRanks';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/interfaces';
import { addStockHistory } from '../../store/actions/stockHistory';
import { ICompany } from '../../store/interfaces';

const MarginWrapper = styled.div`
  margin: 35px 0;
`;

const Wrapper = styled.div`
  margin: 0 25px;
`;

const ChartAnalyticsWrapper = styled.div`
  grid-column: 1/5;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ChartMedPSWrapper = styled.div`
  grid-column: 5/10;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ChartProfitWrapper = styled.div`
  grid-column: 1/5;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ChartCashToDebtWrapper = styled.div`
  grid-column: 5/9;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const PeriodWrapper = styled.div`
  display: flex;
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  padding: 10px 5px;
`;

interface IPriceForecast {
  price: [[string, number]];
  medps: [[string, number]];
}

interface IFinancials {
  quarterlyData: {
    Quarterly: [number];
    CashData: [number];
    DebtData: [number];
    IncomeData: [number];
    RevenueData: [number];
  };

  yearData: {
    startYear: number;
    CashData: [number];
    DebtData: [number];
    IncomeData: [number];
    RevenueData: [number];
  };
}

interface IAnalytics {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

interface IPeriod {
  name: string;
}

const periodList = [
  {
    name: 'Годовой',
  },
  {
    name: 'Квартальный',
  },
];

const Stock = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const dispatch = useDispatch();

  const stockHistory = useSelector(
    (state: AppState) => state.stockHistory.stocks
  );

  const [currentPeriod, setCurrentPeriod] = useState<IPeriod>({
    name: 'Годовой',
  });

  const [companyInfo, setCompanyInfo] = useState<ICompany>();
  const [loadingCompanyInfo, setLoadingCompanyInfo] = useState(false);

  const [priceForecast, setPriceForecast] = useState<IPriceForecast>();
  const [loadingPriceForecast, setLoadingPriceForecast] = useState(false);

  const [analytics, setAnalytics] = useState<IAnalytics[]>();
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [financials, setFinancials] = useState<IFinancials>();
  const [loadingFinancials, setLoadingFinancials] = useState(false);

  const periodHandler = (currentPeriod: IPeriod) => {
    setCurrentPeriod(currentPeriod);
  };

  useEffect(() => {
    setLoadingCompanyInfo(true);
    setLoadingPriceForecast(true);
    setLoadingAnalytics(true);
    setLoadingFinancials(true);

    const fetchData = async () => {
      try {
        const resSummary = await axios.get(
          `/api/stocks/compsummary?ticker=${ticker}`
        );

        setCompanyInfo(resSummary.data);
        setLoadingCompanyInfo(false);

        const stock = {
          name: resSummary.data.aboutComp.Name,
          ticker: resSummary.data.aboutComp.Ticker,
        };

        dispatch(addStockHistory(stock, stockHistory));

        try {
          const { data: prices } = await axios.get(
            `/api/stocks/getchart?stockId=${resSummary.data.aboutComp.StockId}`
          );
          setPriceForecast(prices);
          setLoadingPriceForecast(false);
        } catch (err) {
          console.log(err);
          setLoadingPriceForecast(false);
        }
      } catch (err) {
        router.push(`/${ticker}/error`);
      }

      try {
        const { data } = await axios.get(
          `/api/stocks/analysts-recommendations/${ticker}`
        );

        if (data.length === 0) {
          router.push(`/${ticker}/error`);
        }
        setAnalytics(data);
        setLoadingAnalytics(false);
      } catch (err) {
        router.push(`/${ticker}/error`);
      }

      try {
        const { data } = await axios.get(`/api/stocks/getfinancials/${ticker}`);
        setFinancials(data);
        setLoadingFinancials(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [ticker]);

  return (
    <>
      {companyInfo && (
        <HeaderTitle
          title={companyInfo?.aboutComp.Name}
          desc={companyInfo.aboutComp.Description}
        />
      )}

      <Navbar />

      <Header companyInfo={companyInfo!} />

      <Wrapper>
        <MarginWrapper>
          <StockInfo
            companyInfo={companyInfo!}
            ticker={ticker}
            loadingCompanyInfo={loadingCompanyInfo}
          />
        </MarginWrapper>

        <MarginWrapper>
          <CompanyRanks
            companyInfo={companyInfo!}
            ticker={ticker}
            loadingCompanyInfo={loadingCompanyInfo}
          />
        </MarginWrapper>

        <MarginWrapper>
          <PeriodWrapper>
            <span style={{ fontSize: 20, margin: 'auto 0' }}>Финансы</span>
            <DropdownPeriod
              dropdownList={periodList}
              selectedItem={currentPeriod}
              dropdownHandler={periodHandler}
            />
          </PeriodWrapper>
        </MarginWrapper>

        <MarginWrapper style={{ marginBottom: 80 }}>
          <Grid style={{ gap: '25px', gridTemplateColumns: 'repeat(8,1fr)' }}>
            <ChartProfitWrapper>
              {financials && loadingFinancials === false && (
                <ChartProfit
                  financials={financials}
                  currentPeriod={currentPeriod}
                />
              )}

              {loadingFinancials && <ChartLoading />}
            </ChartProfitWrapper>
            <ChartCashToDebtWrapper>
              {financials && loadingFinancials === false && (
                <ChartCashToDebt
                  financials={financials}
                  currentPeriod={currentPeriod}
                />
              )}

              {loadingFinancials && <ChartLoading />}
            </ChartCashToDebtWrapper>
          </Grid>

          <MarginWrapper>
            <Grid style={{ gap: '25px', gridTemplateColumns: 'repeat(9,1fr)' }}>
              <ChartAnalyticsWrapper>
                {analytics &&
                  analytics.length > 0 &&
                  loadingAnalytics === false && (
                    <ChartAnalytics data={analytics} />
                  )}

                {loadingAnalytics && <ChartLoading />}
              </ChartAnalyticsWrapper>
              <ChartMedPSWrapper>
                {priceForecast?.medps && loadingPriceForecast === false && (
                  <ChartMedPS
                    price={priceForecast.price}
                    medps={priceForecast.medps}
                  />
                )}

                {loadingPriceForecast && <ChartLoading />}
              </ChartMedPSWrapper>
            </Grid>
          </MarginWrapper>
        </MarginWrapper>
      </Wrapper>

      <Footer />
    </>
  );
};

export default Stock;
