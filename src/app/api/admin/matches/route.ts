import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, parseInt(searchParams.get('pageSize') || '20'))
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { homeTeam: { contains: search, mode: 'insensitive' } },
        { awayTeam: { contains: search, mode: 'insensitive' } },
        { league: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (status) where.status = status

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          matchOdds: { include: { bookmaker: true } },
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { homeTeam, awayTeam, league, matchDate, status, homeScore, awayScore, result } = body

    if (!homeTeam || !awayTeam || !league || !matchDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const match = await prisma.match.create({
      data: { homeTeam, awayTeam, league, matchDate: new Date(matchDate), status: status || 'SCHEDULED', homeScore, awayScore, result }
    })

    return NextResponse.json({ match })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...data } = body

    if (!id) return NextResponse.json({ error: 'Match ID required' }, { status: 400 })

    if (data.matchDate) data.matchDate = new Date(data.matchDate)

    const match = await prisma.match.update({
      where: { id },
      data
    })

    return NextResponse.json({ match })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
