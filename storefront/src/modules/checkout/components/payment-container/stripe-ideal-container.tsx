'use client'

import { Text } from "@medusajs/ui"
import { IdealBankElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useContext, useMemo, useState } from "react"
import PaymentContainer from "."
import { StripeContext } from "../payment-wrapper/stripe-wrapper"
import { Button } from "@/components/ui/button"
import ErrorMessage from "../error-message"
import { Elements } from "@stripe/react-stripe-js"

type StripeIdealContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  disabled?: boolean
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
  cart: any
}

const StripeIdealContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setError,
  setCardComplete,
  cart,
}: StripeIdealContainerProps) => {
  const stripeReady = useContext(StripeContext)
  const [submitting, setSubmitting] = useState(false)

  // Early return if not ready or no cart
  if (!stripeReady || !cart) {
    return (
      <PaymentContainer
        paymentProviderId={paymentProviderId}
        selectedPaymentOptionId={selectedPaymentOptionId}
        paymentInfoMap={paymentInfoMap}
        disabled={disabled}
      >
        <div className="my-4">Loading...</div>
      </PaymentContainer>
    )
  }

  // Only initialize Stripe hooks when context is ready
  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s: any) => s.status === "pending"
  )

  const handlePayment = async () => {
    setSubmitting(true)
    setError(null)

    if (!stripe || !elements) {
      setSubmitting(false)
      return
    }

    try {
      const { error } = await stripe.confirmIdealPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            ideal: elements.getElement('idealBank')!,
            billing_details: {
              name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`,
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
          return_url: `${window.location.origin}/${cart.region?.country_code?.toLowerCase()}/order/confirmed?payment_intent=${session?.data.payment_intent_id}`,
        }
      )

      if (error) {
        setError(error.message || "An error occurred with the payment")
        setSubmitting(false)
      }
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message || "An error occurred with the payment")
      setSubmitting(false)
    }
  }

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && stripeReady && (
        <div className="my-4 space-y-4">
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Select your bank:
          </Text>
          <IdealBankElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
            onChange={(e) => {
              setCardComplete(e.complete)
              setError(e.error?.message || null)
            }}
          />
          <Button
            disabled={disabled || submitting}
            onClick={handlePayment}
            className="w-full mt-4"
          >
            {submitting ? "Processing..." : "Pay with iDEAL"}
          </Button>
          <ErrorMessage error={null} />
        </div>
      )}
    </PaymentContainer>
  )
}

export default StripeIdealContainer 