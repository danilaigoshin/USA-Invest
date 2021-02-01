import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../componenets/Button';

const ImageWrapper = styled.div`
  width: 100%;
  padding: 40px 0;
`;

const PortfolioEmptyText = styled.p`
  font-size: 20px;
  padding-bottom: 20px;
`;

const PortfolioNotFound = () => {
  return (
    <>
      <ImageWrapper>
        <img src="/briefcase.svg" style={{ width: 250 }} />
      </ImageWrapper>

      <PortfolioEmptyText>
        Активы не найдены - добавьте сделки в свой портфель!
      </PortfolioEmptyText>

      <Link href="/screener" passHref>
        <a>
          <Button>Добавить акции</Button>
        </a>
      </Link>
    </>
  );
};

export { PortfolioNotFound };
