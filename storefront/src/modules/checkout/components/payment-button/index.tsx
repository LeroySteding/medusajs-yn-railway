"use client"

import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"

import Spinner from "@modules/common/icons/spinner"
import { placeOrder } from "@lib/data/cart"
import { isStripe } from "@lib/constants"
import { Button } from "@/components/Button"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady?: boolean
  providerId: string
}

const PaymentButton = ({ cart, notReady = false, providerId }: PaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (isStripe(providerId)) {
    return (
      <StripePaymentButton
        cart={cart}
        notReady={notReady}
      />
    )
  }

  if (providerId === "paypal") {
    return (
      <PayPalPaymentButton
        cart={cart}
        notReady={notReady}
      />
    )
  }

  return null
}

export default PaymentButton

const StripePaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements || notReady

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            card: card,
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
              email: cart.email,
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
        }
      )

      if (error) {
        const pi = error.payment_intent

        if (
          (pi && pi.status === "requires_capture") ||
          (pi && pi.status === "succeeded")
        ) {
          await onPaymentCompleted()
          return
        }

        setErrorMessage(error.message || "An error occurred with the payment")
        return
      }

      if (
        (paymentIntent && paymentIntent.status === "requires_capture") ||
        paymentIntent.status === "succeeded"
      ) {
        await onPaymentCompleted()
        return
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred with the payment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        disabled={disabled}
        onClick={handlePayment}
        isLoading={submitting}
        className="w-full"
      >
        {submitting ? "Processing..." : "Place order"}
      </Button>
      {errorMessage && (
        <div className="mt-4">
          <ErrorMessage error={errorMessage} />
        </div>
      )}
    </div>
  )
}

const PayPalPaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [{ isPending }] = usePayPalScriptReducer()

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  if (isPending) {
    return <div className="w-full text-center">Loading PayPal...</div>
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: "horizontal" }}
        disabled={notReady}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: cart.region?.currency_code?.toUpperCase() || "USD",
                  value: (cart.total / 100).toString(),
                },
              },
            ],
          })
        }}
        onApprove={async (
          data: OnApproveData,
          actions: OnApproveActions
        ) => {
          await actions.order?.capture()
          await onPaymentCompleted()
        }}
        onError={(err) => {
          setErrorMessage("PayPal payment failed. Please try again.")
          console.error("PayPal error:", err)
        }}
      />
      {errorMessage && (
        <div className="mt-4">
          <ErrorMessage error={errorMessage} />
        </div>
      )}
    </div>
  )
}
