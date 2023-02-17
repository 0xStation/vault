import { isAddress as ethersIsAddress } from "@ethersproject/address"
import { isEns } from "lib/utils"
import { FieldValues, UseFormRegister } from "react-hook-form"
import useEnsInput from "../../../hooks/ens/useEnsInput"
import InputWithLabel from "./InputWithLabel"

// TODO: extend native html props
export const AddressInput = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  errors,
  type = "text",
  className = "",
  validations,
  ...rest
}: {
  label: string
  register: UseFormRegister<FieldValues>
  placeholder?: string
  name: string
  required?: boolean
  errors: any
  className?: string
  type?: string
  validations?: any
}) => {
  const {
    setAddressInputVal: setClientAddressInputVal,
    ensAddressResult: clientEnsAddressResult,
  } = useEnsInput()

  const handleEnsAddressInputValOnChange = (
    val: any,
    setValToCheckEns: any,
  ) => {
    const fieldVal = val.trim()
    // if value is already an address, we don't need to check for ens
    if (ethersIsAddress(fieldVal)) return

    // set state input val to update ens address
    setValToCheckEns(fieldVal)
  }

  return (
    <>
      <InputWithLabel
        name={name}
        label={label}
        register={register}
        placeholder={placeholder}
        errors={errors}
        className={className}
        required
        registerOptions={{
          validate: {
            isValid: (v: any) => {
              return (
                !v ||
                isEns(v) ||
                ethersIsAddress(v) ||
                "Not a valid ENS name or address."
              )
            },
            ...validations,
          },
          onChange: (e: any) =>
            handleEnsAddressInputValOnChange(
              e.target.value,
              setClientAddressInputVal,
            ),
        }}
      />
    </>
  )
}

export default AddressInput
