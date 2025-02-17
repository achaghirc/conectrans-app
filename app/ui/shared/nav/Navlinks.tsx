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
  { name: 'Ofertas' , href: '/account-company/offers', icon: ContentPasteOutlined, roles: ['COMPANY'] },
  { name: 'Subscripciones', href: '/account-company/subscriptions', icon: PaymentOutlined, roles: ['COMPANY'] },
  { name: 'Panel económico', href: '/admin', icon: PsychologyOutlined, roles: ['ADMIN'] },  
  { name: 'Empresas', href: '/account-company/companies', icon: NetworkPingOutlined, roles: ['ADMIN'] },
  { name: 'Conductores', href: '/account-company/drivers', icon: LocalShippingOutlined, roles: ['ADMIN'] },
];

export default function NavLinks({ role, onClick }: NavlinksProps) {
  const [authorizedLinks, setAuthorizedLinks] = useState<NavLinksType[]>([]);
  const pathname = usePathname();
	useEffect(() => {
			const authorizedLinks = links.filter((link) => link.roles.includes(role));
			console.log(role)
			setAuthorizedLinks(authorizedLinks);
	},[role]);


  return (
    <List style={{ width: '100%', margin: '0 auto'}}>
      {authorizedLinks.map((link: NavLinksType, index: number) => {
        const LinkIcon = link.icon;
        const selected = pathname === link.href;
        return (
          <Link href={link.href} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem disablePadding sx={{ mt: 2 }}>
                <ListItemButton selected={selected} onClick={onClick}>
                <ListItemIcon>
                   <LinkIcon />
                </ListItemIcon>
                <ListItemText 
                    primary={link.name} 
                    />
                </ListItemButton>
            </ListItem>
            <Divider />
          </Link>
        );
      })}
    </List>
  );
}