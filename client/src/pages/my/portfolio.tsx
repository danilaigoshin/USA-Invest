import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Grid } from '../../componenets/Grid';
import Navbar from '../../containers/Navbar';
import { device } from '../../themes/device';
import { Links } from '../../componenets/My/Links';
import { NextPage, NextPageContext } from 'next';
import { redirect } from '../../utils/redirect';
import axios from 'axios';
import { PortfolioNotFound } from '../../containers/My/Portfolio/PortfolioNotFound';
import { PortfolioTable } from '../../componenets/Tables/PortfolioTable';
import { ButtonCommon } from '../../componenets/Button/ButtonCommon';
import {
  Slide,
  toast,
  ToastContainer,
  ToastContainerProps,
} from 'react-toastify';
import { Theme } from '../../store/interfaces';
import { ChartCompanies } from '../../containers/Charts/My/ChartCompanies';
import { ChartSectors } from '../../containers/Charts/My/ChartSectors';
import Footer from '../../containers/Footer';

interface MyToastContainerProps extends ToastContainerProps {
  bgColor: string;
}

const WrappedToastContainer = ({
  className,
  ...rest
}: MyToastContainerProps & { className?: string }) => (
  <div className={className}>
    <ToastContainer {...rest} />
  </div>
);

const StyledContainer = styled(WrappedToastContainer).attrs((props) => ({
  bgColor: props.bgColor,
}))`
  .Toastify__progress-bar {
    background: ${(props) => props.bgColor};
  }

  .Toastify__toast {
    background: ${({ theme }: Theme) => theme.colors.secondary};
    color: ${({ theme }: Theme) => theme.colors.text};
    border-radius: 10px;
    margin-right: 10px;
  }

  .Toastify__close-button {
    color: ${({ theme }: Theme) => theme.colors.text};
  }
`;

interface IButton {
  color: string;
}

const Button = styled(ButtonCommon)<IButton>`
  padding: 19px;
  border: 1px solid ${({ color }) => color};

  border-radius: 15px;
  color: ${({ color }) => color};

  outline: none;
  font-size: 15px;
  cursor: pointer;

  @media ${device.mobile} {
    padding: 15px;
    font-size: 12px;
  }
`;

const TrashIcon = styled.img`
  height: 17px;
  filter: invert(15%) sepia(47%) saturate(4771%) hue-rotate(349deg)
    brightness(102%) contrast(130%);

  @media ${device.mobile} {
    height: 15px;
  }
`;

const SaveIcon = styled.img`
  height: 17px;
  filter: invert(45%) sepia(60%) saturate(486%) hue-rotate(71deg)
    brightness(98%) contrast(89%);

  @media ${device.mobile} {
    height: 15px;
  }
`;

const ButtonText = styled.p`
  justify-content: center;
  align-items: center;
  display: flex;
  margin-left: 10px;
`;

const Paddings = styled.div`
  padding: 100px;
  padding-bottom: 100px;

  @media (max-width: 1100px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  @media ${device.mobile}, ${device.tablet} {
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const LinksWrapper = styled.div`
  grid-column: 1/3;

  @media ${device.mobile}, ${device.tablet} {
    display: none;
  }
`;

const PortfolioNotFoundWrapper = styled.div`
  grid-column: 3/8;
  text-align: center;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/9;
  }
`;

const MainWrapper = styled.div`
  grid-column: 3/9;
  text-align: center;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/9;
  }
`;

const MainWrapperHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MainWrapperHeaderText = styled.h1`
  text-align: left;
  font-size: 26px;
  font-weight: 500;
  margin: auto 0;
`;

const MainWrapperButtons = styled.div`
  padding-right: 5px;
`;

const MarginWrapper = styled.div`
  margin: 30px 0;
`;

const ChartCompaniesWrapper = styled.div`
  grid-column: 1/6;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ChartSectorsWrapper = styled.div`
  grid-column: 6/9;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const TotalCompanies = styled.p`
  padding-top: 40px;
  text-align: left;
  font-size: 20px;
  font-weight: 500;
