import { NextApiRequest, NextApiResponse } from "next"
const DEMO_REQUEST = {
  id: "c04caaf1-03a5-470a-aaca-2e09aac09212",
  terminalId: "65b5c63d-db77-4b64-a10e-0127adb779f8",
  data: {
    meta: {
      startsAt: 1676653576868,
      frequency: 0,
      recipient: "0xc67dedd30dcd760560dee6bfe6db4f31b442c9e5",
      transfers: [
        {
          token: {
            name: "United States Coin",
            type: "ERC20",
            symbol: "USDC",
            address: "0xc562ff47dfdeafff596388aaefca2af0fff83de5",
            chainId: 5,
            decimals: 18,
          },
          amount: 1,
          tokenId: 1,
        },
      ],
      frequencyUnit: 0,
      maxOccurences: 1,
      frequencyValue: 1,
    },
    note: "Dignissimos veniam molestiae quibusdam delectus eum pariatur animi tempore qui.",
    createdBy: "0xd4aef867a52ffaa16be2c9e06d9a1de92e0dc21a",
    rejectionActionIds: [],
  },
  number: 8675,
  variant: "TOKEN_TRANSFER",
  createdAt: "2023-02-17T17:06:16.869Z",
  updatedAt: "2023-02-17T17:06:16.869Z",
  approveActivities: [
    {
      id: "eae9ff07-572f-4a8b-b7af-0c8cc581fbbc",
      requestId: "c04caaf1-03a5-470a-aaca-2e09aac09212",
      address: "0xbd57aefce4829f1b14af2be7f8d57a0fef1cbfdc",
      variant: "APPROVE_REQUEST",
      createdAt: "2023-02-17T17:06:16.911Z",
      updatedAt: "2023-02-17T17:06:16.911Z",
      data: {
        comment: "admirable-chassis",
      },
      accountId: "79d9b31b-8bec-4770-85cf-719fbdcaa988",
    },
  ],
  rejectActivities: [
    {
      id: "41e7274d-ffe6-469a-aedb-d2bfda1fe15a",
      requestId: "c04caaf1-03a5-470a-aaca-2e09aac09212",
      address: "0x92096901eebd42aacc1f8563dd57d1e2ba16ff18",
      variant: "REJECT_REQUEST",
      createdAt: "2023-02-17T17:06:16.920Z",
      updatedAt: "2023-02-17T17:06:16.920Z",
      data: {
        comment: "excitable-oxford",
      },
      accountId: "c5dbed76-913b-42bb-b7d3-4861aa333336",
    },
  ],
  commentActivities: [],
  addressesThatHaveNotSigned: [
    "0x6860C9323d4976615ae515Ab4b0039d7399E7CC8",
    "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
  ],
  isExecuted: false,
  quorum: 1,
  terminal: {
    id: "65b5c63d-db77-4b64-a10e-0127adb779f8",
    chainId: 5,
    safeAddress: "0xd0e09D3D8C82A8B92e3B1284C5652Da2ED9aEc31",
    data: {
      name: "needy-wingtip",
      description: "Dolorum amet quibusdam similique nostrum optio ab.",
    },
    createdAt: "2023-02-17T17:06:16.859Z",
    updatedAt: "2023-02-17T17:06:16.859Z",
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  setTimeout(() => {
    const requests = Array(10).fill(DEMO_REQUEST)
    res.status(200).json({ requests: requests })
  }, 1000)
}
