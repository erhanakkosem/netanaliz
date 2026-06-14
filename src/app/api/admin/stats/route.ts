import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      totalUsers, activeSubs, totalMatches, totalOdds,
      totalPredictions, totalRevenue, totalCoupons,
      recentMatches, topUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { isActive: true, endDate: { gte: new Date() } } }),
      prisma.match.count(),
      prisma.matchOdds.count(),
      prisma.prediction.count(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.coupon.count(),
      prisma.match.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { matchOdds: { take: 1 } } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } })
    ])

    const matchesByLeague = await prisma.match.groupBy({
      by: ['league'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    const revenueByMonth = await prisma.payment.findMany({
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({
      stats: {
        totalUsers, activeSubs, totalMatches, totalOdds,
        totalPredictions, totalRevenue: totalRevenue._sum.amount || 0,
        totalCoupons
      },
      recentMatches, topUsers, matchesByLeague, revenueByMonth
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
