import dynamic from "next/dynamic"
const Breakpoint = dynamic(() => import("./Breakpoint"), { ssr: false })

export default Breakpoint
