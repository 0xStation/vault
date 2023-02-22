import LoadingCardList from "./LoadingCardList"
const RequestListByFilterAndTab = ({
  filter,
  tab,
}: {
  filter: string
  tab: string
}) => {
  // 1. make CSR to fetch requests by the given filter + tab combo
  // 2. can use SWR + a custom hook
  return <LoadingCardList />
}

export default RequestListByFilterAndTab
