import QRCodeReact from "qrcode.react"
import type { ReactElement } from "react"

const QRCode = ({
  value,
  size,
}: {
  value?: string
  size: number
}): ReactElement => {
  const tailwindHeight = `h-${size}`
  const tailwindWidth = `w-${size}`
  return value ? (
    <div className="mx-auto w-fit rounded bg-white p-3">
      <QRCodeReact
        value={value}
        size={183}
        bgColor="#0D0E11"
        fgColor="#ffffff"
      />
    </div>
  ) : (
    <div
      className={`${tailwindHeight} ${tailwindWidth} animate-pulse bg-gray`}
    />
  )
}

export default QRCode
