import { Metadata } from "next"


import { getRegion } from "@lib/data/regions"
import { CategoryCarousel } from "@/components/category-carousel"
import { FeaturedBrands } from "@/components/featured-brands"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSlider, SlideData } from "@/components/hero-slider"
import { getCollectionsList } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"

const heroSlides: SlideData[] = [
  {
    image: "https://picsum.photos/1200/800?random=1",
    title: "Summer Collection",
    description: "Discover our latest arrivals for the season",
    cta: "Shop Now",
  },
  {
    image: "https://picsum.photos/1200/800?random=2",
    title: "New Accessories",
    description: "Complete your look with our trendy accessories",
    cta: "Explore",
  },
  {
    image: "https://picsum.photos/1200/800?random=3",
    title: "Sale Up to 50% Off",
    description: "Don't miss out on our biggest sale of the year",
    cta: "Shop Sale",
  },
]

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const region = await getRegion(countryCode)
  const collections = await getCollectionsList()
  const categories = await listCategories()
  return (
    <>
      <HeroSlider slides={heroSlides} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
        {/*// @ts-ignore*/}
        <CategoryCarousel categories={categories} />
        <FeaturedProducts />
        <FeaturedBrands/> 
        </ul>
      </div>
    </>
  )
}
