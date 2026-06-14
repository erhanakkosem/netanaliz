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

    const alerts = await prisma.droppingOddsAlert.findMany({
      where: { userId: session.user.id, isActive: true },
      include: {
        match: true,
        bookmaker: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ alerts })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { matchId, bookmakerId, oddsType, threshold } = await request.json()

    if (!matchId || !bookmakerId || !oddsType) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    const matchOdds = await prisma.matchOdds.findFirst({
      where: { matchId, bookmakerId, oddsType },
    })

    if (!matchOdds) {
      return NextResponse.json({ error: 'Oran bulunamadı' }, { status: 404 })
    }

    const initialValue = matchOdds.closingOdds ?? matchOdds.openingOdds ?? 0

    const alert = await prisma.droppingOddsAlert.create({
      data: {
        userId: session.user.id,
        matchId,
        bookmakerId,
        oddsType,
        initialOdds: initialValue,
        currentOdds: initialValue,
        threshold: threshold ?? 0.1,
      },
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Bildirim ID gerekli' }, { status: 400 })
    }

    await prisma.droppingOddsAlert.deleteMany({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ message: 'Bildirim silindi' })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
