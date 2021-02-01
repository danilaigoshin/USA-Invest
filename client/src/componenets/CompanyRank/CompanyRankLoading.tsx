import React from 'react';
import { Skeleton } from '../Loading';

const CompanyRankLoading = () => {
  return (
    <Skeleton height={280}>
      <rect x="0" y="10" rx="3" ry="3" width="40%" height="6" />
      <rect x="60%" y="10" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="70" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="70" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="70" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="110" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="110" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="110" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="150" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="150" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="150" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="190" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="190" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="190" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="230" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="230" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="230" rx="3" ry="3" width="40%" height="6" />

      <rect x="0" y="270" rx="3" ry="3" width="30%" height="6" />
      <rect x="40%" y="270" rx="3" ry="3" width="10%" height="6" />
      <rect x="60%" y="270" rx="3" ry="3" width="40%" height="6" />
    </Skeleton>
  );
};

export { CompanyRankLoading };
