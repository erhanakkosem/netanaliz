import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, chatId, message } = await req.json()

    if (action === 'send-test') {
      if (!TELEGRAM_BOT_TOKEN) {
        return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 400 })
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      const userChatId = chatId || (user as any)?.telegramChatId
      
      if (!userChatId) {
        return NextResponse.json({ error: 'Telegram chat ID not set' }, { status: 400 })
      }

      const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userChatId,
          text: message || '🔔 OranAnaliz: Bildirimler başarıyla aktif!',
          parse_mode: 'HTML',
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        return NextResponse.json({ error: 'Telegram API error', details: err }, { status: 500 })
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { telegramChatId: userChatId } as any,
      })

      return NextResponse.json({ success: true })
    }

    if (action === 'link') {
      if (!TELEGRAM_BOT_TOKEN) {
        return NextResponse.json({ error: 'Telegram bot not configured' }, { status: 400 })
      }

      const linkCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'orananaliz_bot'

      return NextResponse.json({
        botUsername,
        linkCode,
        instructions: `1. Telegram'da @${botUsername} bulun\n2. /start komutunu gönderin\n3. Kodu girin: ${linkCode}`,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Telegram error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
