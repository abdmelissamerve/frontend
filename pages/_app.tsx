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
import * as gtag from '../lib/gtag';
import * as ym from '../lib/ym';
import {
  GA_TRACKING_ID,
  YM_TRACKING_ID,
  isProd,
  RECAPTCHA_KEY
} from '../config';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
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
        <title>Ping Latency Tool</title>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Test the latency of your server from all over the world with this awesome &amp; free ping benchmark tool"
        />
        <meta
          name="keywords"
          content="ping, latency, tool, ping latency, benchmark server latency, ping server"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {isProd && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');`
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(${YM_TRACKING_ID}, "init", {
                  defer: true,
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
              });`
              }}
            />
            <noscript>
              <div>
                <img
                  src="https://mc.yandex.ru/watch/88708213"
                  style={{ position: 'absolute', left: '-9999px' }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
      </Head>
      {/*<ReduxProvider store={store}>*/}
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
              <div style={{ zIndex: 999 }} id="recaptcha"></div>
              <GoogleReCaptchaProvider
                reCaptchaKey={RECAPTCHA_KEY}
                scriptProps={{
                  async: false,
                  defer: false,
                  appendTo: 'head',
                  nonce: undefined
                }}
                container={{
                  element: 'recaptcha',
                  parameters: {
                    badge: 'bottomleft'
                  }
                }}
              >
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
              </GoogleReCaptchaProvider>
            </SnackbarProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
      {/*</ReduxProvider>*/}
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
