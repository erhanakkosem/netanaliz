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

    const { bookmakerId, oddsType, minOdds, maxOdds, useOpeningOdds } = await request.json()

    if (!bookmakerId || !oddsType) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    const oddsField = useOpeningOdds ? 'openingOdds' : 'closingOdds'

    const oddsFilter: Record<string, number> = {}
    if (minOdds != null) oddsFilter.gte = minOdds
    if (maxOdds != null) oddsFilter.lte = maxOdds

    const where: Record<string, unknown> = {
      bookmakerId,
      oddsType,
    }
    if (Object.keys(oddsFilter).length > 0) {
      where[oddsField] = oddsFilter
    }

    const matchOdds = await prisma.matchOdds.findMany({
      where,
      include: {
        match: true,
        bookmaker: true,
      },
    })

    const homeWins = matchOdds.filter((o) => o.match.result === '1').length
    const draws = matchOdds.filter((o) => o.match.result === 'X').length
    const awayWins = matchOdds.filter((o) => o.match.result === '2').length
    const total = matchOdds.length

    return NextResponse.json({
      matches: matchOdds.map((o) => ({
        match: o.match,
        odds: { type: o.oddsType, opening: o.openingOdds, closing: o.closingOdds },
        bookmaker: o.bookmaker,
      })),
      statistics: {
        total,
        homeWins,
        draws,
        awayWins,
        homePercentage: total ? Math.round((homeWins / total) * 100) : 0,
        drawPercentage: total ? Math.round((draws / total) * 100) : 0,
        awayPercentage: total ? Math.round((awayWins / total) * 100) : 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
