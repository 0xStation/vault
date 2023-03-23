import useSWR from "swr"

const TestPage = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { isLoading, data, mutate, error } = useSWR("/api/v1/test", fetcher)
  console.log(data)

  return (
    <div>
      <div className="mt-6 w-full border-b border-gray-90 pb-2">
        <h1>TEST</h1>
      </div>
    </div>
  )
}

export default TestPage
