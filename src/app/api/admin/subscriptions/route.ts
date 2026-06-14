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

    const subscriptions = await prisma.subscription.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ subscriptions })
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

    const { userId, packageType, days } = await request.json()
    if (!userId || !packageType || !days) {
      return NextResponse.json({ error: 'userId, packageType, days required' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    const subscription = await prisma.subscription.create({
      data: { userId, packageType, startDate, endDate }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'PREMIUM' }
    })

    return NextResponse.json({ subscription })
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
    const sub = await prisma.subscription.findUnique({ where: { id } })
    
    await prisma.subscription.delete({ where: { id } })
    
    if (sub) {
      await prisma.user.update({
        where: { id: sub.userId },
        data: { role: 'FREE' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
