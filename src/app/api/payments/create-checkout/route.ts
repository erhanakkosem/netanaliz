import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, getPriceId } from '@/lib/stripe-server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageType } = await req.json()
    
    const validPackages = ['JET', 'STANDARD', 'PREMIUM', 'ELITE']
    if (!validPackages.includes(packageType)) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    const priceId = getPriceId(packageType)
    if (!priceId) {
      return NextResponse.json({ error: 'Payment not configured for this package' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId: user.id, packageType },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
