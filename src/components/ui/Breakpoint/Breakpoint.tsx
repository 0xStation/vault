import { ReactNode } from "react"
import { createBreakpoint } from "react-use"

export const useBreakpoint = () => {
  const breakpoint = createBreakpoint({ XL: 1280, L: 768, S: 580 })()
  return { isLoading: !breakpoint, isMobile: breakpoint === "S" }
}

interface BreakpointProps {
  children: (props: boolean) => ReactNode
}
export default function Breakpoint(props: BreakpointProps) {
  const { isMobile } = useBreakpoint()

  return (
    <div className="breakpoint-layout-component">
      {props.children(isMobile)}
    </div>
  )
}
