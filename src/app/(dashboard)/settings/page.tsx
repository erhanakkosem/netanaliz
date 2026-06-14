'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Smartphone, Globe, Mail, Check, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [telegramChatId, setTelegramChatId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const linkTelegram = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'link' }),
      })
      const data = await res.json()
      if (data.botUsername) {
        setStatus(data.instructions)
      }
    } catch {
      setStatus('Bağlantı hatası')
    }
    setLoading(false)
  }

  const testTelegram = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send-test', 
          chatId: telegramChatId,
          message: '✅ OranAnaliz bildirim sistemi çalışıyor!'
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('✅ Test mesajı gönderildi!')
      } else {
        setStatus('❌ ' + (data.error || 'Hata'))
      }
    } catch {
      setStatus('❌ Bağlantı hatası')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-muted">Hesap ve bildirim tercihlerinizi yönetin</p>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Bildirimler</TabsTrigger>
          <TabsTrigger value="account"><Smartphone className="h-4 w-4 mr-2" />Hesap</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Telegram Bildirimleri</CardTitle>
              <CardDescription>
                Dropping odds alarmları ve önemli uyarıları Telegram üzerinden alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Telegram Bot</p>
                  <p className="text-xs text-muted">@orananaliz_bot</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Telegram Chat ID</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Chat ID'nizi girin"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                  />
                  <Button onClick={testTelegram} disabled={loading || !telegramChatId}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test'}
                  </Button>
                </div>
              </div>

              <Button variant="outline" onClick={linkTelegram} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Telegram'a Bağlan
              </Button>

              {status && (
                <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-sm whitespace-pre-line">
                  {status}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
              <CardDescription>Hangi durumlarda bildirim almak istediğinizi seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 'dropping_odds', label: 'Dropping Odds', desc: 'Oran düşüşlerinde anlık uyarı' },
                { id: 'smart_match', label: 'Smart Eşleşme', desc: 'Filtrelerinize uygun maç bulunduğunda' },
                { id: 'daily_summary', label: 'Günlük Özet', desc: 'Her gün özet analiz raporu' },
              ].map((item) => (
                <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-hover cursor-pointer">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
              <CardDescription>E-posta ve dil tercihlerinizi yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input value={session?.user?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Dil</Label>
                  <select className="flex h-10 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
                    <option>Türkçe</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              <Button>Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
