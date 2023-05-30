import { FooterProps } from 'frostbyte';
import { Logo } from '../components/Logo';

export const loggedInFooterItems: FooterProps['footerItems'] = [
  {
    type: 'logo',
    description: 'Goatranscribe',
    comp: <Logo />,
  },
  {
    label: 'Links',
    type: 'links',
    items: [
      {
        label: 'Transcribe',
        href: '/transcribe',
      },
      {
        label: 'View Transcripts',
        href: '/transcripts',
      },

      {
        label: 'Add to Balance',
        href: '/balance',
      },
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
  {
    label: 'Other',
    type: 'links',
    items: [
      {
        label: 'Logout',
        href: '/api/auth/logout',
      },
      {
        label: 'Support',
        href: '/support',
      },
      {
        label: 'Feature request',
        href: '/support',
      },
    ],
  },
];
export const loggedOutfooterItems: FooterProps['footerItems'] = [
  {
    type: 'logo',
    description: 'Goatranscribe',
    comp: <Logo />,
  },
  {
    label: 'Links',
    type: 'links',
    items: [
      {
        label: 'Login',
        href: '/api/auth/login',
      },
      {
        label: 'Logout',
        href: '/api/auth/logout',
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
