import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || "",
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || "",
})

async function getAPIResponse(endpoint: string): Promise<any> {
  try {
    return await redis.get(endpoint)
  } catch (err) {
    console.log("err:", err)
  }
}

async function setAPIResponse(endpoint: string, response: any) {
  const expiresIn = 60 * 60 // 1 hour
  return await redis.set(endpoint, JSON.stringify(response), { ex: expiresIn })
}

export async function fetchFromRedisOrAPI(
  endpoint: string,
  fetcher: () => Promise<any>,
) {
  const cachedResponse = await getAPIResponse(endpoint)
  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetcher()
  console.log("response:", response)
  await setAPIResponse(endpoint, response)
  return response
}
