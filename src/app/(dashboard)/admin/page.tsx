'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Users, CreditCard, Trophy, DollarSign, Shield, AlertCircle, Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  subscriptionEnd: string | null
}

interface MatchRow {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  result: string
}

const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'USER', subscriptionEnd: '2025-08-15' },
  { id: '2', name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'USER', subscriptionEnd: '2025-07-20' },
  { id: '3', name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'USER', subscriptionEnd: null },
  { id: '4', name: 'Can Öz', email: 'can@example.com', role: 'ADMIN', subscriptionEnd: '2025-12-31' },
  { id: '5', name: 'Elif Polat', email: 'elif@example.com', role: 'USER', subscriptionEnd: '2025-09-01' },
  { id: '6', name: 'Burak Şahin', email: 'burak@example.com', role: 'USER', subscriptionEnd: '2025-06-30' },
  { id: '7', name: 'Zeynep Aslan', email: 'zeynep@example.com', role: 'USER', subscriptionEnd: null },
]

const MOCK_MATCHES: MatchRow[] = [
  { id: '1', date: '2025-06-14', league: 'Premier Lig', homeTeam: 'Arsenal', awayTeam: 'Chelsea', result: '1' },
  { id: '2', date: '2025-06-14', league: 'La Liga', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', result: 'X' },
  { id: '3', date: '2025-06-13', league: 'Serie A', homeTeam: 'Inter', awayTeam: 'Milan', result: '1' },
  { id: '4', date: '2025-06-13', league: 'Bundesliga', homeTeam: 'Bayern', awayTeam: 'Dortmund', result: '1' },
  { id: '5', date: '2025-06-12', league: 'Süper Lig', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', result: '2' },
  { id: '6', date: '2025-06-12', league: 'Ligue 1', homeTeam: 'PSG', awayTeam: 'Marseille', result: '1' },
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [users] = useState<UserRow[]>(MOCK_USERS)
  const [matches] = useState<MatchRow[]>(MOCK_MATCHES)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      redirect('/dashboard')
    }
  }, [status, session])

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null
  }

  const activeSubscriptions = users.filter((u) => u.subscriptionEnd && new Date(u.subscriptionEnd) > new Date()).length
  const totalRevenue = users.filter((u) => u.subscriptionEnd).length * 499

  const stats = [
    { title: 'Toplam Kullanıcı', value: users.length, icon: Users, color: 'text-blue-400' },
    { title: 'Aktif Abonelik', value: activeSubscriptions, icon: CreditCard, color: 'text-emerald-400' },
    { title: 'Toplam Maç', value: matches.length, icon: Trophy, color: 'text-amber-400' },
    { title: 'Toplam Gelir', value: `${totalRevenue.toLocaleString('tr-TR')} ₺`, icon: DollarSign, color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Admin Paneli</h1>
          <p className="text-sm text-muted">Sistem yönetimi ve istatistikler.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">{stat.title}</CardTitle>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kullanıcılar ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted">Ad Soyad</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">E-posta</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Rol</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Abonelik Bitiş</th>
                  <th className="px-4 py-3 text-right font-medium text-muted">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border transition-colors hover:bg-card-hover">
                    <td className="px-4 py-3 text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {user.subscriptionEnd ? (
                        <span className={cn(
                          'text-sm',
                          new Date(user.subscriptionEnd) > new Date() ? 'text-success' : 'text-danger',
                        )}>
                          {user.subscriptionEnd}
                        </span>
                      ) : (
                        <span className="text-muted">Yok</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Düzenle</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Maçlar ({matches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-medium text-muted">Tarih</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Lig</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Ev Sahibi</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Deplasman</th>
                  <th className="px-4 py-3 text-center font-medium text-muted">Sonuç</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-border transition-colors hover:bg-card-hover">
                    <td className="px-4 py-3 text-foreground">{match.date}</td>
                    <td className="px-4 py-3 text-muted">{match.league}</td>
                    <td className="px-4 py-3 text-foreground">{match.homeTeam}</td>
                    <td className="px-4 py-3 text-foreground">{match.awayTeam}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={match.result === '1' ? 'success' : match.result === '2' ? 'destructive' : 'warning'}
                      >
                        {match.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
