import { useRouter } from "next/router"
import { lazy, Suspense } from "react"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import LoadingCardList from "../../src/components/core/LoadingCardList"
import TerminalRequestsFilterBar from "../../src/components/core/TabBars/TerminalRequestsFilterBar"
const RequestAllList = lazy(
  () => import("../../src/components/fake/RequestAllList"),
)
const RequestClosedList = lazy(
  () => import("../../src/components/fake/RequestClosedList"),
)

const RequestAwaitingOthersList = lazy(
  () => import("../../src/components/fake/RequestAwaitingOthersList"),
)

const RequestNeedsAttentionList = lazy(
  () => import("../../src/components/fake/RequestNeedsAttentionList"),
)

// I wonder if we could start the lazy loading on hover instead of click
const CSRLazyPage = () => {
  const router = useRouter()
  return (
    <>
      <AccountNavBar />
      <TerminalRequestsFilterBar>
        {router.query.filter === "needs-attention" && (
          <Suspense fallback={<LoadingCardList />}>
            <RequestNeedsAttentionList />
          </Suspense>
        )}
        {router.query.filter === "awaiting-others" && (
          <Suspense fallback={<LoadingCardList />}>
            <RequestAwaitingOthersList />
          </Suspense>
        )}
        {router.query.filter === "closed" && (
          <Suspense fallback={<LoadingCardList />}>
            <RequestClosedList />
          </Suspense>
        )}
        {router.query.filter === "all" && (
          <Suspense fallback={<LoadingCardList />}>
            <RequestAllList />
          </Suspense>
        )}
      </TerminalRequestsFilterBar>
    </>
  )
}

export default CSRLazyPage
