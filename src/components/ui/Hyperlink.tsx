import { ArrowUpRight } from "@icons"

export const Hyperlink = ({ href, label }: { href: string; label: string }) => {
  return (
    <div className="flex cursor-pointer items-center space-x-2 border-b border-dotted">
      <a href={href} className="text-sm">
        {label}
      </a>
      <ArrowUpRight size="sm" />
    </div>
  )
}
