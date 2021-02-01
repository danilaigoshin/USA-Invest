import { darken, lighten } from 'polished';
import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { device } from '../../themes/device';
import { Input } from '../Input';

const InputAmount = styled(Input)`
  font-size: 14px;
  text-align: center;
  border-radius: 10px;

  @media ${device.mobile} {
    padding: 15px 0px;
  }
`;

const TableHeader = styled.div`
  background-color: ${({ theme }: Theme) => theme.colors.secondary};
  border-radius: 10px;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
`;

const Th = styled.th`
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  text-align: center;

  @media ${device.mobile} {
    padding: 15px 7px;
    font-size: 12px;
  }
`;

const ThTicker = styled(Th)`
  @media ${device.mobile} {
    display: none;
  }
`;

const Td = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: 300;
  font-size: 13px;
  text-align: center;
  border-bottom: solid 1px
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.75', theme.colors.text)};
  word-wrap: break-word;

  @media ${device.mobile} {
    padding: 10px 5px;
    font-size: 12px;
  }
`;

const TdTicker = styled(Td)`
  @media ${device.mobile} {
    display: none;
  }
`;

const Trash = styled.img`
  width: 20px;
  padding-top: 3px;

  filter: invert(15%) sepia(47%) saturate(4771%) hue-rotate(349deg)
    brightness(102%) contrast(130%);

  @media ${device.mobile}, ${device.tablet} {
    width: 15px;
  }
`;

interface IProps {
  portfolio: {
    amount: number;
    company: string;
    isDividend: false;
    price: number;
    sector: string;
    ticker: string;
  }[];
  amountChangeHandler: (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  portfolioDeleteHanlder: (index: number) => Promise<void>;
}

const PortfolioTable: FC<IProps> = ({
  portfolio,
  amountChangeHandler,
  portfolioDeleteHanlder,
}) => {
  return (
    <>
      <TableHeader>
        <Table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <Th style={{ width: '10%' }}></Th>
              <ThTicker style={{ width: '10%' }}>Тикер</ThTicker>
              <Th style={{ width: '30%' }}>Название</Th>
              <Th style={{ width: '15%' }}>Кол-во</Th>
              <Th style={{ width: '15%' }}>Цена текущая</Th>
              <Th style={{ width: '20%' }}>Общая стоимость</Th>
            </tr>
          </thead>
        </Table>
      </TableHeader>

      <Table cellPadding="0" cellSpacing="0">
        <tbody>
          {portfolio.map((stock, index) => {
            return (
              <tr key={stock.ticker}>
                <Td style={{ width: '10%' }}>
                  <Trash
                    onClick={() => portfolioDeleteHanlder(index)}
                    src="/Icons/trash.svg"
                  />
                </Td>
                <TdTicker style={{ width: '10%' }}>{stock.ticker}</TdTicker>
                <Td style={{ width: '30%' }}>{stock.company}</Td>
                <Td style={{ width: '15%' }}>
                  <InputAmount
                    placeholder="Введите кол-во акций"
                    onChange={(e) => amountChangeHandler(index, e)}
                    value={stock.amount}
                    type="text"
                  />
                </Td>
                <Td style={{ width: '15%' }}>{stock.price}</Td>
                <Td style={{ width: '20%' }}>
                  {(stock.price * stock.amount).toFixed(0)}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export { PortfolioTable };
