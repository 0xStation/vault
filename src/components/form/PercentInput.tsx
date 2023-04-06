import get from "lodash.get"
import { RegisterOptions, UseFormRegister } from "react-hook-form"

// TODO: extend native html props
export const PercentInput = ({
  label,
  register,
  placeholder,
  name,
  required = false,
  min = 0,
  max = 100,
  decimals = 1,
  errors,
  registerOptions = {},
  ...rest
}: {
  label: string
  register: UseFormRegister<any>
  placeholder?: string
  name: string
  required?: boolean
  min?: number
  max?: number
  decimals?: number
  errors: any
  registerOptions?: RegisterOptions
}) => {
  const requiredMessage = required ? { required: "Required" } : {}
  return (
    <div className="mb-3 grid w-full items-center gap-1.5">
      <label className="text-base font-bold" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-row space-x-2 border-b border-b-gray-80">
        <input
          // type="number"
          // min={min}
          // step={10 ** (-1 * decimals)}
          // max={max}
          defaultValue={0}
          className="w-full bg-gray-90 placeholder:text-gray"
          placeholder={placeholder}
          {...register(name, {
            required: "Required",
            valueAsNumber: true,
            min: {
              value: min,
              message: `Must be above ${min}`,
            },
            max: {
              value: max,
              message: `Must be below ${max}`,
            },
            validate: (v: number) => {
              if (Math.floor(v * 10 ** decimals) / 10 ** decimals !== v) {
                return "Too many decimals, max allowed: " + decimals
              } else {
                return true
              }
            },
          })}
          {...rest}
        />
        <span className="text-gray">%</span>
      </div>
      <p className="text-sm text-red">
        {get(errors, name) && get(errors, `${name}.message`)}
      </p>
    </div>
  )
}

export default PercentInput
