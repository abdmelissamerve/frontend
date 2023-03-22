import type { ReactNode } from 'react';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

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
        name: 'Users',
        link: '/users'
      },
      {
        name: 'Blocklists',
        link: '/blocklist_organisations'
      },
      {
        name: 'Organisations',
        link: '/organisations'
      },
      {
        name: 'Hardware Stock',
        link: '/hardware-stock'
      },
      {
        name: 'Technician Dashboard',
        link: '/technician/dashboard'
      }
    ]
  },
  {
    heading: 'Reports',
    items: [
      {
        name: 'Blocklists Check Reports',
        link: '/blocklists/reports'
      },
      {
        name: 'WhoIs Reports',
        link: '/whois/reports'
      }
    ]
  },
  {
    heading: 'Actions',
    items: [
      {
        name: 'Change requests',
        link: '/change-requests'
      }
    ]
  }
];

const technicianMenu: MenuItems[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'Technician Dashboard',
        link: '/technician/dashboard'
      }
    ]
  }
];

export { menuItems, technicianMenu };
