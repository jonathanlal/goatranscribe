import { styled } from 'frostbyte';
import Select from 'react-dropdown-select';

export const StyledLink = styled('button', {
  color: '$purple7',
  fontWeight: 'bold',

  background: 'none',
  border: 'none',
  outline: 'inherit',
  padding: 0,
  cursor: 'pointer',
  fontSize: 'inherit',
  letterSpacing: '1px',

  '&:hover': {
    textDecoration: 'underline',
  },

  variants: {
    color: {
      blue: {
        color: '$indigo7',
      },
      black: {
        color: '$black',
      },
    },
    underline: {
      true: {
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      },
    },
  },
});

export const TitleWithIconWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '20px',

  '& h1, & h2, & h3, & h4, & h5, & h6': {
    lineHeight: 1.1,
    marginBottom: '5px',
  },

  variants: {
    color: {
      purple: {
        color: '$purple9',
      },
      blue: {
        color: '$indigo9',
      },
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

export const StyledSelect = styled(Select, {
  borderColor: '$mauve2',
  outline: 'none',
  //   backgroundColor: '$mauve',

  '& .react-dropdown-select-dropdown': {
    backgroundColor: '$mauve2',
  },
});

export const StyledItem = styled('div', {
  padding: '10px',
  color: '$mauve12',
  backgroundColor: '$mauve1',
  borderRadius: '3px',
  margin: '3px',
  cursor: 'pointer',
  '& > div': {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginRight: '10px',
  },
  '& :hover': {
    // background: '#f2f2f2',
  },
});
