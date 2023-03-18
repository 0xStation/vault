import { Button } from "@ui/Button"
import Image from "next/image"
import RequestImage from "public/images/request.png"
import { EmptyState } from "./EmptyState"

export const NuxEmptyState = ({
  title,
  subtitle,
  onClick,
}: {
  title: string
  subtitle: string
  onClick: () => void
}) => {
  return (
    <EmptyState title={title} subtitle={subtitle}>
      <Image src={RequestImage} alt={"Request"} />
      <div className="mx-auto mt-7">
        <Button onClick={onClick}>Create</Button>
      </div>
    </EmptyState>
  )
}
