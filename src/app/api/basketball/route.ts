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
    const date = searchParams.get('date')
    const league = searchParams.get('league')
    const bookmaker = searchParams.get('bookmaker')
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')))

    const where: Record<string, unknown> = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      where.matchDate = { gte: startDate, lt: endDate }
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      where.matchDate = { gte: today, lt: tomorrow }
    }

    if (league) where.league = league

    if (search) {
      where.OR = [
        { homeTeam: { contains: search } },
        { awayTeam: { contains: search } },
        { league: { contains: search } },
      ]
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          matchOdds: {
            include: { bookmaker: true },
            ...(bookmaker ? { where: { bookmaker: { code: bookmaker } } } : {}),
          },
        },
        orderBy: { matchDate: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.match.count({ where }),
    ])

    const grouped = matches.map((match) => ({
      ...match,
      odds: Object.values(
        match.matchOdds.reduce(
          (acc, od) => {
            const key = od.bookmaker.code
            if (!acc[key]) {
              acc[key] = { bookmaker: od.bookmaker, odds: [] }
            }
            acc[key].odds.push({
              type: od.oddsType,
              opening: od.openingOdds,
              closing: od.closingOdds,
            })
            return acc
          },
          {} as Record<string, { bookmaker: (typeof match.matchOdds)[number]['bookmaker']; odds: { type: string; opening: number | null; closing: number | null }[] }>,
        ),
      ),
    }))

    return NextResponse.json({
      matches: grouped,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
