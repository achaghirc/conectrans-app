import { Session } from "next-auth";

export type NavLinksType = {
    name: string;
    href: string;
    icon: any;
    roles: string[];
};

export type NavbarSessionData = {
    name: string;
    email: string;
    role: string;
    companyId: number;
    userId: string | undefined;
    assetUrl: string;
    personId: number | undefined;
}

export type NavlinksProps = {
    role: string;
    onClick?: () => void;
}