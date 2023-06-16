const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);

const withImages = require('next-images');

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


module.exports = moduleExports
