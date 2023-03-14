import { ArrowUpRight } from "@icons"
import { cva, VariantProps } from "class-variance-authority"

const link = cva(null, {
  variants: {
    size: {
      sm: "text-base",
      xs: "text-sm",
    },
  },
})

interface HyperlinkProps extends VariantProps<typeof link> {
  href: string
  label: string
}

export const Hyperlink = ({ href, label, size = "sm" }: HyperlinkProps) => {
  return (
    <div className="flex cursor-pointer items-center space-x-1 border-b border-dotted">
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
