import type { ReactNode } from 'react';

import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'Workers',
        link: '/workers'
      },
      {
        name: 'Providers',
        link: '/providers'
      },
      {
        name: 'Clients',
        link: '/users'
      }
    ]
  }
];

export default menuItems;
