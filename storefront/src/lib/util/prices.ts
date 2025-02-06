import { HttpTypes } from "@medusajs/types"

type FormatAmountParams = {
  amount: number
  region: HttpTypes.StoreRegion
  includeTaxes?: boolean
}

export const formatAmount = ({
  amount,
  region,
  includeTaxes = true,
}: FormatAmountParams): string => {
  const locale = region?.currency_code || "USD"

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: locale.toUpperCase(),
  }).format(amount / 100)
} 