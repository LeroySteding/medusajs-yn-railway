"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { HttpTypes } from "@medusajs/types"
import { isStripe } from "@lib/constants"
import { useEffect, useState } from "react"

type WrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const stripePromise = stripeKey
  ? loadStripe(stripeKey, stripeAccountId ? { stripeAccount: stripeAccountId } : undefined)
  : null

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true)
        // Additional payment initialization logic can go here
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment")
        setIsLoading(false)
      }
    }

    if (cart) {
      initializePayment()
    }
  }, [cart])

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading payment options...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="block mx-auto mt-4 text-blue-500 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (isStripe(paymentSession?.provider_id) && paymentSession && stripePromise) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  if (paymentSession?.provider_id === "paypal" && paypalClientId) {
    return (
      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId,
          currency: cart.region?.currency_code?.toUpperCase() || "USD",
          intent: "capture",
        }}
      >
        {children}
      </PayPalScriptProvider>
    )
  }

  return <div>{children}</div>
}

export default Wrapper
