import get from "lodash.get"
import { RegisterOptions, UseFormRegister } from "react-hook-form"

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
  register: UseFormRegister<any>
  placeholder?: string
  name: string
  required?: boolean
  errors: any
  registerOptions?: RegisterOptions
  className?: string
  type?: string
}) => {
  const requiredMessage = required ? { required: "Required" } : {}

  return (
    <div className={`${className} grid w-full items-center gap-1.5`}>
      <label className="text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        className="border-b border-b-gray-80 bg-black placeholder:text-gray"
        placeholder={placeholder}
        {...register(name, { ...registerOptions, ...requiredMessage })}
        {...rest}
      />
      <p className="text-sm text-red">
        {get(errors, name) && get(errors, `${name}.message`)}
      </p>
    </div>
  )
}

export default InputWithLabel
