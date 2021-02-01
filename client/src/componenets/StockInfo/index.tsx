import React, { FC } from 'react';
import styled from 'styled-components';

const Image = styled.img`
  width: 45px;
  height: 45px;
  margin-left: 30px;
  border-radius: 50%;
`;

const HeaderInfoTop = styled.div`
  align-items: center;
  display: flex;
  font-weight: 500;
  font-size: 24px;
`;

const HeaderInfoFont = styled.div`
  font-size: 16px;
  padding: 15px 0;
`;

const Link = styled.a`
  color: #1464cc;
`;

const DescriptionText = styled.p`
  padding: 5px 0;
  line-height: 24px;

  @media (max-width: 960px) {
    padding: 0;
    grid-column: 1/9;
    margin-right: 0px;
    font-size: 15px;
    line-height: 22px;
  }
`;

const DividendYieldWrapper = styled.div`
  margin-bottom: 25px;
`;

interface IProps {
  Name: string;
  Price: number;
  Description: string;
  LogoUrl: string;
  website: string;
  DividendYield: number;
}

const StockInfoDesc: FC<IProps> = ({
  Name,
  Price,
  Description,
  LogoUrl,
  website,
  DividendYield,
}) => {
  return (
    <>
      <HeaderInfoTop>
        <p style={{ maxWidth: '70%' }}>
          {Name} <span> $ {Price}</span>
        </p>
        <Image src={LogoUrl} />
      </HeaderInfoTop>

      <HeaderInfoFont>
        <DescriptionText>{Description}</DescriptionText>
      </HeaderInfoFont>

      <HeaderInfoFont>
        {DividendYield !== 0 && (
          <DividendYieldWrapper>
            Див. доходность {DividendYield}%
          </DividendYieldWrapper>
        )}
        <Link rel="noreferrer" target="_blank" href={website}>
          Официальный сайт компании
        </Link>
      </HeaderInfoFont>
    </>
  );
};

export { StockInfoDesc };
