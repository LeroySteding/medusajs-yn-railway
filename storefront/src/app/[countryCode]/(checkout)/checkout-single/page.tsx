import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HttpTypes } from "@medusajs/types"

import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import { listCartShippingMethods } from '@lib/data/fulfillment'
import { listCartPaymentMethods } from '@lib/data/payment'
import SingleCheckoutForm from '@modules/checkout/templates/single-checkout-form'
import SingleCheckoutWrapper from '@modules/checkout/components/single-checkout-wrapper'

export const metadata: Metadata = {
  title: 'Checkout',
}

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  return cart
}

export default async function SingleCheckout() {
  const cart = await fetchCart()
  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '')

  if (!cart || !shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="min-h-[100vh] bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <SingleCheckoutWrapper cart={cart}>
          <SingleCheckoutForm 
            cart={cart} 
            customer={customer} 
            availableShippingMethods={shippingMethods}
            availablePaymentMethods={paymentMethods}
          />
        </SingleCheckoutWrapper>
      </div>
    </div>
  )
} 