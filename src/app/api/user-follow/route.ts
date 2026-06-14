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

    const { followingId } = await request.json()
    if (!followingId || followingId === session.user.id) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
    }

    const existing = await prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId } }
    })

    if (existing) {
      await prisma.userFollow.delete({ where: { id: existing.id } })
      return NextResponse.json({ following: false })
    }

    await prisma.userFollow.create({
      data: { followerId: session.user.id, followingId }
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const following = await prisma.userFollow.findMany({
      where: { followerId: session.user.id },
      include: { following: { select: { id: true, name: true, image: true } } }
    })

    return NextResponse.json({ following })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
