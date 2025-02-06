"use client"
import React from "react"
import { HttpTypes } from "@medusajs/types"
import { listCartPaymentMethods } from "@lib/data/payment"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Email from "@modules/checkout/components/email"
type CheckoutFormProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode: string
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, customer, countryCode }) => {
  const [shippingMethods, setShippingMethods] = React.useState<HttpTypes.StoreCartShippingOption[] | null>(null)
  const [paymentMethods, setPaymentMethods] = React.useState<any[] | null>(null) // Replace `any` with the correct type for payment methods
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!cart) return
    const fetchData = async () => {
      try {
        const shippingOptions = await listCartShippingMethods(cart.id)
        console.log("shippingOptions", shippingOptions)
        const paymentOptions = await listCartPaymentMethods(cart.region?.id ?? "")
        console.log("paymentOptions", paymentOptions)
        if (!shippingOptions) {
          throw new Error("Failed to fetch shipping or payment methods.")
        }

        setShippingMethods(shippingOptions)
        setPaymentMethods(paymentOptions)
      } catch (err: any) {
        console.error("Error fetching checkout data:", err)
        setError("Failed to load checkout options. Please try again.")
      }
    }
    fetchData()
  }, [cart])

  if (!cart) {
    return null
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!shippingMethods) {
    return <p>Loading checkout options...</p>
  }


  return (
    <div className="flex flex-col gap-4">
      <Email cart={cart} customer={customer} countryCode={countryCode} />
      <Addresses cart={cart} customer={customer} />
      {shippingMethods ? <Shipping cart={cart} availableShippingMethods={shippingMethods} /> : <>NOT</>}
      {paymentMethods ? <Payment cart={cart} availablePaymentMethods={paymentMethods} /> : <>NOT</>}
      <Review cart={cart} />
    </div>
  )
}

export default CheckoutForm
