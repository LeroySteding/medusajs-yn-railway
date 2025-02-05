import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Layout, LayoutColumn } from "@/components/Layout"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HeroSlider, SlideData } from "@/components/hero-slider"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const images = product.images || []
  const hasImages = Boolean(
    product.images &&
      product.images.filter((image) => Boolean(image.url)).length > 0
  )

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    product.collection?.metadata ?? {}
  )
  const headerSlide: SlideData = {
    image: images[0]?.url || "",
    title: product?.collection?.title || "",
    description: product.title || "",
  }
  return (
    <>
      <HeroSlider slides={[headerSlide]} isSingleSlide={true} />
    <div
      className="pt-18 md:pt-26 lg:pt-37 pb-23 md:pb-36"
      data-testid="product-container"
    >
      <ImageGallery images={images} />
      <Layout>
        <LayoutColumn className="mb-26 md:mb-36">
          <div className="flex max-lg:flex-col gap-8 xl:gap-27">
            {hasImages && (
              <div className="lg:w-1/2 flex flex-1 flex-col gap-8">
                <ImageGallery images={images} />
              </div>
            )}
            <div className="sticky flex-1 top-0">
              <ProductInfo product={product} />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper
                  id={product.id}
                  region={region}
                />
              </Suspense>
            </div>
            {!hasImages && <div className="flex-1" />}
          </div>
        </LayoutColumn>
      </Layout>
      <Suspense fallback={<SkeletonRelatedProducts />}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
      </>
  )
}

export default ProductTemplate
