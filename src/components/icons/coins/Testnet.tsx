import React from "react"
import { icon, IconProps } from "../utils"

export const Testnet = ({ size = "sm" }: IconProps) => {
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
        d="M14 28C21.732 28 28 21.732 28 14C28 6.26802 21.732 0 14 0C6.268 0 -1.52588e-05 6.26802 -1.52588e-05 14C-1.52588e-05 21.732 6.268 28 14 28Z"
        fill="#64748B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 28C21.732 28 28 21.732 28 14C28 6.26802 21.732 0 14 0C6.268 0 -1.52588e-05 6.26802 -1.52588e-05 14C-1.52588e-05 21.732 6.268 28 14 28Z"
        fill="url(#paint0_linear_1103_44554)"
        fillOpacity="0.3"
      />
      <path
        d="M8.19 14.7695L14 18.2068L19.8089 14.7695L14 22.9579L8.19 14.7695Z"
        fill="url(#paint1_linear_1103_44554)"
      />
      <path
        d="M14 16.9276L8.19 13.4903L14 4.33984L19.81 13.4903L14 16.9276Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1103_44554"
          x1="-1.52588e-05"
          y1="0"
          x2="14"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1103_44554"
          x1="13.9994"
          y1="14.7695"
          x2="13.9994"
          y2="22.9579"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
