import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { isActive: true },
          orderBy: { endDate: 'desc' },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const { hashedPassword, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
