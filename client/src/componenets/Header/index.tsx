import Head from 'next/head';
import React, { FC } from 'react';

interface IProps {
  title: string;
  desc: string;
}

const HeaderTitle: FC<IProps> = ({ title, desc }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
    </Head>
  );
};

export { HeaderTitle };
