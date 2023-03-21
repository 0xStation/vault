import { cva, VariantProps } from "class-variance-authority"

export const icon = cva("", {
  variants: {
    size: {
      xs: "h-2 w-2",
      sm: "h-3 w-3",
      base: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
      mobileLanding: "h-14 w-52",
      landing: "h-44 w-96",
    },
    color: {
      base: "fill-white",
      gray: "fill-gray stroke-gray",
    },
  },
})

export interface IconProps extends VariantProps<typeof icon> {}
