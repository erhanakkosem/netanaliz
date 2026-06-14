'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  User, Mail, Shield, Calendar, CreditCard, Edit3, Lock, Trash2, AlertCircle, Save, Loader2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { data: session } = useSession()

  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(session?.user?.name ?? '')
  const [email, setEmail] = useState(session?.user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const subscription = {
    package: 'Premium Paket',
    endDate: '2025-08-15',
    remainingDays: 62,
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setEditMode(false)
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return
    setChangingPassword(true)
    await new Promise((r) => setTimeout(r, 1000))
    setChangingPassword(false)
    setPasswordChanged(true)
    setTimeout(() => setPasswordChanged(false), 3000)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false)
    setDeleteConfirm('')
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Profilim</h1>
        <p className="mt-1 text-sm text-muted">
          Hesap bilgilerinizi görüntüleyin ve düzenleyin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Kişisel Bilgiler</CardTitle>
            {!editMode ? (
              <Button variant="ghost" size="sm" onClick={() => setEditMode(true)}>
                <Edit3 className="mr-1 h-4 w-4" />
                Düzenle
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>İptal</Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi' : 'Kaydet'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editMode ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{session?.user?.name ?? '—'}</p>
                    <p className="text-xs text-muted">Ad Soyad</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{session?.user?.email ?? '—'}</p>
                    <p className="text-xs text-muted">E-posta</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <Badge variant="secondary">{session?.user?.role ?? 'USER'}</Badge>
                    <p className="text-xs text-muted">Rol</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Abonelik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{subscription.package}</p>
                <p className="text-xs text-muted">Mevcut Paket</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{subscription.endDate}</p>
                <p className="text-xs text-muted">Bitiş Tarihi</p>
              </div>
            </div>
            <div className="rounded-lg bg-card-hover p-3 text-center">
              <p className="text-2xl font-bold text-primary">{subscription.remainingDays}</p>
              <p className="text-xs text-muted">Kalan Gün</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            Şifre Değiştir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
            >
              {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {changingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </Button>
            {passwordChanged && (
              <span className="text-sm text-success">Şifre başarıyla değiştirildi.</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-danger">
            <Trash2 className="h-4 w-4" />
            Hesabı Sil
          </CardTitle>
          <CardDescription>
            Hesabınızı kalıcı olarak silmek isterseniz aşağıdaki butonu kullanın. Bu işlem geri alınamaz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4" />
                Hesabımı Sil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hesabı Sil</DialogTitle>
                <DialogDescription>
                  Bu işlem geri alınamaz. Hesabınızı silmek için aşağıya &quot;SİL&quot; yazın.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Onay</Label>
                <Input
                  placeholder="SİL"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
                <Button
                  variant="destructive"
                  disabled={deleteConfirm !== 'SİL'}
                  onClick={handleDeleteAccount}
                >
                  Hesabı Sil
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
