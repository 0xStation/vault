import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import Layout from "../../src/components/terminalCreation/Layout"

export const GettingStartedPage = () => {
  const router = useRouter()
  const chainNameAndSafeAddress = router.query.chainNameAndSafeAddress as string

  const gettingStartedOptions = [
    {
      title: "Pool funds",
      subtitle:
        "Copy the Terminal address and transfer the funds  to start governing with other members.",
      ctaCopy: "Copy address",
      ctaFunc: () => {},
    },
    {
      title: "Send tokens",
      subtitle:
        "Working with contributors? Easily send tokens to reward them for their work.",
      ctaCopy: "Try it out!",
      ctaFunc: () => {},
    },
    {
      title: "Split NFT sales",
      subtitle:
        "Copy to explain the feature and an idea on what they can used it for.",
      ctaCopy: "Try it out!",
      ctaFunc: () => {},
    },
  ]
  return (
    <Layout
      backFunc={() => router.push(`/${chainNameAndSafeAddress}`)}
      isCloseIcon={true}
    >
      <h2 className="mb-[30px] font-bold">Getting started</h2>
      <p className="mt-6 mb-6">
        Let us help you and your collective get started.
      </p>
      {gettingStartedOptions.map((option) => (
        <div className="mb-3 rounded bg-gray-200 p-2.5 pl-6" key={option.title}>
          <p className="font-bold">{option.title}</p>
          <p className="mt-1 mb-3 text-sm">{option.subtitle}</p>
          <Button variant="secondary" size="sm">
            {option.ctaCopy}
          </Button>
        </div>
      ))}
    </Layout>
  )
}

export default GettingStartedPage
