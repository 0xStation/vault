const LoadingTerminal = () => {
  return (
    <div className="space-y-4 border-t border-b border-gray-90 px-4 py-3 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t">
      <div className="h-6 w-44 animate-pulse rounded-full bg-gray" />
      <div className="flex w-full flex-row space-x-2 text-gray-50">
        <div className="h-4 w-5 animate-pulse rounded-full bg-gray" />
        <div className="h-4 w-20 animate-pulse rounded-full bg-gray" />
      </div>
    </div>
  )
}

const LoadingTerminalList = () => {
  return (
    <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-4">
      {Array(5)
        .fill(0)
        .map((_a, key) => (
          <LoadingTerminal key={key} />
        ))}
    </ul>
  )
}

export default LoadingTerminalList
