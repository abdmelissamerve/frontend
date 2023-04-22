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
                link: "/dashboard",
            },
            {
                name: "Users",
                link: "/users",
            },
            {
                name: "Projects",
                link: "/projects",
            },
            {
                name: "Tasks",
                link: "/tasks",
            },
            {
                name: "Settings",
                link: "/settings",
            },
            {
                name: "Reports",
                link: "/reports",
            },
            // {
            //     name: "Security",
            //     link: "/users",
            // },
        ],
    },
];

const userMenu: MenuItems[] = [
    {
        heading: "General",
        items: [
            {
                name: "Dashboard",
                link: "/dashboard",
            },
            {
                name: "Projects",
                link: "/projects",
            },
            {
                name: "Tasks",
                link: "/tasks",
            },
            {
                name: "Profile",
                link: "/profile",
            },
            // {
            //     name: "Notifications",
            //     link: "/users",
            // },
            {
                name: "Settings",
                link: "/settings",
            },
        ],
    },
];

export { menuItems, userMenu };
