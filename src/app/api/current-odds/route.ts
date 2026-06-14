import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    const bookmakerId = searchParams.get('bookmakerId')
    const oddsType = searchParams.get('oddsType')

    const where: Record<string, unknown> = {}
    if (matchId) where.matchId = matchId
    if (bookmakerId) where.bookmakerId = bookmakerId
    if (oddsType) where.oddsType = oddsType

    const odds = await prisma.matchOdds.findMany({
      where,
      include: {
        match: true,
        bookmaker: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ odds })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
