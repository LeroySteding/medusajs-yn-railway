"use client"

import { HttpTypes } from "@medusajs/types"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY || ""
const stripePromise = loadStripe(stripeKey)

type SingleCheckoutWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const SingleCheckoutWrapper = ({ cart, children }: SingleCheckoutWrapperProps) => {
  const [clientSecret, setClientSecret] = useState<string>("")

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const session = cart.payment_collection?.payment_sessions?.find(
          (s) => s.status === "pending"
        )
        
        if (session?.data.client_secret) {
          setClientSecret(session.data.client_secret as string)
        }
      } catch (error) {
        console.error("Error initializing payment:", error)
      }
    }

    if (cart) {
      initializePayment()
    }
  }, [cart])

  return clientSecret && stripePromise ? (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#000000",
          },
        },
      }}
    >
      {children}
    </Elements>
  ) : (
    <div>Loading payment...</div>
  )
}

export default SingleCheckoutWrapper 