import { Avatar, NavMenuProps, styled } from 'frostbyte';
import { EnterIcon, UploadIcon } from '@radix-ui/react-icons';
import { Claims } from '@auth0/nextjs-auth0';
import Spinner from 'components/Spinner';

const CTABtn = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  // minWidth: 65,
  '@mdMax': {
    width: '120px',
  },

  variants: {
    loading: {
      true: {
        gridTemplateColumns: 'auto',
      },
    },
  },
});

const LinkText = styled('span', {
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  color: '$blue12',
});

const WalletSvg = styled('svg', {
  // color: '$purple12',
  color: '$purple11',
  marginRight: 10,
});

const Balance = styled('span', {
  color: '$green9',
  fontWeight: 700,

  variants: {
    isZero: {
      true: {
        color: '$purple11',
      },
    },
  },
});

const ViewTranscriptWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',

  '& > span:first-child': {
    height: '30px',
    width: '30px',
  },
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

export const loggedInNavBar = (
  user: Claims,
  balance: number
): NavMenuProps['navItems'] => {
  return [
    {
      type: 'button',
      button: {
        color: 'green9',
        // kind: 'success',
        outlined: true,
        borderRadius: 'sm',
      },
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <UploadIcon width={30} height={30} />
          <span>Transcribe</span>
        </div>
      ),
      href: '/transcribe',
    },
    {
      type: 'button',
      button: {
        color: 'purple5',
        // outlined: true,
      },
      label: (
        <ViewTranscriptWrapper>
          <Avatar src={user.picture} alt={user.name} fallBackText={user.name} />
          <span>View Transcripts</span>
        </ViewTranscriptWrapper>
      ),
      href: '/transcripts',
    },

    // {
    //   type: 'link', //need a new type avatar
    //   label: (
    //     <Avatar src={user.picture} alt={user.name} fallBackText={user.name} />
    //   ),
    //   href: '/transcripts',
    // },
    {
      type: 'darkmode',
      label: 'Toggle Dark Mode',
    },
    {
      href: '/balance',
      type: 'button',
      label: (
        <CTABtn loading={balance === undefined}>
          {balance !== undefined ? (
            <>
              <WalletSvg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 00-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </WalletSvg>
              <Balance isZero={balance === 0}>${balance}</Balance>
            </>
          ) : (
            <Spinner height={30} width={30} />
          )}
        </CTABtn>
      ),
      button: {
        color: 'purple5',
        cta: true,
        // outlined: true,
        borderRadius: 'sm',
      },
    },
  ];
};

// [
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
// {
//   type: 'link',
//   label: 'Profile',
//   href: '/profile',
// },
// {
//   type: 'darkmode',
//   label: 'Toggle Dark Mode',
// },
// {
//   type: 'button',
//   label: 'Logout',
//   href: '/api/auth/logout',
//   button: {
//     kind: 'error',
//     cta: true,
//   },
// },
// ];
