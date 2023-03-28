import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { SUPPORTED_CHAINS, TRACKING } from "lib/constants"
import { trackClick } from "lib/utils/amplitude"
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction, useEffect } from "react"
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

const { EVENT_NAME, LOCATION, FLOW } = TRACKING

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

  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const { primaryWallet, user } = useDynamicContext()

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
          message: "Switch to the specified chain in your wallet to continue.",
        })
        await switchNetworkAsync?.(parseInt(watchChainId))
        clearErrors("chainId")
      } catch (e: any) {
        setError("chainId", {
          type: "wrongNetwork",
          message: "Switch to the specified chain in your wallet to continue.",
        })
        if (e.name === "ConnectorNotFoundError") {
          setError("chainId", {
            type: "wrongNetwork",
            message: "Wallet connection error. Please try again.",
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
      <Layout backFunc={() => router.back()} isCloseIcon={true}>
        <h2 className="font-bold">New Project</h2>
        <p className="mb-7 mt-3 text-white">
          Use an existing Safe, or create a Project with a new Safe.
        </p>
        <SelectWithLabel
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
          <option value="">Select an option</option>
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
              className="mt-7 mb-6"
              onClick={() => {
                trackClick(EVENT_NAME.CREATE_PROJECT_CLICKED, {
                  location: LOCATION.PROJECT_CREATION_OPTIONS_FORM,
                  accountAddress: primaryWallet?.address,
                  userId: user?.userId,
                  flow: FLOW.CREATE,
                  chainId: chain?.id,
                })
                setView(VIEW.CREATE_FORM)
              }}
            >
              <p className="font-bold">Create a Project with a new Safe</p>
              <p className="text-gray">
                An address unique to the Project will be created
              </p>
            </SelectorCard>
            {safeAddresses && safeAddresses?.length > 0 ? (
              <>
                <hr className="text-gray-90" />
                <p className="mt-6 mb-3 text-base font-bold">
                  Select to use an existing safe
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
                        />
                      )
                    })
                  )}
                </div>
              </>
            ) : null}
          </>
        )}
      </Layout>
    </>
  )
}

export default TerminalCreationOptionsView
