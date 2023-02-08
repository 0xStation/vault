import { VariantProps, cva } from "class-variance-authority"

export const icon = cva("", {
  variants: {
    size: {
      SM: "h-4 w-4",
      BASE: "h-6 w-6",
      LG: "h-8-w-8",
      XL: "h-12 w-12",
    },
  },
})

export interface IconProps extends VariantProps<typeof icon> {}
