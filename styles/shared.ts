import { styled } from 'frostbyte';

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
