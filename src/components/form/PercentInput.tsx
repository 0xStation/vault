import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

// TODO: extend native html props
export const PercentInput = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  errors,
  registerOptions = {},
  ...rest
}: {
  label: string
  register: UseFormRegister<FieldValues>
  placeholder?: string
  name: string
  required?: boolean
  errors: any
  registerOptions?: RegisterOptions
}) => {
  const requiredMessage = required ? { required: "Required." } : {}
  return (
    <div className="mb-3 grid w-full items-center gap-1.5">
      <label className="text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-row space-x-2 border-b border-b-slate-300">
        <input
          type="number"
          min={0}
          step={0.1}
          max={100}
          defaultValue={0}
          className="w-full bg-slate-50 placeholder:text-slate-500"
          placeholder={placeholder}
          {...register(name, { ...registerOptions, ...requiredMessage })}
          {...rest}
        />
        <span className="text-slate-500">%</span>
      </div>
      <p className="text-xs text-red">
        {errors[name] && errors[name]?.message}
      </p>
    </div>
  )
}

export default PercentInput
