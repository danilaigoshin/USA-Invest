import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../componenets/Input';
import { device } from '../../themes/device';
import axios from 'axios';
import { Theme } from '../../store/interfaces';
import { useRouter } from 'next/router';
import { Skeleton } from '../../componenets/Loading';

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  grid-column: 2/6;
  justify-content: flex-end;
  align-self: center;
  width: 100%;

  @media ${device.laptop} {
    grid-column: 2/5;
  }

  @media ${device.tablet} {
    grid-column: 3/8;
  }

  @media ${device.mobile} {
    grid-column: 3/8;
    margin-left: 10px;
  }
`;

const ResultsWrapper = styled.div`
  position: absolute;
  width: 100%;
  background: ${({ theme }: Theme) => theme.colors.secondary};
  top: 65px;
  margin-top: 10px;
  border-radius: 25px;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  padding-right: 10px;
  z-index: 10;
`;

const Result = styled.div`
  padding: 15px;
  margin: 5px 0px;
  list-style: none;
  transition: all 0.25s ease;
  position: relative;
  cursor: pointer;
  width: calc(100% - 10px);
  margin-left: 10px;
  border-radius: 20px;

  &:hover {
    background: ${({ theme }: Theme) => theme.colors.background};
  }
`;

const ConResults = styled.div`
  width: 100%;
  overflow: auto;
  max-height: 300px;
  margin-top: 10px;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: ${({ theme }: Theme) => theme.colors.background};
  }

  &:empty {
    margin-top: 0px;
    margin-bottom: 0px;
  }
`;

const Icon = styled.img`
  position: absolute;
  right: 20px;
  filter: ${({ theme }: Theme) => theme.colors.logo};
  height: 18px;

  @media ${device.mobile} {
    display: none;
  }
`;

interface IStock {
  id: number;
  ticker: string;
  name: string;
}

const Search = () => {
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [stocks, setStocks] = useState<IStock[]>([]);
  const router = useRouter();

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/stocks/search?company=${e.target.value}`
      );

      setStocks(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const resultHanlder = (stock: IStock) => {
    setStocks([]);
    setSearchText('');

    router.push(`/stock/${stock.ticker}`);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      if (stocks.length) {
        setStocks([]);
        setSearchText('');
        router.push(`/stock/${stocks[0].ticker}`);
      }
    }
  };

  const handleBlur = () => {
    setStocks([]);
  };

  const deleteSearchText = () => {
    setSearchText('');
    setStocks([]);
  };

  return (
    <SearchWrapper>
      <div className="con-input">
        <Input
          onBlur={handleBlur}
          placeholder="Введите компанию или тикер"
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          value={searchText}
          type="text"
          style={{ fontSize: 14 }}
        />
        {searchText && (
          <Icon
            onClick={deleteSearchText}
            src="/Icons/close.svg"
            alt="Удалить иконка"
            style={{ cursor: 'pointer' }}
          />
        )}
        {!searchText && <Icon src="/Icons/search.svg" alt="Иконка поиска" />}
      </div>
      <ResultsWrapper>
        <ConResults>
          {loading && (
            <Result>
              <Skeleton height={100}>
                <rect x="0" y="10" rx="3" ry="2" width="40%" height="4" />
                <rect x="0" y="50" rx="3" ry="2" width="50%" height="4" />
                <rect x="0" y="90" rx="3" ry="2" width="45%" height="4" />
              </Skeleton>
            </Result>
          )}

          {stocks &&
            loading === false &&
            stocks.map((stock: IStock) => {
              return (
                <Result onMouseDown={() => resultHanlder(stock)} key={stock.id}>
                  <p>{stock.name}</p>
                </Result>
              );
            })}
        </ConResults>
      </ResultsWrapper>

      <style jsx>{`
        .con-search {
          position: relative;
          align-items: center;
          justify-content: center;
        }
        .con-input {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .con-input input {
          width: 100%;
          padding: 15px 20px;
          box-sizing: border-box;
          border: 0px;
          border-radius: 20px;
        }
        .con-input input:focus {
          box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.05);
          outline: none;
        }

        .not-results {
          text-align: center;
          padding: 15px;
          font-size: 0.9rem;
          opacity: 0.7;
        }
        .web {
          position: absolute;
          right: 0px;
          top: 0px;
          font-size: 0.8rem;
          color: rgba(44, 62, 80, 0.5);
          padding: 20px;
        }
      `}</style>
    </SearchWrapper>
  );
};

export default Search;
