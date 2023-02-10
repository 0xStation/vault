import { Transition } from "@headlessui/react"
import { Button } from "@ui/Button"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import prisma from "../../prisma/client"
import RequestCard from "../../src/components/core/RequestCard"
import { Request } from "../../src/models/request/types"

const TerminalRequestsPage = ({ requests }: { requests: Request[] }) => {
  const [selectedCount, setSelectedCount] = useState<number>(0)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchAll = watch()

  useEffect(() => {
    const checkBoxValues = Object.values(watchAll)
    const checkedBoxes = checkBoxValues.filter((v) => v)
    setSelectedCount(checkedBoxes.length)
  }, [watchAll])

  const onSubmit = (data: any) => console.log(data)
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y divide-slate-200">
          {requests.map((request, idx) => {
            return (
              <RequestCard
                key={`request-${idx}`}
                index={idx}
                request={request}
                formRegister={register}
              />
            )
          })}
        </div>
      </form>

      <div className="fixed inset-x-0 bottom-0 max-w-full p-4">
        <Transition
          show={selectedCount > 0}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-y-[200%]"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-[200%]"
        >
          <div className="flex w-full flex-row items-center justify-between rounded-full bg-slate-500 px-4 py-2">
            <p className="text-sm text-white">{selectedCount} selected</p>
            <Button size="sm" variant="secondary" onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </Transition>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  let requests = await prisma.request.findMany()
  requests = JSON.parse(JSON.stringify(requests))
  return {
    props: {
      requests: requests,
    },
  }
}

export default TerminalRequestsPage
