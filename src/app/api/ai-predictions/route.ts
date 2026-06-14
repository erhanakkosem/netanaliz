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

    const matchWhere: Record<string, unknown> = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      matchWhere.matchDate = { gte: startDate, lt: endDate }
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      matchWhere.matchDate = { gte: today, lt: tomorrow }
    }

    const predictions = await prisma.prediction.findMany({
      where: { match: matchWhere },
      include: { match: true },
      orderBy: { createdAt: 'desc' },
    })

    const total = predictions.length
    const winCount = predictions.filter((p) => p.match.result === p.prediction).length
    const riskCount = predictions.filter(
      (p) => p.confidence !== null && p.confidence < 50,
    ).length
    const averageConfidence = total
      ? Math.round(
          predictions.reduce((sum, p) => sum + (p.confidence ?? 0), 0) / total,
        )
      : 0

    return NextResponse.json({
      predictions,
      statistics: {
        total,
        winCount,
        riskCount,
        averageConfidence,
        winRate: total ? Math.round((winCount / total) * 100) : 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
