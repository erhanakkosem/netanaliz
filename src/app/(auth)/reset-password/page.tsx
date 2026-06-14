'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Şifreler eşleşmiyor'); return }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı'); return }
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 2000)
      } else {
        const data = await res.json()
        setError(data.error || 'Bir hata oluştu')
      }
    } catch { setError('Bir hata oluştu') }
    setLoading(false)
  }

  if (!token) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted">Geçersiz bağlantı</p></div>
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Şifre Sıfırlandı ✅</CardTitle>
            <CardDescription>Giriş sayfasına yönlendiriliyorsunuz...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Yeni Şifre Belirleyin</CardTitle>
          <CardDescription>Yeni şifrenizi girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Yeni Şifre</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Şifre Tekrar</Label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Şifreyi Sıfırla
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
