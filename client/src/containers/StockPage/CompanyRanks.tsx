import axios from 'axios';
import { useRouter } from 'next/router';
import { darken, lighten } from 'polished';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CompanyRank } from '../../componenets/CompanyRank';
import { CompanyRankLoading } from '../../componenets/CompanyRank/CompanyRankLoading';
import { Grid } from '../../componenets/Grid';
import { ICompany, Theme } from '../../store/interfaces';

const FinancialStrengthWrapper = styled.div`
  grid-column: 1/4;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ProfitabilityRankWrapper = styled.div`
  grid-column: 4/7;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const ValueRankWrapper = styled.div`
  grid-column: 7/10;

  @media (max-width: 960px) {
    grid-column: 1/10;
  }
`;

const CompanyRankWrapper = styled.div`
  padding: 20px;
  border-radius: 20px;
  border: 1px solid
    ${({ theme }: Theme) =>
      theme.colors.currentTheme === 'dark'
        ? darken('0.75', theme.colors.text)
        : lighten('0.7', theme.colors.text)};
`;

interface IVsIndustry {
  cash2debt_width: number;
  equity2asset_width: number;
  debt2equity_width: number;
  interest_coverage_width: number;
  oprt_margain_width: number;
  net_margain_width: number;
  roe_width: number;
  ROC_JOEL_width: number;
  rwn_growth_3y_width: number;
  pe_width: number;
  forwardPE_width: number;
  pb_width: number;
  ps_width: number;
  peg_width: number;
  current_ratio_width: number;
  quick_ratio_width: number;
}

interface IProps {
  companyInfo: ICompany;
  ticker: string | string[] | undefined;
  loadingCompanyInfo: boolean;
}

const CompanyRanks: FC<IProps> = ({
  companyInfo,
  ticker,
  loadingCompanyInfo,
}) => {
  const router = useRouter();
  const [vsIndustry, setVsIndustry] = useState<IVsIndustry>();
  const [loadingVsIndustry, setLoadingVsIndustry] = useState(false);

  useEffect(() => {
    setLoadingVsIndustry(true);

    const fetchData = async () => {
      try {
        const { data: vsIndustry } = await axios.get(
          `/api/stocks/getindicators?ticker=${ticker}`
        );

        setVsIndustry(vsIndustry);
        setLoadingVsIndustry(false);
      } catch (err) {
        router.push(`/${ticker}/error`);
      }
    };

    fetchData();
  }, [ticker]);

  return (
    <Grid style={{ gap: '25px', gridTemplateColumns: 'repeat(9,1fr)' }}>
      <FinancialStrengthWrapper>
        <CompanyRankWrapper>
          {companyInfo &&
            vsIndustry &&
            loadingVsIndustry === false &&
            loadingCompanyInfo === false && (
              <CompanyRank
                rankName="Надежность"
                rank={companyInfo.aboutComp.FinancialStrength}
                characteristics={[
                  {
                    name: 'Cash-To-Debt',
                    value: companyInfo.summary.cash2debt,
                    progressWidth: vsIndustry.cash2debt_width,
                  },
                  {
                    name: 'Equity-to-Asset',
                    value: companyInfo.summary.equity2asset,
                    progressWidth: vsIndustry.equity2asset_width,
                  },
                  {
                    name: 'Debt-to-Equity',
                    value: companyInfo.summary.debt2equity,
                    progressWidth: vsIndustry.debt2equity_width,
                  },
                  {
                    name: 'Interest Coverage',
                    value: companyInfo.summary.interest_coverage,
                    progressWidth: vsIndustry.interest_coverage_width,
                  },
                  {
                    name: 'Piotroski F-Score',
                    value: companyInfo.summary.fscore,
                    progressWidth: 5,
                  },
                  {
                    name: 'Altman Z-Score',
                    value: companyInfo.summary.zscore,
                    progressWidth: 5,
                  },
                  {
                    name: 'Beneish M-Score',
                    value: companyInfo.summary.mscore,
                    progressWidth: 5,
                  },
                ]}
              />
            )}

          {loadingVsIndustry && loadingCompanyInfo && <CompanyRankLoading />}
        </CompanyRankWrapper>
      </FinancialStrengthWrapper>

      <ProfitabilityRankWrapper>
        <CompanyRankWrapper>
          {companyInfo &&
            vsIndustry &&
            loadingVsIndustry === false &&
            loadingCompanyInfo === false && (
              <CompanyRank
                rankName="Прибыльность"
                rank={companyInfo.aboutComp.ProfitabilityRank}
                characteristics={[
                  {
                    name: 'Operating Margin %',
                    value: companyInfo.summary.oprt_margain,
                    progressWidth: vsIndustry.oprt_margain_width,
                  },
                  {
                    name: 'Net Margin %',
                    value: companyInfo.summary.net_margain,
                    progressWidth: vsIndustry.net_margain_width,
                  },
                  {
                    name: 'ROE %',
                    value: companyInfo.summary.roe,
                    progressWidth: vsIndustry.roe_width,
                  },
                  {
                    name: 'ROA %',
                    value: companyInfo.summary.roa,
                    progressWidth: vsIndustry.roe_width,
                  },
                  {
                    name: 'ROC (Joel Greenblatt) %',
                    value: companyInfo.summary.ROC_JOEL,
                    progressWidth: vsIndustry.ROC_JOEL_width,
                  },
                  {
                    name: '3-Year Revenue Growth Rate',
                    value: companyInfo.summary.rvn_growth_3y,
                    progressWidth: vsIndustry.rwn_growth_3y_width,
                  },
                ]}
              />
            )}

          {loadingVsIndustry && loadingCompanyInfo && <CompanyRankLoading />}
        </CompanyRankWrapper>
      </ProfitabilityRankWrapper>

      <ValueRankWrapper>
        <CompanyRankWrapper>
          {companyInfo &&
            vsIndustry &&
            loadingVsIndustry === false &&
            loadingCompanyInfo === false && (
              <CompanyRank
                rankName="Мультипликаторы"
                rank={companyInfo.aboutComp.ValuationRank}
                characteristics={[
                  {
                    name: 'P/E',
                    value: companyInfo.summary.pe,
                    progressWidth: vsIndustry.pe_width,
                  },
                  {
                    name: 'Forward P/E',
                    value: companyInfo.summary.forwardPE,
                    progressWidth: vsIndustry.forwardPE_width,
                  },
                  {
                    name: 'P/B',
                    value: companyInfo.summary.pb,
                    progressWidth: vsIndustry.pb_width,
                  },
                  {
                    name: 'P/S',
                    value: companyInfo.summary.ps,
                    progressWidth: vsIndustry.ps_width,
                  },
                  {
                    name: 'PEG',
                    value: companyInfo.summary.peg,
                    progressWidth: vsIndustry.peg_width,
                  },
                  {
                    name: 'Current Ratio',
                    value: companyInfo.summary.current_ratio,
                    progressWidth: vsIndustry.current_ratio_width,
                  },
                  {
                    name: 'Quick Ratio',
                    value: companyInfo.summary.quick_ratio,
                    progressWidth: vsIndustry.quick_ratio_width,
                  },
                ]}
              />
            )}

          {loadingVsIndustry && loadingCompanyInfo && <CompanyRankLoading />}
        </CompanyRankWrapper>
      </ValueRankWrapper>
    </Grid>
  );
};

export { CompanyRanks };
