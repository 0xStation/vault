const Checkbox = ({
  name,
  value,
  checked,
  defaultChecked,
  formRegister,
}: {
  name: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  formRegister: any
}) => {
  return (
    <input
      {...formRegister(name)}
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      type="checkbox"
      checked={checked}
    />
  )
}

export default Checkbox
