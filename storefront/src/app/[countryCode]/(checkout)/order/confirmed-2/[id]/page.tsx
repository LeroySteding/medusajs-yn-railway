"use client"

import { useEffect, useState } from "react"
import { Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { retrieveOrder } from "@lib/data/orders"

export default function OrderConfirmedPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const paymentIntent = searchParams.get("payment_intent")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const order = await retrieveOrder(id)
        setOrder(order)
      } catch (err: any) {
        setError(err.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-y-4">
          <Heading level="h1" className="text-2xl">Processing order...</Heading>
          <Text>Please wait while we confirm your purchase</Text>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-y-4">
          <Heading level="h1" className="text-2xl text-red-500">
            Something went wrong
          </Heading>
          <Text>{error || "Order not found"}</Text>
          <Link
            href="/"
            className="underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
          >
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl h-full bg-white mx-auto p-8">
      <div className="flex flex-col gap-y-4 h-full w-full">
        <div className="flex flex-col gap-y-2">
          <Heading level="h1" className="text-3xl">
            Order Confirmed
          </Heading>
          <Text className="text-ui-fg-subtle">
            Thank you for your purchase! Your order has been confirmed.
          </Text>
        </div>

        <div className="flex flex-col gap-y-4 border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <Text className="font-semibold">Order number:</Text>
            <Text>{order.display_id}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text className="font-semibold">Date:</Text>
            <Text>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </div>
          <div className="flex items-center justify-between">
            <Text className="font-semibold">Total:</Text>
            <Text>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: order.currency_code.toUpperCase(),
              }).format(order.total / 100)}
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Heading level="h2" className="text-xl">
            Shipping Details
          </Heading>
          <div className="flex flex-col gap-y-2">
            <Text>
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
            </Text>
            <Text>{order.shipping_address?.address_1}</Text>
            {order.shipping_address?.address_2 && (
              <Text>{order.shipping_address.address_2}</Text>
            )}
            <Text>
              {order.shipping_address?.city}, {order.shipping_address?.province}{" "}
              {order.shipping_address?.postal_code}
            </Text>
            <Text>{order.shipping_address?.country_code?.toUpperCase()}</Text>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8">
          <Link
            href="/"
            className="btn-ui hover:opacity-80 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
} 