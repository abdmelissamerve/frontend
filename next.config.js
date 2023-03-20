const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);
const { withSentryConfig } = require('@sentry/nextjs');
const withImages = require('next-images');

const moduleExports = withImages(
  calendarTranspile({
    distDir: 'build',
    i18n: {
      defaultLocale: 'en',
      locales: ['en']
    },
    typescript: {
      ignoreBuildErrors: true
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
