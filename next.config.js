const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);

const withImages = require('next-images');
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = withImages(
  calendarTranspile({
    // distDir: 'build',
    i18n: {
      defaultLocale: 'en',
      locales: ['en']
    },
    typescript: {
      ignoreBuildErrors: true
    },
    images: {
      disableStaticImages: true
    },
    eslint: { ignoreDuringBuilds: true }
  })
);

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
