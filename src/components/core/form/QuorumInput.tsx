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
  const requiredMessage = required ? { required: "Required." } : {}
  return (
    <div className="mb-3 grid w-full max-w-sm items-center gap-1.5">
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-row justify-between border-b border-b-slate-300">
        <input
          type="number"
          min="1"
          step="1" // TODO: fix step
          className="placeholder:text-slate-400"
          placeholder={placeholder}
          {...register(name, { ...registerOptions, ...requiredMessage })}
          {...rest}
        />
        <p className="text-slate-400">out of {quorumSize} members</p>
      </div>
      <p className="text-xs text-red">
        {errors[name] && errors[name]?.message}
      </p>
    </div>
  )
}

export default QuorumInput
