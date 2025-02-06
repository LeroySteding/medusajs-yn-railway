"use client"

import { loadStripe } from "@stripe/stripe-js"
import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { isStripe } from "@lib/constants"
import { Elements } from "@stripe/react-stripe-js"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Heading, Text } from "@medusajs/ui"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const stripePromise = stripeKey
  ? loadStripe(stripeKey, stripeAccountId ? { stripeAccount: stripeAccountId } : undefined)
  : null

type PaymentWrapperV2Props = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

type PaymentStep = "method_selection" | "payment_details" | "confirmation"

const PaymentWrapperV2: React.FC<PaymentWrapperV2Props> = ({ cart, children }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("method_selection")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true)
        if (paymentSession) {
          setSelectedProvider(paymentSession.provider_id)
          setCurrentStep("payment_details")
        }
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment")
        setIsLoading(false)
      }
    }

    if (cart) {
      initializePayment()
    }
  }, [cart, paymentSession])

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setCurrentStep("payment_details")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Text>Loading payment options...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">
        <Text>{error}</Text>
        <button 
          onClick={() => window.location.reload()} 
          className="block mx-auto mt-4 text-blue-500 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (currentStep === "method_selection") {
    return (
      <div className="flex flex-col gap-4">
        <Heading level="h2" className="text-2xl font-bold">
          Select Payment Method
        </Heading>
        <div className="grid grid-cols-1 gap-4">
          {stripePromise && (
            <>
              <button
                onClick={() => handleProviderSelect("stripe_ideal")}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <img src="/ideal-logo.svg" alt="iDEAL" className="h-8 w-auto" />
                <div className="text-left">
                  <Text className="font-semibold">iDEAL</Text>
                  <Text className="text-sm text-gray-600">
                    Pay securely with iDEAL
                  </Text>
                </div>
              </button>
              <button
                onClick={() => handleProviderSelect("stripe")}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <img src="/stripe-logo.png" alt="Stripe" className="h-8 w-auto" />
                <div className="text-left">
                  <Text className="font-semibold">Credit Card</Text>
                  <Text className="text-sm text-gray-600">
                    Pay securely with your credit card
                  </Text>
                </div>
              </button>
            </>
          )}
          {paypalClientId && (
            <button
              onClick={() => handleProviderSelect("paypal")}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <img src="/paypal-logo.png" alt="PayPal" className="h-8 w-auto" />
              <div className="text-left">
                <Text className="font-semibold">PayPal</Text>
                <Text className="text-sm text-gray-600">
                  Pay with your PayPal account
                </Text>
              </div>
            </button>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === "payment_details") {
    if ((isStripe(selectedProvider) || selectedProvider === "stripe_ideal") && stripePromise && paymentSession) {
      return (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentSession.data.client_secret as string,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#000000",
              },
            },
            payment_method_types: selectedProvider === "stripe_ideal" ? ["ideal"] : ["card"],
          }}
        >
          {children}
        </Elements>
      )
    }

    if (selectedProvider === "paypal" && paypalClientId) {
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
  }

  return <div>{children}</div>
}

export default PaymentWrapperV2 