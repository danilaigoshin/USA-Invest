import React, { FC } from 'react';
import styled from 'styled-components';
import { device } from '../../../themes/device';
import { DropdownFilter } from '../../../componenets/Dropdown/DropdownFilter';
import { Grid } from '../../../componenets/Grid';

const Wrapper = styled.div`
  padding-top: 20px;
  padding-bottom: 50px;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/13;
    padding-bottom: 30px;
  }
`;

const FilterText = styled.p`
  font-size: 22px;
  padding-bottom: 15px;
  padding-left: 5px;
`;

const FinancialStrengthWrapper = styled.div`
  grid-column: 1/4;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/13;
    padding-bottom: 10px;
  }
`;

const ValuationRankWrapper = styled.div`
  grid-column: 4/7;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/13;
    padding-bottom: 10px;
  }
`;

const ProfitabilityRankWrapper = styled.div`
  grid-column: 7/10;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/13;
    padding-bottom: 10px;
  }
`;

const OverallAssessmentWrapper = styled.div`
  grid-column: 10/13;

  @media ${device.mobile}, ${device.tablet} {
    grid-column: 1/13;
    padding-bottom: 10px;
  }
`;

const Desc = styled.p`
  padding-bottom: 15px;
  padding-left: 5px;
`;

const dropdownList = [
  {
    name: 'Все',
    value: 0,
  },
  {
    name: '> 3',
    value: 3,
  },
  {
    name: '> 4',
    value: 4,
  },
  {
    name: '> 5',
    value: 5,
  },
  {
    name: '> 6',
    value: 6,
  },
  {
    name: '> 7',
    value: 7,
  },
];

const overallAssessmentList = [
  {
    name: 'Все',
  },
  {
    name: 'Сильно недооценена',
  },
  {
    name: 'Недооценена',
  },
  {
    name: 'Справедливо оценена',
  },
  {
    name: 'Переоценена',
  },
  {
    name: 'Сильно переоценена',
  },
];

const shortOverallAssessmentList = [
  {
    name: 'Все',
  },
  {
    name: 'Сильно недооценена',
  },
  {
    name: 'Недооценена',
  },
  {
    name: 'Справедливо оценена',
  },
];

interface IOverallAssessment {
  name: string;
}

interface IFilter {
  name: string;
  value: number;
}

interface IProps {
  financialStrength: {
    name: string;
    value: number;
  };

  profitabilityRank: {
    name: string;
    value: number;
  };

  valuationRank: {
    name: string;
    value: number;
  };

  overallAssessment: IOverallAssessment;

  buyAssessmentList: boolean;

  filterStocks: (
    financialStrength: IFilter,
    profitabilityRank: IFilter,
    valuationRank: IFilter,
    overallAssessment: IOverallAssessment
  ) => void;
}

const Filter: FC<IProps> = ({
  financialStrength,
  profitabilityRank,
  valuationRank,
  overallAssessment,
  filterStocks,
  buyAssessmentList,
}) => {
  const financialStrengthHanlder = (financialStrength: IFilter) => {
    filterStocks(
      financialStrength,
      profitabilityRank,
      valuationRank,
      overallAssessment
    );
  };

  const valuationRankHanlder = (valuationRank: IFilter) => {
    filterStocks(
      financialStrength,
      profitabilityRank,
      valuationRank,
      overallAssessment
    );
  };

  const profitabilityRankHandler = (profitabilityRank: IFilter) => {
    filterStocks(
      financialStrength,
      profitabilityRank,
      valuationRank,
      overallAssessment
    );
  };

  const overallAssessmentHanlder = (overallAssessment: IOverallAssessment) => {
    filterStocks(
      financialStrength,
      profitabilityRank,
      valuationRank,
      overallAssessment
    );
  };

  return (
    <Wrapper>
      <FilterText>Фильтры</FilterText>
      <Grid style={{ gridTemplateColumns: 'repeat(12,1fr)' }}>
        <FinancialStrengthWrapper>
          <Desc>Надежность</Desc>
          <DropdownFilter
            dropdownList={dropdownList}
            selectedItem={financialStrength}
            dropdownHandler={financialStrengthHanlder}
            zIndex={5}
          />
        </FinancialStrengthWrapper>

        <ValuationRankWrapper>
          <Desc>Мультипликаторы</Desc>
          <DropdownFilter
            dropdownList={dropdownList}
            selectedItem={valuationRank}
            dropdownHandler={valuationRankHanlder}
            zIndex={4}
          />
        </ValuationRankWrapper>

        <ProfitabilityRankWrapper>
          <Desc>Прибыльность</Desc>
          <DropdownFilter
            dropdownList={dropdownList}
            selectedItem={profitabilityRank}
            dropdownHandler={profitabilityRankHandler}
            zIndex={3}
          />
        </ProfitabilityRankWrapper>

        <OverallAssessmentWrapper>
          <Desc>Недооцененность</Desc>
          {!buyAssessmentList && (
            <DropdownFilter
              dropdownList={overallAssessmentList}
              selectedItem={overallAssessment}
              dropdownHandler={overallAssessmentHanlder}
              zIndex={2}
            />
          )}

          {buyAssessmentList && (
            <DropdownFilter
              dropdownList={shortOverallAssessmentList}
              selectedItem={overallAssessment}
              dropdownHandler={overallAssessmentHanlder}
              zIndex={2}
            />
          )}
        </OverallAssessmentWrapper>
      </Grid>
    </Wrapper>
  );
};

export { Filter };
