const Checkbox = ({
  name,
  value,
  checked,
  defaultChecked,
  isDisabled,
  onChange,
  className,
}: {
  name: string
  value?: any
  checked?: boolean
  defaultChecked?: boolean
  isDisabled: boolean
  onChange: (e: any) => void
  className?: string
}) => {
  return (
    <input
      className={className}
      onClick={(e) => e.stopPropagation()}
      name={name}
      value={value}
      onChange={onChange}
      defaultChecked={defaultChecked}
      type="checkbox"
      checked={checked}
      disabled={isDisabled}
    />
  )
}

export default Checkbox
