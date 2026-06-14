'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setSent(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {sent ? <CheckCircle className="h-6 w-6 text-primary" /> : <Mail className="h-6 w-6 text-primary" />}
          </div>
          <CardTitle>{sent ? 'Kontrol Edin' : 'Şifre Sıfırlama'}</CardTitle>
          <CardDescription>
            {sent 
              ? 'E-posta adresinize şifre sıfırlama bağlantısı gönderdik.' 
              : 'E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sıfırlama Bağlantısı Gönder
              </Button>
            </form>
          ) : (
            <div className="text-center text-sm text-muted">
              Bağlantıyı almadınız mı? Spam klasörünü kontrol edin veya{' '}
              <button onClick={() => setSent(false)} className="text-primary hover:underline">tekrar deneyin</button>.
            </div>
          )}
          <div className="mt-4 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" /> Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
