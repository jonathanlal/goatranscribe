import { styled, useFrostbyte } from 'frostbyte';
import { useCallback, useRef, useState } from 'react';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const StyledAmountBox = styled('button', {
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  borderRadius: '$5',
  padding: '20px 30px',
  fontWeight: 'bold',

  variants: {
    isSelected: {},
    isDarkTheme: {},
  },
  compoundVariants: [
    {
      isDarkTheme: true,
      isSelected: true,
      css: {
        backgroundColor: '$purple5',
        boxShadow: '0px 0px 0px 1px $colors$purple12',
        color: '$purple12',
      },
    },
    {
      isDarkTheme: true,
      isSelected: false,
      css: {
        backgroundColor: '$mauve1',
        boxShadow: '0px 0px 0px 1px $colors$mauve6',
        color: '$purple11',
        '&:hover': {
          boxShadow: '0px 0px 0px 2px $colors$primaryContrast',
          backgroundColor: '$mauve2',
          transform: 'translateY(-2px)',
        },
      },
    },
    {
      isDarkTheme: false,
      isSelected: true,
      css: {
        backgroundColor: '$purple6',
        boxShadow: '0px 0px 0px 1px $colors$purple12',
      },
    },
    {
      isDarkTheme: false,
      isSelected: false,
      css: {
        backgroundColor: '$mauve2',
        boxShadow: '0px 0px 0px 1px $colors$mauve6',
        color: '$purple11',
        '&:hover': {
          boxShadow: '0px 0px 0px 2px $colors$primaryContrast',
          backgroundColor: '$mauve5',
          transform: 'translateY(-2px)',
        },
      },
    },
  ],
});

const StyledAmountCustomBox = styled('input', {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  fontSize: 'inherit',
  fontWeight: 'bold',
  padding: 0,
  margin: 0,
  boxShadow: 'none',
  '&:focus': {
    outline: 'none',
  },
  '&:hover': {
    cursor: 'pointer',
  },
  // Add these lines to hide the arrows
  appearance: 'textfield',
  '::-webkit-outer-spin-button': {
    appearance: 'none',
    margin: 0,
  },
  '::-webkit-inner-spin-button': {
    appearance: 'none',
    margin: 0,
  },
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },

  variants: {
    isSelected: {},
    isDarkTheme: {},
  },
  compoundVariants: [
    {
      isDarkTheme: true,
      isSelected: true,
      css: {
        backgroundColor: '$purple5',
        color: '$purple12',
        '&::placeholder': {
          color: '$primaryContrast',
        },
      },
    },
    {
      isDarkTheme: true,
      isSelected: false,
      css: {
        '&::placeholder': {
          color: '$purple11',
        },
      },
    },
    {
      isDarkTheme: false,
      isSelected: true,
      css: {
        '&::placeholder': {
          color: '$purple12',
        },
      },
    },
    {
      isDarkTheme: false,
      isSelected: false,
      css: {
        '&::placeholder': {
          color: '$purple11',
        },
      },
    },
  ],
});

const AmountsWrapper = styled('div', {
  margin: '15px auto',
  display: 'grid',
  gap: '20px',
  gridTemplateColumns: 'repeat(4, 1fr)',

  '@mdMax': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
});

function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (...args: Parameters<F>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const AmountBox = ({
  label,
  amount,
  isSelected,
  onClick,
  isCustom,
  isDarkTheme,
}: {
  label: string;
  amount: number;
  isSelected: boolean;
  onClick: (amount: number) => void;
  isDarkTheme: boolean;
  isCustom?: boolean;
}) => {
  const [inputValue, setInputValue] = useState<number>(amount);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isCustom) {
      onClick(amount);
    } else {
      inputRef.current?.focus();
      if (inputValue !== 1 && inputValue !== 5 && inputValue !== 10) {
        onClick(parseInt(inputValue.toString())); //weird
      }
    }
  };
  const debouncedOnClick = useCallback(debounce(onClick, 400), [onClick]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, maxLength } = e.target;
    // const maxLength = e.target.maxLength;
    const newValue = value.slice(0, maxLength);

    setInputValue(parseFloat(newValue));
    if (newValue === '') {
      debouncedOnClick(0);
    } else {
      debouncedOnClick(parseFloat(newValue));
    }
  };

  const handleInputFocus = () => {
    if (isCustom) {
      if (amount === 1 || amount === 5 || amount === 10) {
        onClick(0);
      }
      onClick(amount);
    }
  };

  return (
    <StyledAmountBox
      onClick={handleClick}
      isSelected={isSelected}
      css={{ position: 'relative' }}
      isDarkTheme={isDarkTheme}
    >
      {!isCustom && label}
      {isCustom && (
        <StyledAmountCustomBox
          ref={inputRef}
          maxLength="4"
          type="number"
          placeholder="Custom"
          value={inputValue || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          isSelected={isSelected}
          isDarkTheme={isDarkTheme}
        />
      )}
    </StyledAmountBox>
  );
};

export const Amounts = ({ selectedAmount, setSelectedAmount, isUILoading }) => {
  const { isDarkTheme } = useFrostbyte();
  return (
    <AmountsWrapper>
      {isUILoading ? (
        <SkeletonTheme
          baseColor={isDarkTheme ? '#161618' : ''}
          highlightColor={isDarkTheme ? '#1F1F1F' : ''}
        >
          <Skeleton width="100%" height="68px" />
          <Skeleton width="100%" height="68px" />
          <Skeleton width="100%" height="68px" />
          <Skeleton width="100%" height="68px" />
        </SkeletonTheme>
      ) : (
        <>
          <AmountBox
            label="$1"
            amount={1}
            isSelected={selectedAmount === 1}
            onClick={setSelectedAmount}
            isDarkTheme={isDarkTheme}
          />
          <AmountBox
            label="$5"
            amount={5}
            isSelected={selectedAmount === 5}
            onClick={setSelectedAmount}
            isDarkTheme={isDarkTheme}
          />
          <AmountBox
            label="$10"
            amount={10}
            isSelected={selectedAmount === 10}
            onClick={setSelectedAmount}
            isDarkTheme={isDarkTheme}
          />
          <AmountBox
            label="Custom"
            amount={0}
            isSelected={
              selectedAmount !== 1 &&
              selectedAmount !== 5 &&
              selectedAmount !== 10
            }
            onClick={setSelectedAmount}
            isDarkTheme={isDarkTheme}
            isCustom
          />
        </>
      )}
    </AmountsWrapper>
  );
};
