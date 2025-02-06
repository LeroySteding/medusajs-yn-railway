import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion, listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import { HeroSlider, SlideData } from "@/components/hero-slider"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { getProductsByCategoryId } from "@lib/data/products"
import { ProductCategory } from "@medusajs/client-types"
import { undefined } from "zod"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    category?: string | string[]
    type?: string | string[]
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  const categories = await listCategories()
  if (!categories) {
    return []
  }
  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  const categoryHandles = categories.map((category: StoreProductCategory) => category.handle)
  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      categoryHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()
  return staticParams
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const categoryResponse = await getCategoryByHandle([handle])
  if (!categoryResponse.product_categories || categoryResponse.product_categories.length === 0) {
    notFound()
  }
  const category = categoryResponse.product_categories[0]
  if (!category) {
    notFound()
  }
  return {
    title: `${category.name} | Younithy`,
    description: `${category.description || ""} | Younithy`,
  }
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { handle, countryCode } = await params
  const { sortBy, page } = await searchParams

  const categoryResponse = await getCategoryByHandle([handle])
  if (!categoryResponse.product_categories || categoryResponse.product_categories.length === 0) {
    notFound()
  }

  const category = categoryResponse.product_categories[0]

  const categoryData: ProductCategory = {
    // @ts-ignore
    category_children: undefined, is_active: false, is_internal: false, metadata: undefined, mpath: undefined,
    id: category.id,
    name: category.name,
    handle: category.handle,
    parent_category_id: category.parent_category_id,
    description: category.description,
    created_at: category.created_at,
    updated_at: category.updated_at
  };
  const region = await getRegion(countryCode)

  // @ts-ignore
  const products = await getProductsByCategoryId({categoryId: category.id, regionId: region.id})
  
  const headerSlide: SlideData = {
    image: "/images/collection-demo.jpg",
    title: category.name,
    description: category.description || "",
  }  
  const sort = sortBy || "created_at"


  console.log("category", category)
  console.log("region", region)
  console.log("products", products)
  console.log("categoryData", categoryData)
  return (

    <div>
      <HeroSlider slides={[headerSlide]} isSingleSlide={true} />
      <div className="flex flex-col small:flex-row small:items-start mx-8 md:mx-20 py-20">
        <RefinementList sortBy={sort} />
        <PaginatedProducts page={1} countryCode={countryCode}  categoryId={category.id}/>
      </div>
    </div>
  )
}
