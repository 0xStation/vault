import { Transition } from "@headlessui/react"
import { Button } from "@ui/Button"
import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import prisma from "../../prisma/client"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import RequestCard from "../../src/components/core/RequestCard"
import RequestsNavBar from "../../src/components/core/RequestsNavbar"
import { Request } from "../../src/models/request/types"

const TerminalRequestsPage = ({ requests }: { requests: Request[] }) => {
  const [selectedRequests, setSelectedRequests] = useState<any[]>([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  // watches form data and responds on change
  watch((data) => {
    const checkBoxEntries = Object.entries(data)
    const checkedBoxes = checkBoxEntries.filter(([_key, v]) => v)
    setSelectedRequests(checkedBoxes)
  })

  const requestIsSelected = (id: string) => {
    return selectedRequests.find(([rId, _v]: [string, boolean]) => rId === id)
  }

  const onSubmit = (data: any) => console.log(data)

  return (
    <>
      <AccountNavBar />
      <RequestsNavBar>
        <TabsContent value="needs_attention">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="divide-y divide-slate-200">
              {requests.map((request, idx) => {
                return (
                  <RequestCard
                    disabled={
                      selectedRequests.length > 0 &&
                      !requestIsSelected(request.id)
                    }
                    key={`request-${idx}`}
                    index={idx}
                    request={request}
                    formRegister={register}
                  />
                )
              })}
            </div>
          </form>
        </TabsContent>
      </RequestsNavBar>

      <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
        <Transition
          show={selectedRequests.length > 0}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-y-[200%]"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-[200%]"
        >
          <div className="flex w-full flex-row items-center justify-between rounded-full bg-slate-500 px-4 py-2">
            <p className="text-sm text-white">
              {selectedRequests.length} selected
            </p>
            <Button size="sm" variant="secondary" onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </Transition>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // url params
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress

  if (typeof chainNameAndSafeAddress !== "string") {
    // Throw a 404 error if the `myParam` query parameter is missing or is string[]
    return {
      notFound: true,
    }
  }

  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  if (!chainName || !safeAddress) {
    // Throw a 404 error if chainName or safeAddress are not found
    // (invalid format... should be gor:0x...)
    return {
      notFound: true,
    }
  }

  // todo:
  // 1. find the chainId by chainName
  // 2. find the terminal by chainId and safeAddress
  // 3. return terminal as prop or throw notFound

  let requests = await prisma.request.findMany()
  requests = JSON.parse(JSON.stringify(requests))
  return {
    props: {
      requests: requests,
    },
  }
}

export default TerminalRequestsPage
