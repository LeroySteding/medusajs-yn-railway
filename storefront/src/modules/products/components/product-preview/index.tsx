import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@radix-ui/themes"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  return (
      <div data-testid="product-wrapper">
          <LocalizedClientLink href={`/products/${product.handle}`} className="group">
       
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        </LocalizedClientLink>
        <div className="flex txt-compact-medium mt-4 justify-between">
          
          <div className="flex flex-col">
          <LocalizedClientLink href={`/collections/${product.collection?.handle}`} className="group">
          <Text className="text-ui-fg-subtle" data-testid="product-collection-title">
            {product.collection?.title || "No collection"}
          </Text>
          </LocalizedClientLink>
          <LocalizedClientLink href={`/products/${product.handle}`} className="group">
          <Heading size="1" className="text-lg" data-testid="product-title">
            {product.title}
          </Heading>
          </LocalizedClientLink>
          </div>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
  )
}
