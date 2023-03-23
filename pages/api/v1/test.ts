import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return NextResponse.json(
    { name: "John Doe" },
    {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=86400",
      },
    },
  )
}
