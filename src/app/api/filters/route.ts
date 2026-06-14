import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filters = await prisma.smartFilter.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ filters })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, bookmakerIds, oddsType, minOdds, maxOdds, useOpeningOdds } = await req.json()

    const filter = await prisma.smartFilter.create({
      data: {
        userId: session.user.id,
        name: name || 'Filtre',
        bookmakerIds: JSON.stringify(bookmakerIds || []),
        oddsType: oddsType || 'MS1',
        minOdds: minOdds ? parseFloat(minOdds) : null,
        maxOdds: maxOdds ? parseFloat(maxOdds) : null,
        useOpeningOdds: useOpeningOdds ?? true,
      },
    })

    return NextResponse.json({ filter })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Filter ID required' }, { status: 400 })
    }

    await prisma.smartFilter.deleteMany({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
