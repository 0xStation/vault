import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const config = {
  runtime: "edge",
}

export default function (req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get("requestTitle")

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "white",
          background: "black",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          alt="Vercel"
          height={100}
          src="https://station-images.nyc3.digitaloceanspaces.com/TerminalLogo4%201.png"
          width={100}
        />
        <p>{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    },
  )
}
