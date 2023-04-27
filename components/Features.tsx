import { styled, useFrostbyte } from 'frostbyte';

const FeaturesContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  minHeight: '100vh',
  width: '100%',

  variants: {
    isDarkTheme: {
      true: {
        backgroundColor: '#00101F',
      },
      false: {
        backgroundColor: '#2E2C40',
      },
    },
  },

  //   position: 'relative',
  //   '&::before': {
  //     content: '',
  //     backgroundRepeat: 'no-repeat',
  //     backgroundPosition: 'center',
  //     backgroundSize: 'cover',
  //     backgroundAttachment: 'fixed',
  //     opacity: '.5',
  //     top: '0',
  //     left: '0',
  //     bottom: '0',
  //     right: '0',
  //     position: 'absolute',
  //   },

  //   variants: {
  //     isDarkTheme: {
  //       true: {
  //         backgroundColor: '#00101F',
  //         '&::before': {
  //           backgroundImage: 'url(/mountains-dark.svg)',
  //         },
  //       },
  //       false: {
  //         backgroundColor: '#FDD3D4',
  //         '&::before': {
  //           backgroundColor: '#FDD3D4',
  //           backgroundImage: 'url(/mountains-light.svg)',
  //         },
  //       },
  //     },
  //   },
});

export const Features = () => {
  const { isDarkTheme } = useFrostbyte();

  return (
    <FeaturesContainer isDarkTheme={isDarkTheme}>
      <h1>Features</h1>
    </FeaturesContainer>
  );
};
