import React from "react"
import { icon, IconProps } from "../utils"

export const Ethereum = ({ size = "sm" }: IconProps) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={icon({ size })}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 28C21.732 28 28 21.732 28 14C28 6.26802 21.732 0 14 0C6.26802 0 0 6.26802 0 14C0 21.732 6.26802 28 14 28Z"
        fill="#25292E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 28C21.732 28 28 21.732 28 14C28 6.26802 21.732 0 14 0C6.26802 0 0 6.26802 0 14C0 21.732 6.26802 28 14 28Z"
        fill="url(#paint0_linear_1403_19607)"
        fillOpacity="0.3"
      />
      <path
        d="M8.19006 14.7708L14.0001 18.2081L19.8089 14.7708L14.0001 22.9592L8.19006 14.7708Z"
        fill="url(#paint1_linear_1403_19607)"
      />
      <path
        d="M14.0001 16.9278L8.19006 13.4905L14.0001 4.34001L19.8101 13.4905L14.0001 16.9278Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1403_19607"
          x1="0"
          y1="0"
          x2="14"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1403_19607"
          x1="13.9995"
          y1="14.7708"
          x2="13.9995"
          y2="22.9592"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
