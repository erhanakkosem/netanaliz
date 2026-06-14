import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const draws = await prisma.match.findMany({
      where: { result: 'MSX' },
      include: {
        matchOdds: { include: { bookmaker: true } },
        predictions: true
      },
      orderBy: { matchDate: 'desc' },
      take: 50
    })

    return NextResponse.json({ draws })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
