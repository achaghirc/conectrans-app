import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

type BreadcrumbsProps = {
  label: string;
  href: string;
  active?: boolean;
}

type BreadcrumbsComponentProps = {
  breadcrumbs: BreadcrumbsProps[];
}


export default function BreadcrumbsComponent(
  { breadcrumbs } : BreadcrumbsComponentProps
) {
  return (
    <div role="presentation" aria-label="breadcrumb" style={{marginLeft: 10}}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb: BreadcrumbsProps, index: number) => (
          <Link underline="hover" color="inherit" href={breadcrumb.href} key={index} aria-current={breadcrumb.active ? 'page' : undefined}>
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
