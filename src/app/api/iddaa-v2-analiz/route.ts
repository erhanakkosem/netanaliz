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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50')))

    const where: Record<string, unknown> = {
      matchOdds: { some: { bookmaker: { code: 'OA-7' } } }
    }

    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      where.matchDate = { gte: start, lt: end }
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          matchOdds: {
            where: { bookmaker: { code: 'OA-7' } },
            include: { bookmaker: true }
          },
          predictions: true
        },
        orderBy: { matchDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.match.count({ where })
    ])

    return NextResponse.json({ matches, total, page, pageSize })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
