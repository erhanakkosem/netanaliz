import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24' as any,
  typescript: true,
})

export const PRICE_IDS: Record<string, string> = {
  JET: process.env.STRIPE_JET_PRICE_ID || '',
  STANDARD: process.env.STRIPE_STANDARD_PRICE_ID || '',
  PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  ELITE: process.env.STRIPE_ELITE_PRICE_ID || '',
}

export function getPriceId(packageType: string): string {
  return PRICE_IDS[packageType] || ''
}

export function getPackageFromPriceId(priceId: string): string | null {
  const entry = Object.entries(PRICE_IDS).find(([, id]) => id === priceId)
  return entry ? entry[0] : null
}
