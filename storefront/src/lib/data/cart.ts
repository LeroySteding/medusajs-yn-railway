"use server"


import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { enrichLineItems } from "@lib/util/enrich-line-items"
import {
  getAuthHeaders,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"


export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: unknown
  quantity: unknown
}) {
  if (typeof lineId !== "string") {
    throw new Error("Missing lineItem ID when updating line item")
  }

  if (
    typeof quantity !== "number" ||
    quantity < 1 ||
    !Number.isSafeInteger(quantity)
  ) {
    throw new Error("Missing quantity when updating line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, await getAuthHeaders())
    .then(() => {
      revalidateTag("cart")
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: unknown) {
  if (typeof lineId !== "string") {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, await getAuthHeaders())
    .then(() => {
      revalidateTag("cart")
    })
    .catch(medusaError)
  revalidateTag("cart")
}


export async function setEmail(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }
  } catch (e: any) {
    return e.message
  }

  const countryCode = z.string().min(2).safeParse(formData.get("country_code"))

  if (!countryCode.success) {
    return "Invalid country code"
  }

  const email = z.string().min(3).email().safeParse(formData.get("email"))

  if (!email.success) {
    return "Invalid email"
  }

  await updateCart({ email: email.data })

  redirect(`/${countryCode.data}/checkout?step=delivery`)
}

const addressesFormSchema = z
  .object({
    shipping_address: z.object({
      first_name: z.string(),
      last_name: z.string(),
      address_1: z.string(),
      company: z.string(),
      postal_code: z.string(),
      city: z.string(),
      country_code: z.string(),
      province: z.string(),
      phone: z.string(),
    }),
  })
  .and(
    z.discriminatedUnion("same_as_billing", [
      z.object({
        same_as_billing: z.literal("on"),
      }),
      z.object({
        same_as_billing: z.literal("off").optional(),
        billing_address: z.object({
          first_name: z.string(),
          last_name: z.string(),
          address_1: z.string(),
          company: z.string(),
          postal_code: z.string(),
          city: z.string(),
          country_code: z.string(),
          province: z.string(),
          phone: z.string(),
        }),
      }),
    ])
  )

export async function setAddresses(currentState: unknown, formData: FormData) {
  
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const validatedData = addressesFormSchema.parse({
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      same_as_billing: formData.get("same_as_billing"),
      billing_address: {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      },
    })

    await updateCart({
      shipping_address: validatedData.shipping_address,
      billing_address:
        validatedData.same_as_billing === "on"
          ? validatedData.shipping_address
          : validatedData.billing_address,
    })
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=shipping`
  )
}

export async function placeOrder() {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when placing an order")
  }

  const cartRes = await sdk.store.cart
    .complete(cartId, {}, await getAuthHeaders())
    .then((cartRes) => {
      revalidateTag("cart")
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()
    await removeCartId()
    redirect(`/${countryCode}/order/confirmed/${cartRes?.order.id}`)
  }

  return cartRes.cart
}

/**
 * Updates the countryCode param and revalidate the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  if (typeof countryCode !== "string") {
    throw new Error("Invalid country code")
  }

  if (typeof currentPath !== "string") {
    throw new Error("Invalid current path")
  }

  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    revalidateTag("cart")
  }

  revalidateTag("regions")
  revalidateTag("products")

  redirect(`/${countryCode}${currentPath}`)
}


/** Utility to revalidate cart and log success */
const revalidateAndLog = async (tag: string, action: string) => {
  try {
    await revalidateTag(tag)
    console.log(`${action} successful.`)
  } catch (error) {
    console.error(`${action} failed:`, error)
  }
}

/** Retrieve cart details */
export async function retrieveCart() {
  const cartId = await getCartId()
  if (!cartId) return null

  try {
    const { cart } = await sdk.store.cart.retrieve(
      cartId,
      {},
      { next: { tags: ["cart"] }, ...(await getAuthHeaders()) }
    )
    if (cart?.items?.length && cart.region_id) {
      cart.items = await enrichLineItems(cart.items, cart.region_id)
    }
    return cart
  } catch {
    return null
  }
}

/** Get cart quantity */
export async function getCartQuantity() {
  const cart = await retrieveCart()
  return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
}

/** Get or create a cart */
export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)
  if (!region) throw new Error(`Region not found for country code: ${countryCode}`)

  let cart = await retrieveCart()
  if (!cart) {
    cart = (await sdk.store.cart.create(
      { region_id: region.id },
      {},
      await getAuthHeaders()
    )).cart
    await setCartId(cart.id)
    await revalidateAndLog("cart", "Cart creation")
  } else if (cart.region_id !== region.id) {
    await sdk.store.cart.update(
      cart.id,
      { region_id: region.id },
      {},
      await getAuthHeaders()
    )
    await revalidateAndLog("cart", "Region update")
  }

  return cart
}

/** Update cart data */
export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found to update")

  try {
    const { cart } = await sdk.store.cart.update(
      cartId,
      data,
      {},
      await getAuthHeaders()
    )
    await revalidateAndLog("cart", "Cart update")
    return cart
  } catch (error) {
    throw medusaError(error)
  }
}

/** Add item to cart */
export async function addToCart({
                                  variantId,
                                  quantity,
                                  countryCode,
                                }: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId || !quantity || quantity < 1 || !countryCode) {
    throw new Error("Invalid input when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)
  if (!cart) throw new Error("Error retrieving or creating cart")

  await sdk.store.cart.createLineItem(
    cart.id,
    { variant_id: variantId, quantity },
    {},
    await getAuthHeaders()
  )
  await revalidateAndLog("cart", "Line item addition")
}

/** Set shipping method */
export async function setShippingMethod({ cartId, shippingMethodId }: { cartId: string; shippingMethodId: string }) {
  if (!cartId || !shippingMethodId) {
    throw new Error("Invalid shipping method or cart ID")
  }

  try {
    const response = await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: shippingMethodId },
      {},  // Empty options object since 'next' is not supported
      await getAuthHeaders()
    )

    await revalidateTag("cart")
    return response

  } catch (error: any) {
    if (error.message?.includes("CORS")) {
      throw new Error("Unable to connect to server. Please check your connection.")
    }
    throw error
  }
}

/** Initiate payment session */
export async function initiatePaymentSession(providerId: string) {
  if (!providerId) throw new Error("Invalid payment provider")

  const cart = await retrieveCart()
  if (!cart) throw new Error("Can't initiate payment without cart")
    
  try {
    const resp = await sdk.store.payment.initiatePaymentSession(
      cart,
      { provider_id: providerId },
      {},
      await getAuthHeaders()
    )
    await revalidateAndLog("cart", "Payment session initiation")
    return resp
  } catch (error) {
    console.error("Error initiating payment session:", error)
    throw medusaError(error)
  }
}

/** Apply promotions */
export async function applyPromotions(codes: string[]) {
  const validatedData = z.array(z.string()).safeParse(codes)
  if (!validatedData.success) throw new Error("Invalid promo codes")

  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found to apply promotions")

  await updateCart({ promo_codes: validatedData.data })
  await revalidateAndLog("cart", "Promotions applied")
}
