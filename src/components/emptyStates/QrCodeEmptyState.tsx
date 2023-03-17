import { CopyAddressButton } from "components/core/CopyAddressButton"
import QRCode from "components/core/QrCode"
import { EmptyState } from "./EmptyState"

export const QrCodeEmptyState = ({
  title,
  subtitle,
  address,
  qrCodeSize,
}: {
  title: string
  subtitle: string
  children?: any
  address: string
  qrCodeSize: number
}) => {
  return (
    <EmptyState title={title} subtitle={subtitle}>
      <QRCode value={address} size={qrCodeSize} />
      <CopyAddressButton address={address} className="mt-6" />
    </EmptyState>
  )
}

export default QrCodeEmptyState
