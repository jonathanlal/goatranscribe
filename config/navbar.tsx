import { NavMenuProps } from 'frostbyte';

export const loggedOutNavBar: NavMenuProps['navItems'] = [
  // {
  //   type: 'dropdown',
  //   label: 'About',
  //   dropdown: [
  //     {
  //       label: 'The Company',
  //       description:
  //         'children children srd a children children children children children children children children children',
  //       href: '/',
  //     },
  //     {
  //       label: 'Our Team',
  //       href: '/about',
  //     },
  //     {
  //       label: 'Our Team',
  //       description:
  //         'children children srd a children children children children children children children children children',
  //       href: '/about',
  //     },
  //     {
  //       label: 'Our Team',
  //       href: '/about',
  //     },
  //   ],
  // },
  // {
  //   type: 'dropdown',
  //   label: 'Terms and Conditions',
  //   dropdown: [
  //     {
  //       label: 'Privacy Policy',
  //       description:
  //         'children children srd a children children children children children children children children children',
  //       href: '/',
  //     },
  //     {
  //       label: 'Terms of Use',
  //       description: 'This is a description2',
  //       href: '/about',
  //     },
  //   ],
  // },
  // {
  //   type: 'link',
  //   label: 'Settings',
  //   href: '/',
  // },
  {
    type: 'darkmode',
    label: 'Toggle Dark Mode',
  },
  // {
  //   type: 'button',
  //   label: 'Signup',
  //   href: '/signup',
  //   button: {
  //     kind: 'success',
  //     cta: true,
  //   },
  // },
  {
    href: '/login',
    type: 'button',
    label: 'Login',
    button: {
      kind: 'primary',
    },
  },
];
