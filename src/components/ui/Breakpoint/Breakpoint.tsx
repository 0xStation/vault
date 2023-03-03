import { ReactNode } from "react"
import { createBreakpoint } from "react-use"

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })

interface BreakpointProps {
  children: (props: boolean) => ReactNode
}
export default function Breakpoint(props: BreakpointProps) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  return (
    <div className="breakpoint-layout-component">
      {props.children(isMobile)}
    </div>
  )
}
