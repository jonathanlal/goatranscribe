import { styled } from 'frostbyte';
import { Table as STable, Tr, Tbody, Td } from 'react-super-responsive-table';

export const HeaderRow = styled(Tr, {
  textAlign: 'left',

  '& th': {
    padding: 10,
  },

  variants: {
    color: {
      blue: {
        borderBottom: '1px solid $blue11',
      },
      purple: {
        borderBottom: '1px solid $plum11',
      },
    },
  },
});

export const TRow = styled(Tr, {
  '& td': {
    padding: 10,
  },

  '& td:first-child': {
    minWidth: 340,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  compoundVariants: [
    {
      hasLink: true,
      color: 'purple',
      css: {
        '& td:first-child': {
          color: '$purple12',
        },
        '&:hover': {
          backgroundColor: '$purple2',
          color: '$purple12',
          cursor: 'pointer',
          '& td:first-child': {
            color: '$primaryContrast',
          },
        },
      },
    },
    {
      hasLink: true,
      color: 'blue',
      css: {
        '& td:first-child': {
          color: '$blue12',
        },
        '&:hover': {
          backgroundColor: '$blue2',
          color: '$blue12',
          cursor: 'pointer',
          '& td:first-child': {
            color: '$blue12',
          },
        },
      },
    },
  ],
  variants: {
    color: {},
    hasLink: {
      '& td:first-child': {
        textDecoration: 'underline',
        textUnderlineOffset: 3,
      },
    },
    // hasLink: {
    //   true: {
    //     '& td:first-child': {
    //       textDecoration: 'underline',
    //       textUnderlineOffset: 3,
    //       color: '$purple12',
    //     },
    //     '&:hover': {
    //       backgroundColor: '$primary',
    //       color: '$primaryContrast',
    //       cursor: 'pointer',
    //       '& td:first-child': {
    //         color: '$primaryContrast',
    //       },
    //     },
    //   },
    //   false: {
    //     '&:hover': {
    //       cursor: 'unset',
    //       backgroundColor: '$purple2',
    //     },
    //   },
    // },
    // color: {
    //   blue: {
    //     '& td:first-child': {
    //       color: '$blue12',
    //     },
    //     '&:hover': {
    //       backgroundColor: '$blue2',
    //       color: '$blue12',
    //     },
    //   },
    // },
  },
});

export const Table = styled(STable, {
  borderRadius: 5,

  boxSize: 'border-box',
  borderCollapse: 'collapse',
  margin: '15px 0',

  variants: {
    color: {
      blue: {
        backgroundColor: '$blue4',
        boxShadow: '$colors$blue8 0px 0px 3px 2px',
        // boxShadow: '0px 3px 8px 3px $colors$blue6',
      },
      purple: {
        backgroundColor: '$purple4',
        boxShadow: '$colors$primary 0px 0px 3px 2px',
        // boxShadow: '0px 3px 8px 3px $colors$purple6',
      },
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

export const Cell = styled(Td, {});
export const TBody = styled(Tbody, {});
