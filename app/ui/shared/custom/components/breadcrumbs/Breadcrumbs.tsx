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
      <Breadcrumbs aria-label="breadcrumb" sx={{fontSize: '1.2rem', textTransform: 'uppercase'}} separator="›">
        {breadcrumbs.map((breadcrumb: BreadcrumbsProps, index: number) => (
          <Link underline="hover" color={breadcrumb.active ? "textPrimary" : "textDisabled"} href={breadcrumb.href} key={index} aria-current={breadcrumb.active ? 'page' : undefined}>
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
