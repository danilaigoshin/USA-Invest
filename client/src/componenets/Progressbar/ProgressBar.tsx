import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';
import { rankColor } from '../../utils/borderColor';

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

const ProgressBar: FC<IProps> = ({ fullWidth, progressWidth }) => {
  const borderColor = rankColor(progressWidth);

  return (
    <ProgressWrapper style={{ width: fullWidth }}>
      <Progress
        style={{ width: `${progressWidth}0%`, backgroundColor: borderColor }}
      />
    </ProgressWrapper>
  );
};

export { ProgressBar };
