import { FooterProps } from 'frostbyte';
import { Logo } from '../components/Logo';

export const footerItems: FooterProps['footerItems'] = [
  {
    type: 'logo',
    description: 'Seek The Sage',
    comp: <Logo />,
  },
  {
    label: 'Links',
    type: 'links',
    items: [
      {
        label: 'Login',
        href: '/login',
      },
      // {
      //   label: 'Contact',
      //   href: '/contact',
      // },
      // {
      //   label: 'Privacy',
      //   href: '/privacy',
      // },
      // {
      //   label: 'Terms',
      //   href: '/terms',
      // },
    ],
  },
  // {
  //   label: 'Resources',
  //   type: 'links',
  //   items: [
  //     {
  //       label: 'Documentation',
  //       href: '/docs',
  //     },
  //     {
  //       label: 'Blog',
  //       href: '/blog',
  //     },
  //     {
  //       label: 'GitHub',
  //       href: '/test',
  //     },
  //   ],
  // },
  // {
  //   label: 'Contact',
  //   type: 'links',
  //   items: [
  //     {
  //       label: 'Help',
  //       href: '/docs',
  //     },
  //     {
  //       label: 'Sales',
  //       href: '/blog',
  //     },
  //     {
  //       label: 'Advertise',
  //       href: '/test',
  //     },
  //   ],
  // },
];
