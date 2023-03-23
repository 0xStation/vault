import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const color = params.get("color")
  console.log(color)
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return NextResponse.json(
    { color },
    {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=86400",
      },
    },
  )
}
