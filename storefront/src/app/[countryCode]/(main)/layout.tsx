import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import { SiteHeader } from "components/header/site-header"
import { InstagramCarousel } from "components/instagram-carousel"
import { listCategories } from "@lib/data/categories"
import { Footer } from "@/components/Footer"
export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const categories = await listCategories()
  
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <SiteHeader categories={categories} />
      {props.children}
      <InstagramCarousel />
      <Footer />
    </div>
  )
}
