import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { enrichLineItems, retrieveCart } from '@lib/data/cart-two'
import { retrieveCustomer } from '@lib/data/customer'
import Wrapper from '@modules/checkout/components/payment-wrapper'
import CheckoutForm from '@modules/checkout/templates/checkout-form/checkout-form-two'
import CheckoutSummary from '@modules/checkout/templates/checkout-summary/checkout-summary-two'

export const metadata: Metadata = {
  title: 'Checkout',
}

const fetchCart = async () => {
  const cart = await retrieveCart()
  if (!cart) {
    return notFound()
  }

  if (cart?.items?.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id || 'eu')
    cart.items = enrichedItems
  }

  return cart
}

export default async function Checkout(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const cart = await fetchCart()
  const customer = await retrieveCustomer()

  return (
    <div className="flex flex-col mx-20">
      <Wrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
        <CheckoutSummary cart={cart} searchParams={searchParams} />
      </Wrapper>
    </div>
  )
}