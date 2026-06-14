import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userCount = await prisma.user.count()
    const matchCount = await prisma.match.count()
    const oddsCount = await prisma.matchOdds.count()
    const subCount = await prisma.subscription.count({ where: { isActive: true } })
    const paymentCount = await prisma.payment.count()
    const revenue = await prisma.payment.aggregate({ _sum: { amount: true } })

    return NextResponse.json({
      siteInfo: {
        userCount, matchCount, oddsCount, subCount, paymentCount,
        totalRevenue: revenue._sum.amount || 0
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
