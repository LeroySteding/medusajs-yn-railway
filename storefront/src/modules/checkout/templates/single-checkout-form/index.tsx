"use client"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import Input from "@modules/common/components/input"
import CountrySelect from "@modules/checkout/components/country-select"
import { placeOrder } from "@lib/data/cart"
import { setShippingMethod } from "@lib/data/cart"
import { StripeContext } from "@modules/checkout/components/payment-wrapper/stripe-wrapper"
import ErrorMessage from "@modules/checkout/components/error-message"

type SingleCheckoutFormProps = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
  availablePaymentMethods: any[]
}

const SingleCheckoutForm = ({
  cart,
  customer,
  availableShippingMethods,
  availablePaymentMethods,
}: SingleCheckoutFormProps) => {
  const [formData, setFormData] = useState({
    email: cart?.email || customer?.email || "",
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
  })

  const [selectedShippingOption, setSelectedShippingOption] = useState(
    availableShippingMethods[0]?.id || ""
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const stripe = useStripe()
  const elements = useElements()
  const stripeReady = useContext(StripeContext)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleShippingMethodChange = async (methodId: string) => {
    try {
      setSelectedShippingOption(methodId)
      await setShippingMethod({
        cartId: cart.id,
        shippingMethodId: methodId,
      })
    } catch (err: any) {
      setError(err.message || "Error setting shipping method")
    }
  }

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!stripe || !elements) {
      setSubmitting(false)
      return
    }

    const card = elements.getElement(CardElement)
    if (!card) {
      setError("Could not find card element")
      setSubmitting(false)
      return
    }

    try {
      const session = cart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending"
      )

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: `${formData["shipping_address.first_name"]} ${formData["shipping_address.last_name"]}`,
              email: formData.email,
              address: {
                city: formData["shipping_address.city"],
                country: formData["shipping_address.country_code"],
                line1: formData["shipping_address.address_1"],
                postal_code: formData["shipping_address.postal_code"],
                state: formData["shipping_address.province"],
              },
              phone: formData["shipping_address.phone"],
            },
          },
        }
      )

      if (paymentError) {
        setError(paymentError.message || "An error occurred with the payment")
        setSubmitting(false)
        return
      }

      if (paymentIntent.status === "requires_capture" || paymentIntent.status === "succeeded") {
        await placeOrder()
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during checkout")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <div className="space-y-8">
        {/* Shipping Address Section */}
        <div>
          <Heading level="h2" className="text-2xl font-bold mb-6">
            Shipping Address
          </Heading>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="shipping_address.first_name"
              value={formData["shipping_address.first_name"]}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="shipping_address.last_name"
              value={formData["shipping_address.last_name"]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Address"
              name="shipping_address.address_1"
              value={formData["shipping_address.address_1"]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="City"
              name="shipping_address.city"
              value={formData["shipping_address.city"]}
              onChange={handleChange}
              required
            />
            <Input
              label="Postal Code"
              name="shipping_address.postal_code"
              value={formData["shipping_address.postal_code"]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <CountrySelect
              name="shipping_address.country_code"
              region={cart?.region}
              value={formData["shipping_address.country_code"]}
              onChange={handleChange}
              required
            />
            <Input
              label="State/Province"
              name="shipping_address.province"
              value={formData["shipping_address.province"]}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Phone"
              name="shipping_address.phone"
              value={formData["shipping_address.phone"]}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Shipping Method Section */}
        <div>
          <Heading level="h2" className="text-2xl font-bold mb-6">
            Shipping Method
          </Heading>
          <div className="space-y-4">
            {availableShippingMethods.map((method) => (
              <label
                key={method.id}
                className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-gray-400"
              >
                <input
                  type="radio"
                  name="shipping_method"
                  value={method.id}
                  checked={selectedShippingOption === method.id}
                  onChange={(e) => handleShippingMethodChange(e.target.value)}
                  className="h-4 w-4"
                  required
                />
                <div>
                  <Text className="font-medium">{method.name}</Text>
                  <Text className="text-gray-500">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: cart.region?.currency_code || "USD",
                    }).format(method.amount / 100)}
                  </Text>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <Heading level="h2" className="text-2xl font-bold mb-6">
            Payment
          </Heading>
          {stripeReady && (
            <div className="space-y-4">
              <Text className="text-gray-700">Enter your card details:</Text>
              <CardElement
                options={useOptions}
                onChange={(e) => {
                  setError(e.error?.message || null)
                  setCardComplete(e.complete)
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <ErrorMessage error={error} />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!cardComplete || submitting}
          isLoading={submitting}
        >
          Place Order
        </Button>
      </div>
    </form>
  )
}

export default SingleCheckoutForm 