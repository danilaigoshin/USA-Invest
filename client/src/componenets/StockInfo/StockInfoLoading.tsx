import React from 'react';
import { Skeleton } from '../Loading';

const StockInfoLoading = () => {
  return (
    <Skeleton height={250}>
      <rect x="0" y="40" rx="3" ry="3" width="70%" height="10" />
      <circle cx="85%" cy="40" r="30" />
      <rect x="0" y="120" rx="3" ry="3" width="90%" height="6" />
      <rect x="0" y="150" rx="3" ry="3" width="90%" height="6" />
      <rect x="0" y="180" rx="3" ry="3" width="85%" height="6" />
      <rect x="0" y="240" rx="3" ry="3" width="50%" height="6" />
    </Skeleton>
  );
};

export { StockInfoLoading };
