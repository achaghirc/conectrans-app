'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AccountCircleOutlined, ArrowForwardOutlined, BuildCircleOutlined, CardTravelOutlined, ContentPasteOutlined, LocalShippingOutlined, NetworkPingOutlined, PaymentOutlined, PersonOutlined, PsychologyOutlined } from '@mui/icons-material';
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavlinksProps, NavLinksType } from '@/lib/types/nav-types';
import { set } from 'zod';
import { Fragment, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links: NavLinksType[] = [
  { name: 'Cuenta', href: '/account-user/user',icon: AccountCircleOutlined, roles: ['USER', 'ADMIN'] },
  { name: 'Mis Ofertas', href: '/account-user/offers', icon: ContentPasteOutlined, roles: ['USER'] },
  { name: 'Perfil Conductor', href: '/account-user/driver-profile', icon: LocalShippingOutlined, roles: ['USER'] },
  { name: 'Datos Compañía', href: '/account-company/company',icon: BuildCircleOutlined, roles: ['COMPANY'] },
  { name: 'Datos Personales', href: '/account-company/personal-data', icon: PersonOutlined, roles: [ 'ADMIN'] },
  { name: 'Ofertas' , href: '/account-company/offers', icon: ContentPasteOutlined, roles: ['ADMIN', 'COMPANY'] },
  { name: 'Subscripciones', href: '/account-company/subscriptions', icon: PaymentOutlined, roles: ['ADMIN', 'COMPANY'] },
];

export default function NavLinks({ role, onClick }: NavlinksProps) {
  const [authorizedLinks, setAuthorizedLinks] = useState<NavLinksType[]>([]);
  const pathname = usePathname();
  const router = useRouter();
	useEffect(() => {
			const authorizedLinks = links.filter((link) => link.roles.includes(role));
			console.log(role)
			setAuthorizedLinks(authorizedLinks);
	},[role]);

  const handleOnClick = (route: string) => {
    onClick?.();
    router.push(route);
  }


  return (
    <List style={{ width: '100%', margin: '0 auto'}}>
      {authorizedLinks.map((link: NavLinksType, index: number) => {
        const LinkIcon = link.icon;
        const selected = pathname === link.href;
        return (
          <Fragment key={index}>
            <ListItem disablePadding sx={{ mt: 2 }}>
                <ListItemButton selected={selected} 
                  onClick={() => {
                    handleOnClick(link.href)}
                  }>
                <ListItemIcon>
                   <LinkIcon />
                </ListItemIcon>
                <ListItemText 
                    primary={link.name} 
                    />
                </ListItemButton>
            </ListItem>
            <Divider />
          </Fragment>
        );
      })}
    </List>
  );
}