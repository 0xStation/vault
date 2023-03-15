import { SUPPORTED_CHAINS } from "lib/constants"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { useNetwork, useSwitchNetwork } from "wagmi"
import { VIEW } from "../../../pages/project/new"
import useGetSafeWithoutTerminal from "../../hooks/safe/useGetSafesWithoutTerminal"
import useStore from "../../hooks/stores/useStore"
import { useTerminalCreationStore } from "../../hooks/stores/useTerminalCreationStore"
import LoadingSpinner from "../core/LoadingSpinner"
import { SelectorCard } from "../core/SelectorCard"
import SelectWithLabel from "../form/SelectWithLabel"
import { ExistingSafeCard } from "./ExistingSafeCard"
import Layout from "./Layout"
import { SafeDetailsDrawer } from "./SafeDetailsDrawer"

export const TerminalCreationOptionsView = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<VIEW.CREATE_FORM | VIEW.CREATION_OPTIONS>>
}) => {
  const router = useRouter()
  const { chain } = useNetwork()
  const { switchNetworkAsync, error: networkError } = useSwitchNetwork()
  const activeUser = useStore((state) => state.activeUser)
  const { safeAddresses, isLoading } = useGetSafeWithoutTerminal({
    accountAddress: activeUser?.address as string,
    chainId: chain?.id as number,
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<string>("")

  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      chainId: formData.chainId || chain?.id,
    } as FieldValues,
  })

  const watchChainId = watch("chainId")

  useEffect(() => {
    setFormData({
      ...formData,
      chainId: chain?.id,
    })
  }, [])

  useEffect(() => {
    const switchNetwork = async () => {
      try {
        setError("chainId", {
          type: "wrongNetwork",
          message: "Please check your wallet to switch to specified chain.",
        })
        await switchNetworkAsync?.(parseInt(watchChainId))
        clearErrors("chainId")
      } catch (e: any) {
        setError("chainId", {
          type: "wrongNetwork",
          message: "Please check your wallet to switch to specified chain.",
        })
        if (e.name === "ConnectorNotFoundError") {
          setError("chainId", {
            type: "wrongNetwork",
            message: "Wallet connection error.",
          })
        }
      }
    }
    if (formData?.chainId !== chain?.id) {
      switchNetwork?.()
    } else {
      clearErrors("chainId")
    }
  }, [formData?.chainId, chain?.id])

  return (
    <>
      <SafeDetailsDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        safeAddress={selectedAddress}
        chainId={watchChainId}
      />
      <Layout backFunc={() => router.back()} isCloseIcon={true}>
        <h2 className="font-bold">New Project</h2>
        <p className="mb-7 mt-3 text-gray">
          Use an existing Safe, or create Project with a new address.
        </p>
        <SelectWithLabel
          className="mb-3"
          label="Chain*"
          name="chainId"
          required
          register={register}
          errors={errors}
          registerOptions={{
            onChange: (e: any) => {
              if (!e.target.value) return
              const chainIdNum = parseInt(e.target.value)
              setFormData({ ...formData, chainId: chainIdNum })
            },
          }}
        >
          <option value="">Choose option</option>
          {SUPPORTED_CHAINS?.map((chain, idx) => {
            return (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            )
          })}
        </SelectWithLabel>
        {watchChainId && chain?.id === parseInt(watchChainId) && (
          <>
            <SelectorCard
              className="mt-7"
              onClick={() => setView(VIEW.CREATE_FORM)}
            >
              <p className="font-bold">Create a Project with a new address</p>
              <p className="text-gray">An address is unique to each Project</p>
            </SelectorCard>
            <p className="mt-4 mb-3 text-base font-bold">
              Select to use an existing safe:{" "}
            </p>
            <div className="mb-3">
              {isLoading ? (
                <LoadingSpinner className="mx-auto mt-10 flex w-full justify-center" />
              ) : (
                safeAddresses &&
                safeAddresses?.map((safeAddress) => {
                  return (
                    <ExistingSafeCard
                      key={safeAddress}
                      chainId={watchChainId}
                      safeAddress={safeAddress}
                      setView={setView}
                      setSelectedAddress={setSelectedAddress}
                      setDrawerOpen={setIsOpen}
                    />
                  )
                })
              )}
            </div>
          </>
        )}
      </Layout>
    </>
  )
}

export default TerminalCreationOptionsView
