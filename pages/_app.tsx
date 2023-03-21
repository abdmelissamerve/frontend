import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { Box } from '@mui/system';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import { AuthConsumer, AuthProvider } from 'src/contexts/FirebaseAuthContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store';
import * as gtag from '../lib/gtag';
import * as ym from '../lib/ym';
import {
  isProd
} from '../config';
import Footer from '@/components/Footer';
import MobileHeader from '@/components/Header/Mobile';
import DesktopHeader from '@/components/Header/Desktop';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  useScrollTop();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isProd) {
        gtag.pageview(url);
        ym.pageview(url);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Admintools.io</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ReduxProvider store={store}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <SnackbarProvider
              maxSnack={6}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <CssBaseline />
                <AuthConsumer>
                  {(auth) => (
                    // !auth.isInitialized ? (
                    //   <Loader />
                    // ) :
                    <>
                      <Box
                        sx={{
                          display: {
                            xs: 'flex',
                            md: 'none'
                          }
                        }}
                      >
                        <MobileHeader />
                      </Box>
                      <Box
                        sx={{
                          display: {
                            xs: 'none',
                            md:
                              router.pathname === '/login' ||
                              router.pathname === '/register'
                                ? 'none'
                                : 'block'
                          },
                          paddingY: 2,
                          paddingX: 4
                        }}
                      >
                        <DesktopHeader />
                      </Box>
                      <Box sx={{ height: '100%' }}>
                        {getLayout(<Component {...pageProps} />)}
                      </Box>
                      <Box
                        sx={{
                          display: {
                            xs: 'none',
                            md:
                              router.pathname === '/login' ||
                              router.pathname === '/register'
                                ? 'none'
                                : 'block'
                          },
                          paddingY: 2,
                          paddingX: 4
                        }}
                      >
                        <Footer />
                      </Box>
                    </>
                  )}
                </AuthConsumer>
            </SnackbarProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
