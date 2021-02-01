import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { ButtonHistory, ButtonToastify } from '../../componenets/Button/';
import { DropdownHistory } from '../../componenets/Dropdown/DropdownStockHistory';
import { addStockHistory } from '../../store/actions/stockHistory';
import { AppState, ICompany, StockHistory } from '../../store/interfaces';
import { device } from '../../themes/device';

const HeaderWrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  padding: 35px 0 20px 0;
  display: flex;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  @media ${device.tablet} {
    a:nth-child(3) {
      display: none;
    }

    a:nth-child(4) {
      display: none;
    }
  }

  @media ${device.mobile} {
    a {
      display: none;
    }
  }
`;

const PortfolioRight = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const SectorHandler = (value: string) => {
  if (value === 'Healthcare') {
    return 'Здравоохранение';
  }

  if (value === 'Technology') {
    return 'Технологические';
  }

  if (value === 'Financial Services') {
    return 'Финансы';
  }

  if (value === 'Consumer Defensive') {
    return 'Защитные';
  }

  if (value === 'Consumer Cyclical') {
    return 'Циклические';
  }

  if (value === 'Real Estate') {
    return 'Недвижимость';
  }

  if (value === 'Basic Materials') {
    return 'Основные материалы';
  }

  if (value === 'Energy') {
    return 'Энергия';
  }

  if (value === 'Communication Services') {
    return 'Сервисы';
  }

  if (value === 'Промышленность') {
    return 'Промышленность';
  }
};

interface IProps {
  companyInfo: ICompany;
}

const Header: FC<IProps> = ({ companyInfo }) => {
  const [toastifyColor, setToastifyColor] = useState('rgb(0, 235, 0)');
  const dispatch = useDispatch();
  const router = useRouter();

  const stocksHistory = useSelector(
    (state: AppState) => state.stockHistory.stocks
  );

  const notify = (message: string) => {
    toast(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  };

  const addToPortfolioHandler = async () => {
    const IsDividend =
      companyInfo.summary.ForwardDividendYield > 0 ? true : false;
    const SectorRussian = SectorHandler(companyInfo.aboutComp.Sector);

    const data = {
      Company: companyInfo.aboutComp.Name,
      Ticker: companyInfo.aboutComp.Ticker,
      IsDividend,
      Sector: SectorRussian,
    };

    try {
      const res = await axios.post('/api/my/addToPortfolio', data);
      setToastifyColor('rgb(0, 235, 0)');
      notify(res.data.message);
    } catch (err) {
      setToastifyColor('rgb(255, 221, 11)');
      notify(err.response.data.message);
    }
  };

  const dropdownHandler = (stock: StockHistory) => {
    dispatch(addStockHistory(stock, stocksHistory));
    router.push(`/stock/${stock.ticker}`);
  };

  return (
    <HeaderWrapper>
      {stocksHistory.map((stock) => {
        return <ButtonHistory key={stock.ticker} stock={stock} />;
      })}

      {stocksHistory && stocksHistory.length > 0 && (
        <DropdownHistory
          selectedItem={stocksHistory[0]}
          dropdownList={stocksHistory}
          dropdownHandler={dropdownHandler}
        />
      )}

      <PortfolioRight>
        {companyInfo && (
          <ButtonToastify
            toastifyColor={toastifyColor}
            eventHandler={addToPortfolioHandler}
          />
        )}
      </PortfolioRight>
    </HeaderWrapper>
  );
};

export { Header };
