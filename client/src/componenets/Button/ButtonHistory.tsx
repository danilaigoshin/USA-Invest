import Link from 'next/link';
import { darken, lighten } from 'polished';
import React, { FC, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { deleteStockHistory } from '../../store/actions/stockHistory';

const Button = styled.button`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;

  align-items: center;
  justify-content: center;
  text-align: center;
  height: 32px;
  background: none;
  padding: 19px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.7', theme.colors.text)} !important;

  border-radius: 15px;
  color: ${({ theme }: Theme) =>
    theme.colors.currentTheme === 'dark'
      ? lighten('0.1', theme.colors.text)
      : darken('0.05', theme.colors.text)};

  outline: none;

  font-size: 15px;
  cursor: pointer;
  margin-right: 20px;
`;

const CloseIcon = styled.img`
  height: 17px;
  filter: invert(70%) sepia(77%) saturate(6509%) hue-rotate(322deg)
    brightness(102%) contrast(98%);
`;

interface IStock {
  name: string;
  ticker: string;
}

interface IProps {
  stock: IStock;
}

const ButtonHistory: FC<IProps> = ({ stock }) => {
  const dispatch = useDispatch();

  const deleteHandler = (e: MouseEvent<HTMLElement>, stock: IStock) => {
    e.preventDefault();
    dispatch(deleteStockHistory(stock));
  };

  return (
    <Link href={`/stock/${stock.ticker}`} passHref>
      <a>
        <Button>
          <p
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              marginLeft: 10,
            }}
          >
            {stock.ticker}{' '}
            <span style={{ margin: '3px 0 0 16px' }}>
              <CloseIcon
                onClick={(e) => deleteHandler(e, stock)}
                src="/Icons/close.svg"
              />
            </span>
          </p>
        </Button>
      </a>
    </Link>
  );
};

export { ButtonHistory };
