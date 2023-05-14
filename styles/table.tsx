import { styled } from 'frostbyte';
import { Table as STable, Tr, Tbody, Td } from 'react-super-responsive-table';

export const HeaderRow = styled(Tr, {
  textAlign: 'left',
  borderBottom: '1px solid $plum11',
  '& th': {
    padding: 10,
  },
});

export const TRow = styled(Tr, {
  '& td': {
    padding: 10,
  },

  variants: {
    hasLink: {
      true: {
        '& td:first-child': {
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          color: '$purple12',
        },
        '&:hover': {
          backgroundColor: '$primary',
          color: '$primaryContrast',
          cursor: 'pointer',

          '& td:first-child': {
            color: '$primaryContrast',
          },
        },
      },
      false: {
        '&:hover': {
          cursor: 'unset',
          backgroundColor: '$purple2',
        },
      },
    },
  },
});

export const Table = styled(STable, {
  borderRadius: 5,
  backgroundColor: '$purple4',
  boxSize: 'border-box',
  borderCollapse: 'collapse',
  margin: '15px 0',
  boxShadow: '$primary',
});

export const Cell = styled(Td, {});
export const TBody = styled(Tbody, {});
