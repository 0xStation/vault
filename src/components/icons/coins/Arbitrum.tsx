import React from "react"
import { icon, IconProps } from "../utils"

export const Arbitrum = ({ size = "sm" }: IconProps) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={icon({ size })}
    >
      <rect
        x="0.700001"
        y="0.700001"
        width="26.6"
        height="26.6"
        rx="13.3"
        fill="#2D374B"
        stroke="#96BEDC"
        strokeWidth="1.4"
      />
      <mask
        id="mask0_1403_19604"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="28"
      >
        <rect width="28" height="28" rx="14" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1403_19604)">
        <path
          d="M14.0862 18.6041L20.5875 28.8281L24.5932 26.5067L16.7333 14.1124L14.0862 18.6041Z"
          fill="#28A0F0"
        />
        <path
          d="M27.1606 22.0733L27.1576 20.2134L19.8512 8.8064L17.5425 12.7237L24.6335 24.154L26.8055 22.8955C27.0185 22.7225 27.1474 22.4685 27.1609 22.1945L27.1606 22.0733Z"
          fill="#28A0F0"
        />
        <rect
          x="1.05"
          y="1.05"
          width="25.9"
          height="25.9"
          rx="12.95"
          fill="url(#paint0_linear_1403_19604)"
          fillOpacity="0.3"
          stroke="#96BEDC"
          strokeWidth="2.1"
        />
        <path
          d="M0.363451 28.2207L-2.70657 26.4533L-2.94055 25.62L7.74613 9.01936C8.47595 7.82809 10.0658 7.4444 11.5418 7.46528L13.2741 7.51103L0.363451 28.2207Z"
          fill="white"
        />
        <path
          d="M19.1655 7.51103L14.6002 7.52762L2.23999 27.9534L5.85027 30.0321L6.83208 28.3669L19.1655 7.51103Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1403_19604"
          x1="0"
          y1="0"
          x2="14"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
