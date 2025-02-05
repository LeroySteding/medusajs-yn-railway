'use client'

import { Button } from "@/components/ui/button"
import { HttpTypes } from "@medusajs/types"

import { useStripe, useElements } from "@stripe/react-stripe-js"
import { useState } from "react"
import ErrorMessage from "../error-message"

interface StripeIdealPaymentButtonProps {
  cart: HttpTypes.StoreCart
  notReady: boolean
}

const StripeIdealPaymentButton = ({
  cart,
  notReady,
}: StripeIdealPaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !cart) {
      setSubmitting(false)
      return
    }

    try {
      // Confirm iDEAL payment and handle redirect
      const { error, paymentIntent } = await stripe.confirmIdealPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            ideal: elements?.getElement('idealBank')!,
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
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
          return_url: `${window.location.origin}/order/confirmed?cart_id=${cart.id}`,
        }
      )

      if (error) {
        setErrorMessage(error.message || "An error occurred with the payment")
        setSubmitting(false)
        return
      }

      // The customer will be redirected to their bank's website to complete the payment
      // The return_url will handle the rest of the order flow after payment completion

    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred with the payment")
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={disabled || notReady || submitting}
        onClick={handlePayment}
        className="w-full"
      >
        {submitting ? "Processing..." : "Pay with iDEAL"}
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

export default StripeIdealPaymentButton 