import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';

const ProgressWrapper = styled.div`
  background-color: ${({ theme }: Theme) => theme.colors.secondary};
  width: 40%;
  border-radius: 10px;
  height: 18px;
`;

const Progress = styled.div`
  height: 18px;
  width: 75%;
  background-color: #2196f3;
  border-radius: 10px;
`;

interface IProps {
  fullWidth: string;
  progressWidth: number;
}

const ProgressBarVsIndustry: FC<IProps> = ({ fullWidth, progressWidth }) => {
  let borderColor = '';
  if (progressWidth < 20) {
    borderColor = 'rgb(255, 0, 0)';
  }

  if (progressWidth >= 20 && progressWidth < 40) {
    borderColor = 'rgb(248, 138, 69)';
  }

  if (progressWidth >= 40 && progressWidth < 60) {
    borderColor = 'rgb(255, 221, 11)';
  }

  if (progressWidth >= 60 && progressWidth < 70) {
    borderColor = 'rgb(170, 249, 2)';
  }

  if (progressWidth >= 70) {
    borderColor = 'rgb(0, 235, 0)';
  }

  return (
    <ProgressWrapper style={{ width: fullWidth }}>
      <Progress
        style={{ width: `${progressWidth}%`, backgroundColor: borderColor }}
      />
    </ProgressWrapper>
  );
};

export { ProgressBarVsIndustry };
