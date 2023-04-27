import React from 'react';

const Spinner = ({
  height,
  width,
  color,
}: {
  height?: number;
  width?: number;
  color?: string;
}) => {
  const spinnerStyle = {
    transformOrigin: 'center',
    animation: 'spinner_zKoa 2s linear infinite',
  };

  return (
    <svg
      height={height || 24}
      width={width || 24}
      stroke={color || 'currentColor'}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spinner_zKoa 2s linear infinite' }}
    >
      <style>
        {`
          @keyframes spinner_zKoa {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes spinner_YpZS {
            0% {
              stroke-dasharray: 0 150;
              stroke-dashoffset: 0;
            }
            47.5% {
              stroke-dasharray: 42 150;
              stroke-dashoffset: -16;
            }
            95%, 100% {
              stroke-dasharray: 42 150;
              stroke-dashoffset: -59;
            }
          `}
      </style>
      <g className="spinner_V8m1" style={spinnerStyle}>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
          style={{
            strokeLinecap: 'round',
            animation: 'spinner_YpZS 1.5s ease-in-out infinite',
          }}
        ></circle>
      </g>
    </svg>
  );
};

export default Spinner;
