"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"

import PaymentWrapperV2 from "@modules/checkout/components/payment-wrapper-v2"
import PaymentButtonV2 from "@modules/checkout/components/payment-button-v2"
import { retrieveCart } from "@lib/data/cart"

export default function CheckoutV2Page() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const cart = await retrieveCart()
        setCart(cart)
      } catch (err: any) {
        setError(err.message || "Failed to load cart")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handlePaymentSuccess = () => {
    if (cart) {
      router.push(`/order/confirmed/${cart.id}`)
    }
  }

  if (loading) {
    return (
      <Container className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Text>Loading checkout...</Text>
      </Container>
    )
  }

  if (error || !cart) {
    return (
      <Container className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <Heading level="h1" className="text-2xl text-red-500 mb-4">
            Error loading checkout
          </Heading>
          <Text>{error || "Cart not found"}</Text>
        </div>
      </Container>
    )
  }

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) === 0

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Heading level="h1" className="text-3xl mb-2">
            Checkout
          </Heading>
          <Text className="text-ui-fg-subtle">
            Complete your purchase securely
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 border rounded-lg">
            <Heading level="h2" className="text-xl mb-4">
              Order Summary
            </Heading>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Text>Subtotal</Text>
                <Text>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: cart.region?.currency_code?.toUpperCase() || "USD",
                  }).format(cart.subtotal / 100)}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Shipping</Text>
                <Text>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: cart.region?.currency_code?.toUpperCase() || "USD",
                  }).format(cart.shipping_total / 100)}
                </Text>
              </div>
              {cart.discount_total > 0 && (
                <div className="flex justify-between text-green-600">
                  <Text>Discount</Text>
                  <Text>
                    -
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: cart.region?.currency_code?.toUpperCase() || "USD",
                    }).format(cart.discount_total / 100)}
                  </Text>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <Text>Total</Text>
                <Text>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: cart.region?.currency_code?.toUpperCase() || "USD",
                  }).format(cart.total / 100)}
                </Text>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 border rounded-lg">
            <Heading level="h2" className="text-xl mb-6">
              Payment
            </Heading>
            <PaymentWrapperV2 cart={cart}>
              {cart.payment_collection?.payment_sessions?.[0] && (
                <PaymentButtonV2
                  cart={cart}
                  notReady={notReady}
                  providerId={cart.payment_collection.payment_sessions[0].provider_id}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </PaymentWrapperV2>
          </div>
        </div>
      </div>
    </Container>
  )
} 