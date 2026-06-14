import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const coupons = await prisma.coupon.findMany({
      where: { userId: session.user.id },
      include: {
        matches: {
          include: { match: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ coupons })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { title, matches } = await request.json()

    if (!title || !matches || !Array.isArray(matches) || matches.length === 0) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    interface CouponMatchInput {
      matchId: string
      selection: string
      odds: number
    }

    const totalOdds = matches.reduce((sum: number, m: CouponMatchInput) => sum * m.odds, 1)

    const coupon = await prisma.coupon.create({
      data: {
        userId: session.user.id,
        title,
        odds: Math.round(totalOdds * 100) / 100,
        matches: {
          create: matches.map((m: CouponMatchInput) => ({
            matchId: m.matchId,
            selection: m.selection,
            odds: m.odds,
          })),
        },
      },
      include: {
        matches: {
          include: { match: true },
        },
      },
    })

    return NextResponse.json({ coupon }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
