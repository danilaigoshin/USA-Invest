import React, { FC } from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { Theme } from '../../store/interfaces';

interface IProps {
  children: React.ReactNode;
  height: number;
}

const Skeleton: FC<IProps> = ({ height, children }) => {
  const currentTheme = useSelector(({ theme }: Theme) => theme.colors);

  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={height}
      backgroundColor={currentTheme.text}
      foregroundColor={currentTheme.secondary}
    >
      {children}
    </ContentLoader>
  );
};

export { Skeleton };
