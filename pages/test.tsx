import { useState } from "react"
import useSWR from "swr"

const TestPage = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const [color, setColor] = useState("red")
  const { data } = useSWR(`/api/v1/test?color=${color}`, fetcher)
  console.log(data)

  return (
    <div>
      <div className="mt-6 w-full border-b border-gray-90 pb-2">
        <h1>TEST</h1>
        <button onClick={() => setColor("red")}>Red</button>
        <button onClick={() => setColor("blue")}>Blue</button>
      </div>
    </div>
  )
}

export default TestPage
