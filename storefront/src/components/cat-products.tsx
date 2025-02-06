"use client" // include with Next.js 13+

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

type Props = {
  categoryId: string
}

export default function CategoryProducts({
  categoryId,
}: Props) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const limit = 20
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(false)

  useEffect(() => {
    if (!loading) {
      return 
    }

    const offset = (currentPage - 1) * limit

    const searchParams = new URLSearchParams({
      limit: `${limit}`,
      offset: `${offset}`,
      "category_id[]": categoryId,
    })

    fetch(`http://localhost:9000/store/products?${searchParams.toString()}`, {
      credentials: "include",
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
      },
    })
    .then((res) => res.json())
    .then(({ products: dataProducts, count }) => {
      setProducts((prev) => {
        if (prev.length > offset) {
          // products already added because the same request has already been sent
          return prev
        }
        return [
          ...prev,
          ...dataProducts,
        ]
      })
      setHasMorePages(count > limit * currentPage)
      setLoading(false)
    })
  }, [loading])

  return (
    <div>
      {loading && <span>Loading...</span>}
      {!loading && products.length === 0 && (
        <span>No products found for category.</span>
      )}
      {!loading && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
      {!loading && hasMorePages && (
        <button 
          onClick={() => {
            setCurrentPage((prev) => prev + 1)
            setLoading(true)
          }}
          disabled={loading}
        >
          Load More
        </button>
      )}
    </div>
  )
}