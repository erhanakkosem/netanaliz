import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalMatches, totalUsers, activeLeagues, dataSources] = await Promise.all([
      prisma.match.count(),
      prisma.user.count(),
      prisma.match.groupBy({ by: ['league'], _count: { league: true } }),
      prisma.bookmaker.count({ where: { isActive: true } }),
    ])

    return NextResponse.json({
      totalMatches,
      totalUsers,
      activeLeagues: activeLeagues.length,
      dataSources,
    })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
