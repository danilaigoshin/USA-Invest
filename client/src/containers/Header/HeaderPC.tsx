import axios from 'axios';
import { darken, lighten } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;

  justify-content: space-around;

  @media (max-width: 1100px) {
    display: none;
  }
`;

const CategoryButton = styled.button`
  font-size: 13px;
  padding: 10px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.25', theme.colors.text)
        : lighten('0.2', theme.colors.text)};
  background: transparent;

  display: inline-block;
  width: 100%;

  margin: 12px;
  border-radius: 25px;
  color: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.05', theme.colors.text)
      : darken('0.05', theme.colors.text)};
  outline: none;
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

const CategoryButtonSelected = styled.button`
  font-size: 13px;
  padding: 10px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.25', theme.colors.text)
        : lighten('0.2', theme.colors.text)};
  background: ${({ theme }: Theme) => theme.colors.secondary};

  display: inline-block;
  width: 100%;

  margin: 12px;
  border-radius: 25px;
  color: ${({ theme }: Theme) => theme.colors.text};
  outline: none;
  cursor: pointer;

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

interface ICategory {
  name: string;
  logo: string;
  url: string;
}

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

interface IProps {
  categories: ICategory[];
  setStockHandler: (stocks: IStocks[]) => void;
  setCategoryHandler: (category: ICategory) => void;
  currentCategory: ICategory;
}

const HeaderPC: FC<IProps> = ({
  categories,
  setStockHandler,
  setCategoryHandler,
  currentCategory,
}) => {
  const changeCategory = async (category: ICategory) => {
    setCategoryHandler(category);

    const { data } = await axios.get(category.url);
    setStockHandler(data);
  };

  return (
    <HeaderWrapper>
      {categories.map((category, index) => {
        if (currentCategory.name === category.name) {
          return (
            <CategoryButtonSelected
              onClick={() => changeCategory(category)}
              key={index}
            >
              {category.name}
            </CategoryButtonSelected>
          );
        } else {
          return (
            <CategoryButton
              onClick={() => changeCategory(category)}
              key={index}
            >
              {category.name}
            </CategoryButton>
          );
        }
      })}
    </HeaderWrapper>
  );
};

export { HeaderPC };
