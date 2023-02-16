import get from "lodash.get"
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

// TODO: extend native html props
export const InputWithLabel = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  errors,
  registerOptions = {},
  type = "text",
  className = "",
  ...rest
}: {
  label: string
  register: UseFormRegister<FieldValues>
  placeholder?: string
  name: string
  required?: boolean
  errors: any
  registerOptions?: RegisterOptions
  className?: string
  type?: string
}) => {
  const requiredMessage = required ? { required: "Required." } : {}

  return (
    <div className={`${className} grid w-full max-w-sm items-center gap-1.5`}>
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        className="border-b border-b-slate-300 placeholder:text-slate-400"
        placeholder={placeholder}
        {...register(name, { ...registerOptions, ...requiredMessage })}
        {...rest}
      />
      <p className="text-xs text-red">
        {get(errors, name) && get(errors, `${name}.message`)}
      </p>
    </div>
  )
}

export default InputWithLabel
