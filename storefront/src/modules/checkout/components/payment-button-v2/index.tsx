"use client"

import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useElements, useStripe, PaymentElement, IdealBankElement } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"

import { placeOrder } from "@lib/data/cart"
import { isStripe } from "@lib/constants"
import ErrorMessage from "../error-message"

type PaymentButtonV2Props = {
  cart: HttpTypes.StoreCart
  notReady?: boolean
  providerId: string
  onPaymentSuccess?: () => void
}

const PaymentButtonV2 = ({
  cart,
  notReady = false,
  providerId,
  onPaymentSuccess,
}: PaymentButtonV2Props) => {
  if (providerId === "stripe_ideal") {
    return (
      <StripeIdealPaymentButtonV2
        cart={cart}
        notReady={notReady}
        onPaymentSuccess={onPaymentSuccess}
      />
    )
  }

  if (isStripe(providerId)) {
    return (
      <StripePaymentButtonV2
        cart={cart}
        notReady={notReady}
        onPaymentSuccess={onPaymentSuccess}
      />
    )
  }

  if (providerId === "paypal") {
    return (
      <PayPalPaymentButtonV2
        cart={cart}
        notReady={notReady}
        onPaymentSuccess={onPaymentSuccess}
      />
    )
  }

  return null
}

export default PaymentButtonV2

const StripeIdealPaymentButtonV2 = ({
  cart,
  notReady,
  onPaymentSuccess,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  onPaymentSuccess?: () => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !elements || !cart) {
      setSubmitting(false)
      return
    }

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message)
      }

      const result = await stripe.confirmIdealPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            ideal: elements.getElement('idealBank')!,
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              email: cart.email,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
            },
          },
          return_url: `${window.location.origin}/order/confirmed/${cart.id}`,
        }
      )

      if (result.error) {
        throw new Error(result.error.message)
      }

      // For iDEAL, the customer will be redirected to their bank
      // The return_url will handle the success case
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred with the payment")
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="min-h-[100px]">
        <IdealBankElement
          options={{
            style: {
              base: {
                padding: "10px 12px",
                color: "#32325d",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>
      <div className="w-full">
        <Button
          disabled={!stripe || !elements || notReady || submitting}
          onClick={handlePayment}
          className="w-full"
          isLoading={submitting}
        >
          {submitting ? "Processing payment..." : "Pay with iDEAL"}
        </Button>
        {errorMessage && (
          <div className="mt-4">
            <ErrorMessage error={errorMessage} />
          </div>
        )}
      </div>
    </div>
  )
}

const StripePaymentButtonV2 = ({
  cart,
  notReady,
  onPaymentSuccess,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  onPaymentSuccess?: () => void
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !elements || !cart) {
      setSubmitting(false)
      return
    }

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message)
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: session?.data.client_secret as string,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmed/${cart.id}`,
          payment_method_data: {
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              email: cart.email,
              phone: cart.billing_address?.phone,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
            },
          },
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      await placeOrder()
      onPaymentSuccess?.()
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred with the payment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PaymentElement />
      <div className="w-full">
        <Button
          disabled={!stripe || !elements || notReady || submitting}
          onClick={handlePayment}
          className="w-full"
          isLoading={submitting}
        >
          {submitting ? "Processing payment..." : "Pay now"}
        </Button>
        {errorMessage && (
          <div className="mt-4">
            <ErrorMessage error={errorMessage} />
          </div>
        )}
      </div>
    </div>
  )
}

const PayPalPaymentButtonV2 = ({
  cart,
  notReady,
  onPaymentSuccess,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  onPaymentSuccess?: () => void
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [{ isPending }] = usePayPalScriptReducer()

  const handlePaymentSuccess = async () => {
    try {
      await placeOrder()
      onPaymentSuccess?.()
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to complete order")
    }
  }

  if (isPending) {
    return <div className="w-full text-center">Loading PayPal...</div>
  }

  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: "horizontal", height: 48 }}
        disabled={notReady}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: cart.region?.currency_code?.toUpperCase() || "USD",
                  value: (cart.total / 100).toString(),
                },
                shipping: cart.shipping_address && cart.shipping_address.country_code ? {
                  name: {
                    full_name: `${cart.shipping_address.first_name} ${cart.shipping_address.last_name}`,
                  },
                  address: {
                    address_line_1: cart.shipping_address.address_1 || "",
                    address_line_2: cart.shipping_address.address_2 || "",
                    admin_area_2: cart.shipping_address.city || "",
                    admin_area_1: cart.shipping_address.province || "",
                    postal_code: cart.shipping_address.postal_code || "",
                    country_code: cart.shipping_address.country_code,
                  },
                } : undefined,
              },
            ],
          })
        }}
        onApprove={async (data: OnApproveData, actions: OnApproveActions) => {
          const order = await actions.order?.capture()
          if (order?.status === "COMPLETED") {
            await handlePaymentSuccess()
          } else {
            setErrorMessage("Payment was not completed successfully")
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err)
          setErrorMessage("PayPal payment failed. Please try again.")
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