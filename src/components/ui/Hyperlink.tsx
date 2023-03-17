import { ArrowUpRight } from "@icons"
import { cva, VariantProps } from "class-variance-authority"

const link = cva(null, {
  variants: {
    size: {
      sm: "text-sm",
      xs: "text-xs",
    },
  },
})

interface HyperlinkProps extends VariantProps<typeof link> {
  href: string
  label: string
}

export const Hyperlink = ({ href, label, size = "sm" }: HyperlinkProps) => {
  return (
    <div className="flex cursor-pointer items-center space-x-1 text-violet">
      <a
        href={href}
        className={link({ size })}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
      <ArrowUpRight size={size} />
    </div>
  )
}
