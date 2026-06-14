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
    const oddsField = useOpeningOdds ? 'openingOdds' : 'closingOdds'

    const where: Record<string, unknown> = {
      matchOdds: {
        some: {
          bookmakerId: bookmakerId || undefined,
          oddsType: oddsType || undefined,
          ...(minOdds != null ? { [oddsField]: { gte: minOdds } } : {}),
          ...(maxOdds != null ? { [oddsField]: { lte: maxOdds } } : {}),
        }
      },
      league: { contains: 'basketball', mode: 'insensitive' }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        matchOdds: { include: { bookmaker: true } },
        predictions: true
      },
      orderBy: { matchDate: 'desc' },
      take: 100
    })

    return NextResponse.json({ matches, total: matches.length })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
