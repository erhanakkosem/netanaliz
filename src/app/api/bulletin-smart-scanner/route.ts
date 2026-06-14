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

    const { filterId, date } = await request.json()

    if (!filterId) {
      return NextResponse.json({ error: 'Filter ID required' }, { status: 400 })
    }

    const filter = await prisma.smartFilter.findFirst({
      where: { id: filterId, userId: session.user.id }
    })

    if (!filter) {
      return NextResponse.json({ error: 'Filter not found' }, { status: 404 })
    }

    const scanDate = date ? new Date(date) : new Date()
    const endDate = new Date(scanDate)
    endDate.setDate(endDate.getDate() + 1)

    const matches = await prisma.match.findMany({
      where: {
        matchDate: { gte: scanDate, lt: endDate },
        status: 'SCHEDULED'
      },
      include: {
        matchOdds: {
          where: { oddsType: filter.oddsType },
          include: { bookmaker: true }
        }
      },
      orderBy: { matchDate: 'asc' }
    })

    const scan = await prisma.bulletinScan.create({
      data: {
        userId: session.user.id,
        filterId,
        date: scanDate,
        results: JSON.stringify(matches.map(m => m.id))
      }
    })

    return NextResponse.json({ matches, scanId: scan.id })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const scans = await prisma.bulletinScan.findMany({
      where: { userId: session.user.id },
      include: { filter: true },
      orderBy: { date: 'desc' },
      take: 20
    })

    return NextResponse.json({ scans })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
