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
                name: "Dashboard",
                link: "/profile",
            },
            {
                name: "Users",
                link: "/users",
            },
            {
                name: "Projects",
                link: "/users",
            },
            {
                name: "Tasks",
                link: "/users",
            },
            {
                name: "Settings",
                link: "/users",
            },
            {
                name: "Reports",
                link: "/users",
            },
            {
                name: "Security",
                link: "/users",
            },
        ],
    },
];

const userMenu: MenuItems[] = [
    {
        heading: "General",
        items: [
            {
                name: "Dashboard",
                link: "/users",
            },
            {
                name: "Projects",
                link: "/users",
            },
            {
                name: "Tasks",
                link: "/users",
            },
            {
                name: "Profile",
                link: "/profile",
            },
            {
                name: "Notifications",
                link: "/users",
            },
            {
                name: "Settings",
                link: "/users",
            },
        ],
    },
];

export { menuItems, userMenu };
