'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AccountCircleOutlined, BuildCircleOutlined, ContentPasteOutlined, PaymentOutlined, PersonOutlined } from '@mui/icons-material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavlinksProps, NavLinksType } from '@/lib/types/nav-types';
import { set } from 'zod';
import { useEffect, useState } from 'react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links: NavLinksType[] = [
  { name: 'Datos Personales', href: '/account/personal-data', icon: PersonOutlined, roles: ['USER', 'ADMIN'] },
  { name: 'Datos Compañía', href: '/account/company-data',icon: BuildCircleOutlined, roles: ['COMPANY'] },
  { name: 'Cuenta', href: '/account',icon: AccountCircleOutlined, roles: ['USER', 'ADMIN', 'COMPANY'] },
  { name: 'Ofertas' , href: '/account/offers', icon: ContentPasteOutlined, roles: ['ADMIN', 'COMPANY'] },
  { name: 'Subscripciones', href: '/account/subscriptions', icon: PaymentOutlined, roles: ['ADMIN', 'COMPANY'] },
  { name: 'Experiencias', href: '/account/experiences', icon: PersonOutlined, roles: ['USER', 'ADMIN'] },
];

export default function NavLinks({ role }: NavlinksProps) {
  const [authorizedLinks, setAuthorizedLinks] = useState<NavLinksType[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  
	useEffect(() => {
			const authorizedLinks = links.filter((link) => link.roles.includes(role));
			console.log(role)
			setAuthorizedLinks(authorizedLinks);
	},[role]);

  return (
    <List>
      {authorizedLinks.map((link: NavLinksType, index: number) => {
        const LinkIcon = link.icon;
        const selected = pathname === link.href;
        return (
            <ListItem key={index} disablePadding sx={{ mt: 2 }}>
                <ListItemButton selected={selected} onClick={() => router.push(link.href)}>
                <ListItemIcon>
                   <LinkIcon />
                </ListItemIcon>
                <ListItemText 
                    primary={link.name} 
                />
                </ListItemButton>
            </ListItem>
        );
      })}
    </List>
  );
}