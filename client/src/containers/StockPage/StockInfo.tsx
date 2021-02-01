import { darken, lighten } from 'polished';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ICompany, Theme } from '../../store/interfaces';
import { ChartPrice } from '../Charts/ChartPrice';
import { StockInfoDesc } from '../../componenets/StockInfo';
import { StockInfoLoading } from '../../componenets/StockInfo/StockInfoLoading';
import { ChartLoading } from '../../componenets/Loading';
import axios from 'axios';
import { useRouter } from 'next/router';

const StockInfoGrid = styled.div`
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  box-sizing: border-box;
  display: grid;

  max-width: 1060px;
  margin: 0 auto;
  width: 100%;

  padding: 40px;
  border-radius: 20px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.7', theme.colors.text)};
`;

const HeaderInfoWrapper = styled.div`
  grid-column: 1/6;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 30px;

  @media (max-width: 960px) {
    grid-column: 1/9;
    margin-right: 0px;
    padding-bottom: 20px;
  }
`;

const HeaderChartWrapper = styled.div`
  grid-column: 6/9;
  margin: auto 0;

  @media (max-width: 960px) {
    grid-column: 1/9;
  }
`;

interface IProps {
  companyInfo: ICompany;
  ticker: string | string[] | undefined;
  loadingCompanyInfo: boolean;
}

const StockInfo: FC<IProps> = ({ companyInfo, ticker, loadingCompanyInfo }) => {
  const [price, setPrice] = useState<[[number, number]]>();
  const [loadingPrice, setLoadingPrice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoadingPrice(true);

    const fetchData = async () => {
      try {
        const { data: price } = await axios.get(
          `/api/stocks/GetPrices/${ticker}`
        );
        setPrice(price);
        setLoadingPrice(false);
      } catch (err) {
        router.push(`/${ticker}/error`);
      }
    };

    fetchData();
  }, [ticker]);

  return (
    <StockInfoGrid>
      <HeaderInfoWrapper>
        {companyInfo && loadingCompanyInfo === false && (
          <StockInfoDesc
            Name={companyInfo.aboutComp.Name}
            Price={companyInfo.aboutComp.Price}
            Description={companyInfo.aboutComp.Description}
            LogoUrl={companyInfo.aboutComp.LogoUrl}
            website={companyInfo.summary.description.website}
            DividendYield={companyInfo.summary.ForwardDividendYield}
          />
        )}

        {loadingCompanyInfo && <StockInfoLoading />}
      </HeaderInfoWrapper>

      <HeaderChartWrapper>
        {price && loadingPrice === false && <ChartPrice price={price} />}

        {loadingPrice && <ChartLoading />}
      </HeaderChartWrapper>
    </StockInfoGrid>
  );
};

export { StockInfo };
