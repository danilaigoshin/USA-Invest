import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../store/interfaces';
import { rankColor, statusColor } from '../../../utils/borderColor';
import Link from 'next/link';
import { device } from '../../../themes/device';
import { Button } from '../../../componenets/Button';

interface ICardProps {
  height: string;
}

const Card = styled.div.attrs<ICardProps>(({ height }) => ({
  height: height,
}))<ICardProps>`
  background-color: ${({ theme }: Theme) => theme.colors.background};
  height: ${({ height }) => height};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12% 14%;

  @media ${device.tablet}, ${device.laptop} {
    padding: 10%;
  }
`;

const CardName = styled.p`
  margin-top: 35px;
  font-size: 1.2em;
  text-align: center;
`;

const CardImg = styled.img`
  height: 70px;
  width: 70px;
  border-radius: 50%;
`;

const CardRankDesc = styled.div`
  font-size: 1em;
  margin: auto 0;
`;

const CardRankValue = styled.div`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-left: auto;

  text-align: center;
  justify-content: center;
  padding-top: 4px;
  padding-right: 1px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 20px;
  font-size: 1.05em;
  padding: 15px 0;
  width: 100%;
`;

const CardRankMargins = styled.div`
  margin: auto 0;
  width: 100%;
`;

const Img = styled.img`
  filter: ${({ theme }: Theme) => theme.colors.logo};
`;

const ImgArrowRight = styled(Img)`
  padding-left: 15px;
  padding-top: 2px;
`;

const ImgArrowGrow = styled(Img)`
  width: 20px;
`;

const FutureForecastWrapper = styled.div`
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.05em;
`;

interface IProps {
  logo: string;
  ticker: string;
  ranks: {
    desc: string;
    value: number;
  }[];
  border: string;
  name: string;
  price: number;
  FutureForecast?: {
    Date: string;
    PriceDifference: number;
  };
}

const StockCard: FC<IProps> = ({
  name,
  ticker,
  logo,
  ranks,
  border,
  FutureForecast,
}) => {
  const borderColor = statusColor(border);
  const cardHeight = !!FutureForecast ? '37em' : '32em';

  return (
    <Card
      style={{
        border: `1px solid ${borderColor}`,
      }}
      height={cardHeight}
    >
      <CardImg src={logo} />

      <CardName>{name}</CardName>

      <CardRankMargins>
        {ranks.map((rank, index) => {
          const borderColor = rankColor(rank.value);
          if (rank.value !== 0) {
            return (
              <GridContainer key={index}>
                <CardRankDesc>{rank.desc}</CardRankDesc>
                <CardRankValue style={{ border: `1px solid ${borderColor}` }}>
                  {rank.value}
                </CardRankValue>
              </GridContainer>
            );
          }
        })}
      </CardRankMargins>

      {FutureForecast && (
        <FutureForecastWrapper>
          Ожидаемый{' '}
          <ImgArrowGrow src="/Icons/arrow-growth.svg" alt="Картинка рост" /> на{' '}
          <span>{FutureForecast.PriceDifference}%</span> к {FutureForecast.Date}
        </FutureForecastWrapper>
      )}

      <Link href={`/stock/${ticker}`}>
        <a>
          <Button
            style={{
              border: `1px solid ${borderColor}`,
            }}
          >
            Подробнее
            <ImgArrowRight
              src="/Icons/arrow-right.svg"
              alt="Иконка подробнее"
            />
          </Button>
        </a>
      </Link>
    </Card>
  );
};

export { StockCard };
