import { styled } from 'frostbyte';

const Button = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  color: '$indigo8',
  '&:hover': {
    color: '$indigo9',
  },
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontSize: '20px',
  whiteSpace: 'nowrap',
});
const ButtonLinkWrapper = styled('div', {
  width: '100%',
  textAlign: 'right',
});

export const ButtonLink = ({ children, onClick }) => {
  return (
    <ButtonLinkWrapper>
      <Button onClick={onClick}>{children}</Button>
    </ButtonLinkWrapper>
  );
};
