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
    const q = searchParams.get('q') || ''
    const date = searchParams.get('date')

    const where: Record<string, unknown> = { status: 'SCHEDULED' }

    if (q) {
      where.OR = [
        { homeTeam: { contains: q, mode: 'insensitive' } },
        { awayTeam: { contains: q, mode: 'insensitive' } },
        { league: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      where.matchDate = { gte: start, lt: end }
    }

    const matches = await prisma.match.findMany({
      where,
      orderBy: { matchDate: 'asc' },
      take: 200
    })

    return NextResponse.json({ matches })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
