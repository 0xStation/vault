export const DefaultPfp = ({ size }: { size: "xs" | "sm" | "base" | "lg" }) => {
  const sizeMap = {
    xs: "16",
    sm: "24",
    base: "34",
    lg: "45",
  }
  return (
    <svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="180" cy="180" r="180" fill="url(#paint0_linear_1067_44822)" />
      <defs>
        <linearGradient
          id="paint0_linear_1067_44822"
          x1="180"
          y1="0"
          x2="180"
          y2="360"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#AD72FF" />
          <stop offset="1" stop-color="#FF9956" />
        </linearGradient>
      </defs>
    </svg>
  )
}
