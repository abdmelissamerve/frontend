import type { ReactNode } from "react";

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
        heading: "General",
        items: [
            {
                name: "Users",
                link: "/users",
            },
            {
                name: "Organisations",
                link: "/organisations",
            },
        ],
    },
];

const technicianMenu: MenuItems[] = [
    {
        heading: "General",
        items: [
            {
                name: "Technician Dashboard",
                link: "/technician/dashboard",
            },
        ],
    },
];

export { menuItems, technicianMenu };
