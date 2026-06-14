'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Crown, Search, Check, X, Loader2, UserCheck, Users, Calendar, TrendingUp } from 'lucide-react'

export default function VIPManagementPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') redirect('/login')
    if (session?.user?.role !== 'ADMIN') redirect('/archive')
    
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session, status])

  const updateRole = async (userId: string, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
  }

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">VIP Yönetimi</h1>
          <p className="text-muted">Kullanıcı rolleri ve abonelik yönetimi</p>
        </div>
        <Crown className="h-8 w-8 text-warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="py-4"><CardTitle className="text-sm text-muted">Toplam Kullanıcı</CardTitle><p className="text-2xl font-bold">{users.length}</p></CardHeader></Card>
        <Card><CardHeader className="py-4"><CardTitle className="text-sm text-muted">Premium</CardTitle><p className="text-2xl font-bold text-primary">{users.filter(u => u.role === 'PREMIUM').length}</p></CardHeader></Card>
        <Card><CardHeader className="py-4"><CardTitle className="text-sm text-muted">Standart</CardTitle><p className="text-2xl font-bold text-secondary">{users.filter(u => u.role === 'STANDARD').length}</p></CardHeader></Card>
        <Card><CardHeader className="py-4"><CardTitle className="text-sm text-muted">Aylık Aktif</CardTitle><p className="text-2xl font-bold text-accent">{users.filter(u => u.role !== 'FREE').length}</p></CardHeader></Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input className="pl-10" placeholder="Kullanıcı ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm text-muted font-medium">Kullanıcı</th>
                <th className="text-left p-4 text-sm text-muted font-medium">E-posta</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Rol</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Kayıt</th>
                <th className="text-right p-4 text-sm text-muted font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-card-hover">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium">{user.name || 'İsimsiz'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === 'PREMIUM' ? 'success' : user.role === 'STANDARD' ? 'warning' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="p-4 text-right">
                    <Select onValueChange={(val) => updateRole(user.id, val)} defaultValue={user.role}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">FREE</SelectItem>
                        <SelectItem value="STANDARD">STANDARD</SelectItem>
                        <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                        <SelectItem value="ELITE">ELITE</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted">Kullanıcı bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
