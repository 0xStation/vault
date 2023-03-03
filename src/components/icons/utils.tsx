import { cva, VariantProps } from "class-variance-authority"

export const icon = cva("", {
  variants: {
    size: {
      xs: "h-2 w-2",
      sm: "h-4 w-4",
      base: "h-6 w-6",
      lg: "h-8-w-8",
      xl: "h-12 w-12",
    },
    color: {
      base: "fill-black",
      "slate-500": "fill-slate-500",
    },
  },
})

export interface IconProps extends VariantProps<typeof icon> {}
