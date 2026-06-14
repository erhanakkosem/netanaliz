import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { prisma } from '@/lib/prisma'
import { getPackageFromPriceId } from '@/lib/stripe-server'

export async function POST(req: Request) {
  try {
    const buf = await req.text()
    const sig = req.headers.get('stripe-signature') || ''
    
    let event
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as any
      const userId = checkoutSession.metadata?.userId
      const packageType = checkoutSession.metadata?.packageType

      if (userId && packageType) {
        const packageDurations: Record<string, number> = {
          JET: 15, STANDARD: 30, PREMIUM: 60, ELITE: 90
        }
        const days = packageDurations[packageType] || 30
        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + days)

        const payment = await prisma.payment.create({
          data: {
            userId,
            amount: checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0,
            package: packageType,
            status: 'COMPLETED',
          }
        })

        await prisma.subscription.create({
          data: {
            userId,
            packageType,
            startDate,
            endDate,
            isActive: true,
            paymentId: payment.id,
          }
        })

        await prisma.user.update({
          where: { id: userId },
          data: { role: packageType === 'ELITE' || packageType === 'PREMIUM' ? 'PREMIUM' : packageType === 'STANDARD' ? 'STANDARD' : 'FREE' }
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
