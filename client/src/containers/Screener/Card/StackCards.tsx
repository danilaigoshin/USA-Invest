import React, { FC } from 'react';
import styled from 'styled-components';
import { Grid } from '../../../componenets/Grid';
import { device } from '../../../themes/device';
import { StockCard } from './StockCard';

interface IProps {
  currentStocks: {
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
  }[];
}

const GridCards = styled(Grid)`
  gap: 50px;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;

  @media ${device.tablet}, ${device.laptop} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${device.mobile} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const StackCards: FC<IProps> = ({ currentStocks }) => {
  return (
    <GridCards>
      {currentStocks &&
        currentStocks.map((stock) => {
          return (
            <StockCard
              key={stock.Id}
              name={stock.Name}
              ticker={stock.Ticker}
              price={stock.Price}
              logo={stock.LogoUrl}
              ranks={[
                { desc: 'Надежность', value: stock.FinancialStrength },
                { desc: 'Мультипликаторы', value: stock.ValuationRank },
                { desc: 'Прибыльность', value: stock.ProfitabilityRank },
              ]}
              border={stock.Status}
              FutureForecast={stock.FutureForecast}
            />
          );
        })}
    </GridCards>
  );
};

export { StackCards };
