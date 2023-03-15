const LoadingCard = () => {
  return (
    <div className="mx-auto w-full p-4">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-80"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-80"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-80"></div>
              <div className="col-span-1 h-2 rounded bg-gray-80"></div>
              <div className="col-span-2 h-2 rounded bg-gray-80"></div>
              <div className="col-span-1 h-2 rounded bg-gray-80"></div>
            </div>
            <div className="h-2 rounded bg-gray-80"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingCardList = () => {
  return (
    <div className="divide-y divide-gray-80 border-b border-gray-80">
      {Array(5)
        .fill(0)
        .map((_a, key) => (
          <LoadingCard key={key} />
        ))}
    </div>
  )
}

export default LoadingCardList
