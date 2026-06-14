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
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')))

    const iddaaBookmaker = await prisma.bookmaker.findUnique({ where: { code: 'OA-7' } })
    if (!iddaaBookmaker) {
      return NextResponse.json({ error: 'İddaa bookmaker bulunamadı' }, { status: 404 })
    }

    const where: Record<string, unknown> = {
      matchOdds: { some: { bookmakerId: iddaaBookmaker.id } },
    }

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
            where: { bookmakerId: iddaaBookmaker.id },
            include: { bookmaker: true },
          },
        },
        orderBy: { matchDate: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.match.count({ where }),
    ])

    return NextResponse.json({
      matches,
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
