import { useCreateFakeSendTokensRequest } from "../src/models/request/hooks"

const WaitDemoPage = () => {
  const { createFakeSendTokens } = useCreateFakeSendTokensRequest(
    5,
    "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
  )
  return (
    <div>
      <p>Wait for tx demo</p>
      <button onClick={() => createFakeSendTokens()}></button>
    </div>
  )
}

export default WaitDemoPage
