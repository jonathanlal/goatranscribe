import { NavMenuProps, styled } from 'frostbyte';
import { EnterIcon } from '@radix-ui/react-icons';

const CTABtn = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontWeight: 600,
  // color: '$primary',

  // '&:hover': {
  //   color: '$primaryContrast',
  // },
});
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

  {
    href: '/api/auth/login',
    type: 'button',
    label: (
      <CTABtn>
        <EnterIcon
          width={25}
          height={25}
          stroke="currentColor"
          strokeWidth={1}
          strokeOpacity={0.5}
          style={{
            marginTop: 3,
            width: 25,
          }}
        />
        <span>App</span>
      </CTABtn>
    ),
    button: {
      kind: 'primary',
      cta: true,
      borderRadius: 'sm',
    },
  },
];

export const loggedInNavBar: NavMenuProps['navItems'] = [
  // {
  //   type: 'dropdown',
  //   label: 'Profile',
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
  {
    type: 'link',
    label: 'Profile',
    href: '/profile',
  },
  {
    type: 'darkmode',
    label: 'Toggle Dark Mode',
  },
  // {
  //   type: 'button',
  //   label: 'Logout',
  //   href: '/api/auth/logout',
  //   button: {
  //     kind: 'error',
  //     cta: true,
  //   },
  // },
];
