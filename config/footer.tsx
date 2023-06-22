import { FooterProps } from 'frostbyte';
import { Logo } from '../components/Logo';

export const loggedInFooterItems = ({
  darkMode,
}): FooterProps['footerItems'] => [
  {
    type: 'logo',
    // description: 'Goatranscribe',
    comp: <Logo isDarkMode={darkMode} isFooter={true} />,
  },
  {
    label: 'Links',
    type: 'links',
    items: [
      {
        label: 'Add to Balance',
        href: '/balance',
      },
      {
        label: 'Transcribe',
        href: '/transcribe',
      },
      {
        label: 'Transcripts',
        href: '/transcripts',
      },

      {
        label: 'Settings',
        href: '/settings',
      },
      {
        label: 'Logout',
        href: '/api/auth/logout',
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
        label: 'Support',
        href: '/support',
      },

      {
        label: 'Feature request',
        href: '/support',
      },

      {
        label: 'Privacy Policy',
        href: '/privacy-policy',
      },
      {
        label: 'Terms And Conditions',
        href: '/terms-and-conditions',
      },
    ],
  },
];
export const loggedOutfooterItems = ({
  darkMode,
}): FooterProps['footerItems'] => [
  {
    type: 'logo',
    // description: 'Goatranscribe',
    comp: <Logo isDarkMode={darkMode} />,
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
        label: 'Privacy Policy',
        href: '/privacy-policy',
      },

      {
        label: 'Terms And Conditions',
        href: '/terms-and-conditions',
      },
      // {
      //   label: 'Logout',
      //   href: '/api/auth/logout',
      // },
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
