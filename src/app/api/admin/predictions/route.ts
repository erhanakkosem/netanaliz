import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const predictions = await prisma.prediction.findMany({
      include: { match: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ predictions })
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

    const { matchId, prediction, confidence, homeProb, drawProb, awayProb } = await request.json()
    if (!matchId || !prediction) {
      return NextResponse.json({ error: 'matchId and prediction required' }, { status: 400 })
    }

    const existing = await prisma.prediction.findUnique({ where: { matchId } })
    if (existing) {
      const updated = await prisma.prediction.update({
        where: { matchId },
        data: { prediction, confidence, homeProb, drawProb, awayProb }
      })
      return NextResponse.json({ prediction: updated })
    }

    const newPred = await prisma.prediction.create({
      data: { matchId, prediction, confidence, homeProb, drawProb, awayProb }
    })

    return NextResponse.json({ prediction: newPred })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await request.json()
    await prisma.prediction.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
