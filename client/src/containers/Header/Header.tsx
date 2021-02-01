import React, { FC } from 'react';
import { HeaderMobile } from './HeaderMobile';
import { HeaderPC } from './HeaderPC';

interface IStocks {
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

interface ICategory {
  name: string;
  logo: string;
  url: string;
}

interface IProps {
  categories: ICategory[];
  setStockHandler: (stocks: IStocks[]) => void;
  setCategoryHandler: (category: ICategory) => void;
  currentCategory: ICategory;
}

const Header: FC<IProps> = ({
  categories,
  setStockHandler,
  setCategoryHandler,
  currentCategory,
}) => {
  return (
    <>
      <HeaderPC
        setCategoryHandler={setCategoryHandler}
        currentCategory={currentCategory}
        setStockHandler={setStockHandler}
        categories={categories}
      />
      <HeaderMobile
        currentCategory={currentCategory}
        setCategoryHandler={setCategoryHandler}
        setStockHandler={setStockHandler}
        categories={categories}
      />
    </>
  );
};

export { Header };
