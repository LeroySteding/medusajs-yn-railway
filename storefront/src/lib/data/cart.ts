"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { omit } from "lodash"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { getAuthHeaders, getCartId, removeCartId, setCartId } from "./cookies"
import { getProductsById } from "./products"
import { getRegion } from "./regions"
import { z } from "zod"
import { logger, logOperation } from "@lib/util/logger"

export async function setEmail(currentState: unknown, formData: FormData) {
  return logOperation('setEmail', async () => {
    try {
      logger.debug({ functionName: 'setEmail', action: 'Validating input' })
      
      if (!formData) {
        throw new Error("No form data found when setting addresses")
      }
      const cartId = await getCartId()
      if (!cartId) {
        throw new Error("No existing cart found when setting addresses")
      }

      const countryCode = z.string().min(2).safeParse(formData.get("country_code"))
      if (!countryCode.success) {
        logger.warn({ functionName: 'setEmail', action: 'Invalid country code', data: formData.get("country_code") })
        return "Invalid country code"
      }

      const email = z.string().min(3).email().safeParse(formData.get("email"))
      if (!email.success) {
        logger.warn({ functionName: 'setEmail', action: 'Invalid email', data: formData.get("email") })
        return "Invalid email"
      }

      await updateCart({ email: email.data })
      
      logger.info({ functionName: 'setEmail', action: 'Email set successfully', data: { email: email.data } })
      const countryCodeStr = countryCode.data.toString()
      redirect(`/${countryCodeStr}/checkout?step=delivery`)
    } catch (e: any) {
      logger.error({ functionName: 'setEmail', error: e })
      return e.message
    }
  })
}

export async function retrieveCart() {
  return logOperation('retrieveCart', async () => {
    const cartId = await getCartId()
    const headers = await getAuthHeaders()
    logger.debug({ functionName: 'retrieveCart', action: 'Getting cart', data: { cartId } })

    if (!cartId) {
      logger.info({ functionName: 'retrieveCart', action: 'No cart ID found' })
      return null
    }

    return await sdk.store.cart
      .retrieve(cartId, {}, { next: { tags: ["cart"] }, ...headers })
      .then(({ cart }) => {
        logger.debug({ functionName: 'retrieveCart', action: 'Cart retrieved', data: { cartId: cart.id } })
        return cart
      })
      .catch((error) => {
        logger.error({ functionName: 'retrieveCart', error })
        return null
      })
  })
}

export async function getOrSetCart(countryCode: string) {
  return logOperation('getOrSetCart', async () => {
    logger.debug({ functionName: 'getOrSetCart', action: 'Started', data: { countryCode } })
    
    let cart = await retrieveCart()
    const region = await getRegion(countryCode)

    if (!region) {
      const error = new Error(`Region not found for country code: ${countryCode}`)
      logger.error({ functionName: 'getOrSetCart', error })
      throw error
    }

    if (!cart) {
      logger.debug({ functionName: 'getOrSetCart', action: 'Creating new cart' })
      const cartResp = await sdk.store.cart.create({ region_id: region.id })
      cart = cartResp.cart
      await setCartId(cart.id)
      revalidateTag("cart")
      logger.info({ functionName: 'getOrSetCart', action: 'New cart created', data: { cartId: cart.id } })
    }

    if (cart && cart?.region_id !== region.id) {
      logger.debug({ functionName: 'getOrSetCart', action: 'Updating cart region', data: { 
        oldRegionId: cart.region_id,
        newRegionId: region.id 
      }})
      
      const headers = await getAuthHeaders()
      await sdk.store.cart.update(
        cart.id,
        { region_id: region.id },
        {},
        headers
      )
      revalidateTag("cart")
    }

    return cart
  })
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  return logOperation('updateCart', async () => {
    const cartId = await getCartId()
    const headers = await getAuthHeaders()
    logger.debug({ functionName: 'updateCart', action: 'Updating cart', data: { cartId, updateData: data } })

    if (!cartId) {
      const error = new Error("No existing cart found, please create one before updating")
      logger.error({ functionName: 'updateCart', error })
      throw error
    }

    return sdk.store.cart
      .update(cartId, data, {}, headers)
      .then(({ cart }) => {
        logger.debug({ functionName: 'updateCart', action: 'Cart updated successfully', data: { cartId: cart.id } })
        revalidateTag("cart")
        return cart
      })
      .catch((error) => {
        logger.error({ functionName: 'updateCart', error })
        throw medusaError(error)
      })
  })
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  return logOperation('addToCart', async () => {
    logger.debug({ 
      functionName: 'addToCart', 
      action: 'Started', 
      data: { variantId, quantity, countryCode } 
    })

    if (!variantId) {
      const error = new Error("Missing variant ID when adding to cart")
      logger.error({ functionName: 'addToCart', error })
      throw error
    }

    const cart = await getOrSetCart(countryCode)
    if (!cart) {
      const error = new Error("Error retrieving or creating cart")
      logger.error({ functionName: 'addToCart', error })
      throw error
    }

    const headers = await getAuthHeaders()
    await sdk.store.cart
      .createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        },
        {},
        headers
      )
      .then(() => {
        logger.debug({ functionName: 'addToCart', action: 'Item added successfully' })
        revalidateTag("cart")
      })
      .catch((error) => {
        logger.error({ functionName: 'addToCart', error })
        throw medusaError(error)
      })
  })
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = await getAuthHeaders()
  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(() => {
      revalidateTag("cart")
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = await getAuthHeaders()
  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(() => {
      revalidateTag("cart")
    })
    .catch(medusaError)
  revalidateTag("cart")
}

export async function enrichLineItems(
  lineItems:
    | HttpTypes.StoreCartLineItem[]
    | HttpTypes.StoreOrderLineItem[]
    | null,
  regionId: string
) {
  if (!lineItems) return []

  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    regionId: regionId,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)
  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p: any) => p.id === item.product_id)
    const variant = product?.variants?.find(
      (v: any) => v.id === item.variant_id
    )

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, "variants"),
      },
    }
  }) as HttpTypes.StoreCartLineItem[]

  return enrichedItems
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  if (!cartId || !shippingMethodId) {
    throw new Error("Missing required parameters: cartId or shippingMethodId")
  }

  try {
    const response = await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: shippingMethodId },
      {},
      await getAuthHeaders()
    )
    
    await revalidateTag("cart")
    return response
  } catch (error: any) {
    // Add more specific error handling
    if (error.response) {
      throw new Error(`Server error: ${error.response.data?.message || error.response.status}`)
    } else if (error.request) {
      throw new Error("No response received from server. Please check your connection.")
    } else {
      throw new Error(`Error setting shipping method: ${error.message}`)
    }
  }
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: {
    provider_id: string
    context?: Record<string, unknown>
  }
) {
  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, await getAuthHeaders())
    .then((resp) => {
      revalidateTag("cart")
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found")
  }

  await updateCart({ promo_codes: codes })
    .then(() => {
      revalidateTag("cart")
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

export async function placeOrder() {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = await getAuthHeaders()
  const cartRes = await sdk.store.cart
    .complete(cartId, {}, headers)
    .then((cartRes) => {
      revalidateTag("cart")
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()
    removeCartId()
    redirect(`/${countryCode}/order/confirmed/${cartRes?.order.id}`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
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
