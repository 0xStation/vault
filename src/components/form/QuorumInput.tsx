import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

// TODO: extend native html props
export const QuorumInput = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  errors,
  registerOptions = {},
  quorumSize,
  ...rest
}: {
  label: string
  register: UseFormRegister<FieldValues>
  placeholder?: string
  name: string
  required?: boolean
  errors: any
  quorumSize: number
  registerOptions?: RegisterOptions
}) => {
  const requiredMessage = required ? { required: "Required" } : {}
  return (
    <div className="mb-3 grid w-full items-center gap-1.5">
      <label className="text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-row justify-between border-b border-b-gray-80">
        <input
          type="number"
          className="w-full bg-black placeholder:text-white"
          placeholder={placeholder}
          {...register(name, { ...registerOptions, ...requiredMessage })}
          {...rest}
        />
        <p className="w-1/3 text-white">out of {quorumSize} members</p>
      </div>
      <p className="text-sm text-red">
        {errors[name] && errors[name]?.message}
      </p>
    </div>
  )
}

export default QuorumInput
