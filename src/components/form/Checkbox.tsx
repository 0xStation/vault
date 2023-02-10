const Checkbox = ({
  name,
  value,
  checked,
  defaultChecked,
}: {
  name: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  className?: string
}) => {
  return (
    <input
      name={name}
      value={value}
      defaultChecked={defaultChecked}
      type="checkbox"
      checked={checked}
    />
  )
}

export default Checkbox
