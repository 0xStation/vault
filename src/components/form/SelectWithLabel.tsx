import { ReactNode } from "react"
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

export const SelectWithLabel = ({
  label,
  register,
  name,
  children,
  required = false,
  errors,
  registerOptions,
  className = "",
}: {
  label: string
  register: UseFormRegister<FieldValues>
  name: string
  children: ReactNode
  required?: boolean
  errors: any
  registerOptions?: RegisterOptions
  className?: string
}) => {
  const requiredMessage = required ? { required: "Required." } : {}
  return (
    <div className={`${className} mb-3 grid w-full items-center gap-3`}>
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-b border-b-gray-115"
        {...register(name, { ...registerOptions, ...requiredMessage })}
      >
        {children}
      </select>
      <p className="text-xs text-red">
        {errors[name] && errors[name]?.message}
      </p>
    </div>
  )
}

export default SelectWithLabel
