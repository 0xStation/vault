const MOCK_DATA = [
  {
    blockchain: {
      name: "Ethereum Mainnet",
      shortName: "Ethereum",
      chainID: "eip155:1",
      shortChainID: "1",
    },
    value: "14755272374",
    tokenValue: 14755.272374,
    fiat: [
      {
        value: "1478832",
        tokenValue: 14788.32,
        pretty: "14,788.32",
        decimals: 2,
        percentChange24Hour: 0.0012,
        symbol: "USD",
        name: "US Dollar",
        updateTime: "2023-02-22T02:09:00Z",
      },
    ],
    pretty: "14,755.27",
    decimals: 6,
    symbol: "USDC",
    contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    name: "USD Coin",
    symbolLogos: [
      {
        URI: "https://c.neevacdn.net/image/upload/tokenLogos/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        height: 181,
        width: 181,
      },
    ],
  },
  {
    blockchain: {
      name: "Ethereum Mainnet",
      shortName: "Ethereum",
      chainID: "eip155:1",
      shortChainID: "1",
    },
    value: "2723269845571993067",
    tokenValue: 2.723269845571993,
    fiat: [
      {
        value: "447330",
        tokenValue: 4473.3,
        pretty: "4,473.30",
        decimals: 2,
        percentChange24Hour: -0.0392,
        symbol: "USD",
        name: "US Dollar",
        updateTime: "2023-02-22T02:09:00Z",
      },
    ],
    pretty: "2.72",
    decimals: 18,
    symbol: "ETH",
    contractAddress: "0x0000000000000000000000000000000000000000",
    name: "Ether",
    symbolLogos: [
      {
        URI: "https://c.neevacdn.net/image/upload/tokenLogos/ethereum/ethereum.png",
        height: 192,
        width: 192,
      },
    ],
  },
  {
    blockchain: {
      name: "Ethereum Mainnet",
      shortName: "Ethereum",
      chainID: "eip155:1",
      shortChainID: "1",
    },
    value: "90681250000000000",
    tokenValue: 0.09068125,
    fiat: [
      {
        value: "14889",
        tokenValue: 148.89,
        pretty: "148.89",
        decimals: 2,
        percentChange24Hour: -0.0394,
        symbol: "USD",
        name: "US Dollar",
        updateTime: "2023-02-22T02:09:00Z",
      },
    ],
    pretty: "0.09",
    decimals: 18,
    symbol: "WETH",
    contractAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    name: "Wrapped Ether",
    symbolLogos: [
      {
        URI: "https://c.neevacdn.net/image/upload/tokenLogos/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        height: 192,
        width: 192,
      },
    ],
  },
  {
    blockchain: {
      name: "Ethereum Mainnet",
      shortName: "Ethereum",
      chainID: "eip155:1",
      shortChainID: "1",
    },
    value: "150775203075723563196",
    tokenValue: 150.77520307572357,
    fiat: [
      {
        value: "4671",
        tokenValue: 46.71,
        pretty: "46.71",
        decimals: 2,
        percentChange24Hour: -0.0807,
        symbol: "USD",
        name: "US Dollar",
        updateTime: "2023-02-22T02:09:00Z",
      },
    ],
    pretty: "150.78",
    decimals: 18,
    symbol: "AUDIO",
    contractAddress: "0x18aaa7115705e8be94bffebde57af9bfc265b998",
    name: "Audius",
    symbolLogos: [
      {
        URI: "https://c.neevacdn.net/image/upload/tokenLogos/ethereum/0x18aaa7115705e8be94bffebde57af9bfc265b998.png",
        height: 256,
        width: 256,
      },
    ],
  },
  // keeping one of the spam ones in here so we can understand how to filter out or render incomplete responses
  {
    blockchain: {
      name: "Ethereum Mainnet",
      shortName: "Ethereum",
      chainID: "eip155:1",
      shortChainID: "1",
    },
    value: "8",
    tokenValue: 8,
    pretty: "8.00",
    decimals: 0,
    symbol: "927$ Visit aUSDBonus.com to claim",
    contractAddress: "0xa51a8578052edeb4ced5333a5e058860d9e7a35b",
    name: "! aUSDBonus.com",
  },
]

// will fill this out if we can figure out how to get n.xyz working...
// for now MOCK_DATA is an example response from n.xyz
// this way we can just sub the API endpoint in when it's working to get real data
// but we can simulate for now using this mock data
const useFungibleTokenData = (address: string, chainId: number) => {
  return { data: MOCK_DATA }
}

export default useFungibleTokenData
