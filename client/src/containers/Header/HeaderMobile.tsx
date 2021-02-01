import axios from 'axios';
import React, { FC } from 'react';
import styled from 'styled-components';

import { DropdownCategory } from '../../componenets/Dropdown/DropdownCategory';

const HeaderWrapper = styled.div`
  @media (min-width: 1100px) {
    display: none;
  }
`;

const FilterText = styled.p`
  font-size: 22px;
  padding-bottom: 15px;
  padding-left: 5px;
`;

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

const HeaderMobile: FC<IProps> = ({
  categories,
  setStockHandler,
  setCategoryHandler,
  currentCategory,
}) => {
  const categoryHandler = async (category: ICategory) => {
    setCategoryHandler(category);

    const { data } = await axios.get(category.url);
    setStockHandler(data);
  };

  return (
    <HeaderWrapper>
      <FilterText>Категория</FilterText>
      <DropdownCategory
        dropdownList={categories}
        selectedItem={currentCategory}
        dropdownHandler={categoryHandler}
      />
    </HeaderWrapper>
  );
};

export { HeaderMobile };
