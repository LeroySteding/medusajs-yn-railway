import { getBaseURL } from "@lib/util/env"
import { Theme } from "@radix-ui/themes"
import { Metadata } from "next"
import "styles/globals.css"
import { Providers } from "./providers"
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
      <Theme>
        <Providers>{props.children}</Providers>
      </Theme>  
      </body>
    </html>
  )
}