`;

interface IPortfolio {
  amount: number;
  company: string;
  isDividend: false;
  price: number;
  sector: string;
  ticker: string;
}

interface IProps {
  portfolioServer: IPortfolio[];
}

const Portfolio: NextPage<IProps> = ({ portfolioServer }) => {
  const [portfolioCharts, setPortfolioCharts] = useState<IPortfolio[]>(
    portfolioServer
  );
  const [portfolio, setPortfolio] = useState<IPortfolio[]>(portfolioServer);

  const amountChangeHandler = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault;

    const newPortfolio = [...portfolio];
    newPortfolio[index].amount = Number(
      e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{10})+(?!\d))/g, ',')
    );
    setPortfolio(newPortfolio);
  };

  const companyDeleteHanlder = async (index: number) => {
    try {
      await axios.post(
        `/api/my/deleteFromPortfolio/${portfolio[index].ticker}`
      );

      const newPortfolio = portfolio.filter(
        (stock) => stock.ticker !== portfolio[index].ticker
      );

      setPortfolio(newPortfolio);
    } catch (err) {
      console.log(err);
    }
  };

  const savePortfolioHandler = async () => {
    const data = portfolio.map((stock) => {
      return {
        Ticker: stock.ticker,
        Amount: stock.amount,
      };
    });

    try {
      const res = await axios.post('/api/my/editPortfolio', data);
      setPortfolioCharts(res.data);
      notify('Данные успешно сохранены');
    } catch (err) {
      console.log(err);
    }
  };

  const deletePortfolioHandler = async () => {
    try {
      await axios.post('/api/my/clearPortfolio');
      setPortfolio([]);
    } catch (err) {
      console.log(err);
    }
  };

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

  return (
    <>
      <Navbar />
      <Paddings>
        <Grid>
          <LinksWrapper>
            <Links />
          </LinksWrapper>

          {portfolio.length === 0 && (
            <PortfolioNotFoundWrapper>
              <MainWrapperHeaderText>Портфель</MainWrapperHeaderText>

              <PortfolioNotFound />
            </PortfolioNotFoundWrapper>
          )}

          {portfolio.length > 0 && (
            <MainWrapper>
              <MainWrapperHeader>
                <MainWrapperHeaderText>Портфель</MainWrapperHeaderText>

                <MainWrapperButtons>
                  <Button onClick={savePortfolioHandler} color="#3d993d">
                    <ButtonText>
                      Сохранить{' '}
                      <span style={{ margin: '3px 0 0 16px' }}>
                        <SaveIcon src="/Icons/save.svg" />
                      </span>
                    </ButtonText>
                  </Button>

                  <Button
                    onClick={deletePortfolioHandler}
                    color="#b60000"
                    style={{ marginLeft: 15 }}
                  >
                    <ButtonText>
                      Удалить{' '}
                      <span style={{ margin: '3px 0 0 16px' }}>
                        <TrashIcon src="/Icons/trash.svg" />
                      </span>
                    </ButtonText>
                  </Button>
                </MainWrapperButtons>
              </MainWrapperHeader>

              <MarginWrapper>
                <Grid
                  style={{ gap: '25px', gridTemplateColumns: 'repeat(8,1fr)' }}
                >
                  <ChartCompaniesWrapper>
                    <ChartCompanies portfolio={portfolioCharts} />
                  </ChartCompaniesWrapper>

                  <ChartSectorsWrapper>
                    <ChartSectors portfolio={portfolioCharts} />
                  </ChartSectorsWrapper>
                </Grid>
              </MarginWrapper>

              <PortfolioTable
                portfolioDeleteHanlder={companyDeleteHanlder}
                amountChangeHandler={amountChangeHandler}
                portfolio={portfolio}
              />

              <TotalCompanies>
                Всего компаний: {portfolio.length}
              </TotalCompanies>

              <StyledContainer
                limit={1}
                bgColor={'#3d993d'}
                transition={Slide}
              />
            </MainWrapper>
          )}
        </Grid>
      </Paddings>

      <Footer />
    </>
  );
};

Portfolio.getInitialProps = async ({ res, req }: NextPageContext) => {
  if (!process.browser) {
    if (!req?.headers.cookie) {
      redirect(res);
    }
  }

  if (!process.browser) {
    const { data } = await axios.get(
      'http://usa-invest.ru/api/my/InvestmentPortfolio',
      {
        headers: { Host: 'usa-invest.ru', cookie: req!.headers.cookie },
      }
    );

    return { portfolioServer: data };
  } else {
    const { data } = await axios.get('/api/my/InvestmentPortfolio');

    return { portfolioServer: data };
  }
};

export default Portfolio;
