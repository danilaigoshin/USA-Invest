import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { ProgressBar } from '../Progressbar/ProgressBar';
import { ProgressBarVsIndustry } from '../Progressbar/ProgressBarVsIndustry';

const FlexWrapper = styled.div`
  flex-direction: row;
  display: flex;
`;

const Rank = styled.span`
  width: 60%;
  font-size: 14px;
`;

const CharacteristicFont = styled.div`
  font-size: 13px;
`;

const CharacteristicHeader = styled.div`
  margin: 20px 0;
  padding: 5px 0;
  background-color: ${({ theme }: Theme) => theme.colors.secondary};
`;

const CharacteristicColumn = styled.div`
  width: 40%;
`;

const CharacteristicCurrent = styled.div`
  width: 25%;
  text-align: center;
  justify-content: center;
  margin: auto 0;
`;

const CharacteristicIndustryColumn = styled.div`
  width: 35%;
  text-align: center;
  justify-content: center;
  margin: auto 0;
`;

const CharacteristicName = styled.p`
  width: 40%;
`;

const CharacteristicValue = styled.p`
  width: 25%;
  text-align: center;
  margin: auto 0;
`;

const CharacteristicIndustry = styled.div`
  width: 30%;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
`;

interface IProps {
  rankName: string;
  rank: any;
  characteristics: {
    name: string;
    value: number;
    progressWidth: number;
  }[];
}

const CompanyRank: FC<IProps> = ({ rankName, rank, characteristics }) => {
  return (
    <>
      <FlexWrapper>
        <Rank>
          {rankName} {rank !== 0 ? <span>{rank}/10</span> : ''}
        </Rank>
        {rank !== 0 ? (
          <ProgressBar fullWidth={'40%'} progressWidth={rank} />
        ) : (
          ''
        )}
      </FlexWrapper>

      <CharacteristicFont>
        <CharacteristicHeader>
          <FlexWrapper>
            <CharacteristicColumn />
            <CharacteristicCurrent>Текущие</CharacteristicCurrent>
            <CharacteristicIndustryColumn>
              Против индустрии
            </CharacteristicIndustryColumn>
          </FlexWrapper>
        </CharacteristicHeader>

        {characteristics.map((characteristic, index) => {
          if (characteristic.value === 0 || characteristic.value === 9999) {
            return;
          }

          if (
            (characteristic.name === 'Cash-To-Debt' &&
              characteristic.value === 10000) ||
            (characteristic.name === 'Interest Coverage' &&
              characteristic.value === 10000)
          ) {
            return (
              <FlexWrapper style={{ paddingBottom: 15 }} key={index}>
                <CharacteristicName>{characteristic.name}</CharacteristicName>
                <CharacteristicValue>No Debt</CharacteristicValue>
                <CharacteristicIndustry>
                  <ProgressBarVsIndustry
                    fullWidth={'100%'}
                    progressWidth={characteristic.progressWidth}
                  />
                </CharacteristicIndustry>
              </FlexWrapper>
            );
          }

          if (characteristic.name === 'Piotroski F-Score') {
            return (
              <FlexWrapper style={{ paddingBottom: 15 }} key={index}>
                <CharacteristicName>{characteristic.name}</CharacteristicName>
                <CharacteristicValue>
                  {characteristic.value}
                </CharacteristicValue>
                <CharacteristicIndustry>
                  <ProgressBarVsIndustry
                    fullWidth={'100%'}
                    progressWidth={characteristic.value * 10}
                  />
                </CharacteristicIndustry>
              </FlexWrapper>
            );
          }

          if (characteristic.name === 'Altman Z-Score') {
            return (
              <FlexWrapper style={{ paddingBottom: 15 }} key={index}>
                <CharacteristicName>{characteristic.name}</CharacteristicName>
                <CharacteristicValue>
                  {characteristic.value}
                </CharacteristicValue>
                <CharacteristicIndustry>
                  {characteristic.value < 1.8 && (
                    <ProgressBarVsIndustry
                      fullWidth={'100%'}
                      progressWidth={15}
                    />
                  )}
                  {characteristic.value >= 1.8 && characteristic.value < 3 && (
                    <ProgressBarVsIndustry
                      fullWidth={'100%'}
                      progressWidth={50}
                    />
                  )}
                  {characteristic.value >= 3 && characteristic.value <= 5 && (
                    <ProgressBarVsIndustry
                      fullWidth={'100%'}
                      progressWidth={80}
                    />
                  )}
                  {characteristic.value >= 5 && (
                    <ProgressBarVsIndustry
                      fullWidth={'100%'}
                      progressWidth={100}
                    />
                  )}
                </CharacteristicIndustry>
              </FlexWrapper>
            );
          }

          if (characteristic.name === 'Beneish M-Score') {
            return (
              <FlexWrapper style={{ paddingBottom: 15 }} key={index}>
                <CharacteristicName>{characteristic.name}</CharacteristicName>
                <CharacteristicValue>
                  {characteristic.value}
                </CharacteristicValue>
              </FlexWrapper>
            );
          }

          return (
            <FlexWrapper style={{ paddingBottom: 15 }} key={index}>
              <CharacteristicName>{characteristic.name}</CharacteristicName>
              <CharacteristicValue>{characteristic.value}</CharacteristicValue>
              <CharacteristicIndustry>
                <ProgressBarVsIndustry
                  fullWidth={'100%'}
                  progressWidth={characteristic.progressWidth}
                />
              </CharacteristicIndustry>
            </FlexWrapper>
          );
        })}
      </CharacteristicFont>
    </>
  );
};

export { CompanyRank };
