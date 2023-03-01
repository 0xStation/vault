const Checkbox = ({
  name,
  value,
  checked,
  defaultChecked,
  formRegister,
  isDisabled,
}: {
  name: string
  value?: any
  checked?: boolean
  defaultChecked?: boolean
  formRegister: any
  isDisabled: boolean
}) => {
  return (
    <input
      onClick={(e) => e.stopPropagation()}
      {...formRegister(name)}
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      type="checkbox"
      checked={checked}
      disabled={isDisabled}
    />
  )
}

export default Checkbox
