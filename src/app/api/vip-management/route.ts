import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, credits: true,
        createdAt: true, subscriptions: { where: { isActive: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, packageType, days } = await request.json()
    if (!userId || !packageType || !days) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        packageType,
        startDate,
        endDate,
        isActive: true
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'PREMIUM' }
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
