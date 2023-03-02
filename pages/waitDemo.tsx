import axios from "axios"
import { utils } from "ethers"
import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { usePrepareSendTransaction, useSendTransaction } from "wagmi"

const fetcher = async (url: string, { arg }: { arg: any }) => {
  try {
    const response = await axios.post<any>(url, arg)
    if (response.status === 200) {
      return response.data
    }
  } catch (err) {
    console.log("err:", err)
  }
}
export function SendTransaction() {
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const { trigger } = useSWRMutation("/api/v1/wait-for-tx", fetcher)

  const { config } = usePrepareSendTransaction({
    request: {
      to,
      value: amount ? utils.parseEther(amount) : undefined,
    },
  })
  const { sendTransaction } = useSendTransaction({
    ...config,
    onSuccess(data) {
      console.log("success")
      trigger({
        hash: data.hash,
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        sendTransaction?.()
      }}
    >
      <input
        aria-label="Recipient"
        onChange={(e) => setTo(e.target.value)}
        placeholder="0xA0Cf…251e"
        value={to}
      />
      <input
        aria-label="Amount (ether)"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.05"
        value={amount}
      />
      <button disabled={!sendTransaction || !to || !amount}>Send</button>
    </form>
  )
}

const WaitDemoPage = () => {
  return (
    <div>
      <p>Wait for tx demo</p>
      <SendTransaction />
    </div>
  )
}

export default WaitDemoPage
