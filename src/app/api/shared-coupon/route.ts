import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { title, selections } = await request.json()
    if (!title || !selections?.length) {
      return NextResponse.json({ error: 'Title and selections required' }, { status: 400 })
    }

    const totalOdds = selections.reduce((sum: number, s: { odds: number }) => sum * s.odds, 1)

    const coupon = await prisma.coupon.create({
      data: {
        userId: session.user.id,
        title,
        odds: totalOdds,
        matches: {
          create: selections.map((s: { matchId: string; selection: string; odds: number }) => ({
            matchId: s.matchId,
            selection: s.selection,
            odds: s.odds
          }))
        }
      },
      include: { matches: { include: { match: true } } }
    })

    return NextResponse.json({ coupon })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const coupons = await prisma.coupon.findMany({
      where: { userId: session.user.id },
      include: { matches: { include: { match: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ coupons })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
