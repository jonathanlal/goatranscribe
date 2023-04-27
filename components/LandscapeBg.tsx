import { styled, useFrostbyte } from 'frostbyte';
import { ReactNode } from 'react';
import { Parallax } from 'react-scroll-parallax';
import {
  Clouds,
  ForeGround,
  TreeLine,
  Mountains1,
  Mountains2,
  Mountains3,
  Ridge,
  Valley1,
  Valley2,
  Lake,
} from './landscape/paths';

const Landscape = styled('div', {
  minHeight: '91vh',
  overflow: 'hidden',
  position: 'relative',

  variants: {
    isDarkTheme: {
      true: {
        background: '#00101F',
      },
      false: {
        background: '#FDD3D4',
      },
    },
  },
});
const LandscapeLayer = styled('div', {
  height: '100%',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
});

const LandscapeImage = styled('div', {
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  left: '50%',
  maxHeight: '100%',
  maxWidth: '300%',
  minWidth: '100%',
  position: 'absolute',
  transform: 'translateX(-50%)',
  width: '2500px',
});

const LandscapeSVG = styled('svg', {
  display: 'block',
  height: 'auto',
  maxWidth: '100%',
});

const LandscapeItem = ({
  children,
  speed,
}: {
  children: ReactNode;
  speed: number;
}) => (
  <LandscapeLayer>
    <LandscapeImage>
      <Parallax speed={speed}>
        <LandscapeSVG
          viewBox="0 0 4000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </LandscapeSVG>
      </Parallax>
    </LandscapeImage>
  </LandscapeLayer>
);

export const LandscapeBg = ({ children }: { children: ReactNode }) => {
  const { isDarkTheme } = useFrostbyte();

  const landScapeThemes = {
    dark: {
      clouds: '#BCD7F8',
      mountains1: {
        shadow: '#1B60A5',
        base: '#2C77BF',
      },
      mountains2: {
        base: '#1B60A5',
        shadow: '#135697',
      },
      mountains3: {
        base: '#124E8F',
        shadow: '#135697',
      },
      lake: {
        water: '#2C77BF',
        reflection: '#BCD7F8',
      },
      valley1: '#093865',
      valley2: '#052B4F',
      treeLine: {
        trees: '#01203E',
        road: '#135697',
      },
      ridge: '#001B33',
      foreground: '#00101F',
    },
    light: {
      clouds: '#F4E5E4',
      mountains1: {
        shadow: '#DABED9',
        base: '#C9AFDA',
      },
      mountains2: {
        shadow: '#AF9ECC',
        base: '#C9AFDA',
      },
      mountains3: {
        base: '#A497C5',
        shadow: '#AF9ECC',
      },
      lake: {
        water: '#DABED9',
        reflection: '#F4E5E4',
      },
      valley1: '#7E89BE',
      valley2: '#6472AB',
      treeLine: {
        trees: '#545986',
        road: '#AF9ECC',
      },
      ridge: '#3F4263',
      foreground: '#2E2C40',
    },
  };

  const currentTheme = landScapeThemes[isDarkTheme ? 'dark' : 'light'];

  const {
    clouds,
    mountains1,
    mountains2,
    mountains3,
    valley1,
    valley2,
    foreground,
    lake,
    ridge,
    treeLine,
  } = currentTheme;

  return (
    <Landscape
      role="img"
      isDarkTheme={isDarkTheme}
      aria-label="Monotone illustration of a landscape. Trees are in the foreground, a loch and forest is in a valley and in the background a mountain range is visible."
    >
      {children}

      <LandscapeItem speed={-30}>
        <Clouds color={clouds} />
      </LandscapeItem>

      <LandscapeItem speed={-26}>
        <Mountains1
          baseColor={mountains1.base}
          shadowColor={mountains1.shadow}
        />
      </LandscapeItem>

      <LandscapeItem speed={-25}>
        <Mountains2
          baseColor={mountains2.base}
          shadowColor={mountains2.shadow}
        />
      </LandscapeItem>

      <LandscapeItem speed={-25}>
        <Mountains3
          baseColor={mountains3.base}
          shadowColor={mountains3.shadow}
        />
      </LandscapeItem>

      <LandscapeItem speed={-20}>
        <Valley1 color={valley1} />
      </LandscapeItem>

      <LandscapeItem speed={-15}>
        <Valley2 color={valley2} />
      </LandscapeItem>

      <LandscapeItem speed={-7}>
        <Lake reflection={lake.reflection} water={lake.water} />
      </LandscapeItem>

      <LandscapeItem speed={-3}>
        <TreeLine road={treeLine.road} trees={treeLine.trees} />
      </LandscapeItem>

      <LandscapeItem speed={-1}>
        <Ridge color={ridge} />
      </LandscapeItem>

      <LandscapeItem speed={0}>
        <ForeGround color={foreground} />
      </LandscapeItem>
    </Landscape>
  );
};
