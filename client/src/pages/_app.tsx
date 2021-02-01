import React, { useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'styled-components';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AppContext } from 'next/app';
import { wrapper } from '../store/store';
import { GlobalStyle, themeDark } from '../themes';
import { AppState } from '../store/interfaces';
import { changeTheme } from '../store/actions/theme';
import { loadUser } from '../store/actions/auth';

import * as gtag from '../utils/gtag';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
  const theme = useSelector((state: AppState) => state.theme);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        await axios.post('/api/accounts/refresh-token');
      } catch (error) {}
    };

    fetch();

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      dispatch(changeTheme(themeDark));
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>USA Invest</title>
      </Head>
      <Component {...pageProps} />
      <GlobalStyle />
    </ThemeProvider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  if (!process.browser) {
    try {
      const { data } = await axios.get(
        'http://usa-invest.ru/api/accounts/getcurrentuser',
        {
          headers: { Host: 'usa-invest.ru', cookie: ctx.req?.headers.cookie },
        }
      );

      ctx.store.dispatch(loadUser(data));
    } catch (err) {}
  }

  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
      pathname: ctx.pathname,
    },
  };
};

export default wrapper.withRedux(MyApp);
