import get from "lodash.get"
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

// TODO: extend native html props
export const TextareaWithLabel = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  errors,
  registerOptions = {},
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
}) => {
  const requiredMessage = required ? { required: "Required" } : {}

  return (
    <div className={`${className} grid w-full items-center gap-1.5`}>
      <label className="text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="h-[26px] resize-none border-b border-b-gray-80 bg-black placeholder:text-gray"
        placeholder={placeholder}
        {...register(name, { ...registerOptions, ...requiredMessage })}
        {...rest}
        // make height auto-adjust while typing
        // https://stackoverflow.com/questions/7745741/auto-expanding-textarea
        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.style.height = ""
          e.target.style.height = e.target.scrollHeight + "px"
        }}
      />
      <p className="text-sm text-red">
        {get(errors, name) && get(errors, `${name}.message`)}
      </p>
    </div>
  )
}

export default TextareaWithLabel
