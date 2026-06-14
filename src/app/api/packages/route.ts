import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PACKAGES, type PackageId } from '@/lib/constants'

export async function GET() {
  try {
    return NextResponse.json({ packages: PACKAGES })
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

    const { packageType } = await request.json()

    if (!packageType) {
      return NextResponse.json({ error: 'Paket türü gerekli' }, { status: 400 })
    }

    const pkg = PACKAGES.find((p) => p.id === packageType)

    if (!pkg) {
      return NextResponse.json({ error: 'Geçersiz paket türü' }, { status: 400 })
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: pkg.price,
        package: packageType,
        status: 'COMPLETED',
      },
    })

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        packageType: packageType as PackageId,
        startDate: new Date(),
        endDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000),
        paymentId: payment.id,
      },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'PREMIUM' },
    })

    return NextResponse.json({ payment, subscription }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
