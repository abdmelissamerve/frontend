import InfoIcon from '@mui/icons-material/Info';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import BlockIcon from '@mui/icons-material/Block';

const menuItems = {
  tools: [
    {
      id: 'ping',
      label: 'Ping Latency',
      path: '/',
      icon: <NetworkWifiIcon />
    },
    {
      id: 'blacklist',
      label: 'Blacklist Check',
      path: 'https://blacklist.admintools.dev',
      icon: <BlockIcon />
    }
  ],
  info: [
    {
      id: 'about',
      label: 'About Us',
      path: '/about-us',
      icon: <InfoIcon />
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      path: '/privacy-policy',
      icon: <PrivacyTipIcon />
    },
    {
      id: 'cookies',
      label: 'Cookies',
      path: '/cookies',
      icon: <CookieIcon />
    }
  ]
};

export { menuItems };
