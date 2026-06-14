'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
  Users, CreditCard, Trophy, DollarSign, Shield, Activity, Bookmark,
  TrendingUp, Plus, Pencil, Trash2, X, Save, Search, Star,
  Loader2, BarChart3, Wallet, FileText, Bell
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface User { id: string; name: string | null; email: string | null; role: string; createdAt: string; subscriptions: { packageType: string; endDate: string }[] }
interface MatchData { id: string; homeTeam: string; awayTeam: string; league: string; matchDate: string; status: string; homeScore: number | null; awayScore: number | null; result: string | null }
interface Bookmaker { id: string; code: string; name: string; isActive: boolean; sortOrder: number }
interface Subscription { id: string; userId: string; packageType: string; startDate: string; endDate: string; isActive: boolean; user: { id: string; name: string | null; email: string | null } }
interface Prediction { id: string; matchId: string; prediction: string; confidence: number | null; match: { homeTeam: string; awayTeam: string; league: string } }

const PACKAGES = ['JET', 'STANDARD', 'PREMIUM', 'ELITE', 'WC2026_VIP'] as const
const MATCH_STATUSES = ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'] as const
const RESULTS = ['', 'MS1', 'MSX', 'MS2'] as const
const ROLES = ['FREE', 'STANDARD', 'PREMIUM', 'ELITE', 'ADMIN'] as const

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession()

  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') redirect('/archive')
  }, [authStatus, session])

  if (authStatus === 'loading') return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
  if (authStatus === 'unauthenticated' || session?.user?.role !== 'ADMIN') return null

  return <AdminPanel />
}

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [matches, setMatches] = useState<MatchData[]>([])
  const [bookmakers, setBookmakers] = useState<Bookmaker[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [matchStatusFilter, setMatchStatusFilter] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, matchesRes, bookmakersRes, subsRes, predsRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/matches' + (matchStatusFilter ? `?status=${matchStatusFilter}` : '')).then(r => r.json()),
        fetch('/api/admin/bookmakers').then(r => r.json()),
        fetch('/api/admin/subscriptions').then(r => r.json()),
        fetch('/api/admin/predictions').then(r => r.json()),
      ])
      setStats(statsRes.stats)
      setUsers(usersRes.users || [])
      setMatches(matchesRes.matches || [])
      setBookmakers(bookmakersRes.bookmakers || [])
      setSubscriptions(subsRes.subscriptions || [])
      setPredictions(predsRes.predictions || [])
    } catch (e) { toast({ title: 'Veri yüklenemedi', variant: 'destructive' }) }
    setLoading(false)
  }, [matchStatusFilter])

  useEffect(() => { loadData() }, [loadData])

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statCards = stats ? [
    { title: 'Kullanıcılar', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { title: 'Aktif Abonelik', value: stats.activeSubs, icon: CreditCard, color: 'text-emerald-400' },
    { title: 'Toplam Maç', value: stats.totalMatches, icon: Trophy, color: 'text-amber-400' },
    { title: 'Odds Kaydı', value: stats.totalOdds, icon: Activity, color: 'text-cyan-400' },
    { title: 'Tahmin', value: stats.totalPredictions, icon: Star, color: 'text-purple-400' },
    { title: 'Gelir', value: `${(stats.totalRevenue || 0).toLocaleString('tr-TR')} ₺`, icon: DollarSign, color: 'text-green-400' },
    { title: 'Kuponlar', value: stats.totalCoupons, icon: FileText, color: 'text-pink-400' },
  ] : []

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-emerald-500" />
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Paneli</h1>
          <p className="text-sm text-gray-400">Kod yazmadan tüm site yönetimi</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dashboard"><BarChart3 className="mr-1.5 h-4 w-4" />Dashboard</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-1.5 h-4 w-4" />Kullanıcılar ({users.length})</TabsTrigger>
          <TabsTrigger value="matches"><Trophy className="mr-1.5 h-4 w-4" />Maçlar ({matches.length})</TabsTrigger>
          <TabsTrigger value="subscriptions"><CreditCard className="mr-1.5 h-4 w-4" />Abonelikler ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="bookmakers"><Bookmark className="mr-1.5 h-4 w-4" />Bookmakerlar ({bookmakers.length})</TabsTrigger>
          <TabsTrigger value="predictions"><Star className="mr-1.5 h-4 w-4" />Tahminler ({predictions.length})</TabsTrigger>
        </TabsList>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div> : (
          <>
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {statCards.map(s => (
                  <Card key={s.title} className="border-gray-800 bg-gray-900/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">{s.title}</CardTitle>
                      <s.icon className={cn('h-5 w-5', s.color)} />
                    </CardHeader>
                    <CardContent><p className="text-2xl font-bold text-white">{s.value}</p></CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader><CardTitle className="text-white">Son Eklenen Maçlar</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    {stats?.recentMatches?.map((m: MatchData) => (
                      <div key={m.id} className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5 text-sm">
                        <span className="text-gray-300">{m.homeTeam} vs {m.awayTeam}</span>
                        <span className="text-gray-500">{m.league}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader><CardTitle className="text-white">Son Kayıt Olanlar</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    {stats?.topUsers?.map((u: User) => (
                      <div key={u.id} className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5 text-sm">
                        <span className="text-gray-300">{u.name || 'İsimsiz'}</span>
                        <Badge variant="secondary" className="text-xs">{u.role}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <TabHeader title="Kullanıcı Yönetimi" search={searchTerm} onSearch={setSearchTerm} placeholder="Kullanıcı ara..." />
              <UsersTable users={filteredUsers} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="matches" className="space-y-4">
              <TabHeader title="Maç Yönetimi" search={searchTerm} onSearch={setSearchTerm} placeholder="Maç ara..." 
                extra={<><MatchStatusFilter value={matchStatusFilter} onChange={setMatchStatusFilter} /><AddMatchButton onAdded={loadData} /></>} />
              <MatchesTable matches={matches} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <TabHeader title="Abonelik Yönetimi" />
              <SubscriptionsTable subscriptions={subscriptions} onRefresh={loadData} users={users} />
            </TabsContent>

            <TabsContent value="bookmakers" className="space-y-4">
              <TabHeader title="Bookmaker Yönetimi" extra={<AddBookmakerButton onAdded={loadData} />} />
              <BookmakersTable bookmakers={bookmakers} onRefresh={loadData} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <TabHeader title="Tahmin Yönetimi" extra={<AddPredictionButton onAdded={loadData} matches={matches} />} />
              <PredictionsTable predictions={predictions} onRefresh={loadData} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

function TabHeader({ title, search, onSearch, placeholder, extra }: {
  title: string; search?: string; onSearch?: (v: string) => void; placeholder?: string; extra?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="flex items-center gap-3">
        {onSearch && <Input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder} className="w-60" />}
        {extra}
      </div>
    </div>
  )
}

function MatchStatusFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
      <option value="">Tümü</option>
      {MATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white sm:max-w-lg">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

function UsersTable({ users, onRefresh }: { users: User[]; onRefresh: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')

  const handleEdit = async (userId: string) => {
    if (!editRole) return
    const res = await fetch('/api/admin/users', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: editRole })
    })
    if (res.ok) { toast({ title: 'Kullanıcı güncellendi' }); setEditId(null); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Ad</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">E-posta</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Rol</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Abonelik</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">İşlem</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white">{u.name || '-'}</td>
                <td className="px-4 py-3 text-gray-400">{u.email || '-'}</td>
                <td className="px-4 py-3">
                  {editId === u.id ? (
                    <div className="flex items-center gap-2">
                      <select value={editRole} onChange={e => setEditRole(e.target.value)}
                        className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white">
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => handleEdit(u.id)} className="text-emerald-400 hover:text-emerald-300"><Save className="h-4 w-4" /></button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {u.subscriptions?.[0] ? `${u.subscriptions[0].packageType} (${new Date(u.subscriptions[0].endDate).toLocaleDateString('tr-TR')})` : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditId(u.id); setEditRole(u.role) }} className="text-gray-400 hover:text-white mr-2"><Pencil className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function MatchesTable({ matches, onRefresh }: { matches: MatchData[]; onRefresh: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<MatchData>>({})

  const startEdit = (m: MatchData) => { setEditId(m.id); setEditData({ ...m }) }

  const handleSave = async () => {
    if (!editId) return
    const res = await fetch('/api/admin/matches', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...editData })
    })
    if (res.ok) { toast({ title: 'Maç güncellendi' }); setEditId(null); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Maçı silmek istediğinize emin misiniz?')) return
    const res = await fetch(`/api/admin/matches/${id}`, { method: 'DELETE' })
    if (res.ok) { toast({ title: 'Maç silindi' }); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Tarih</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Lig</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Ev</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Dep</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Durum</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Skor</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">İşlem</th>
          </tr></thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                {editId === m.id ? (
                  <>
                    <td className="px-4 py-3"><input type="datetime-local" value={editData.matchDate?.slice(0, 16) || ''} onChange={e => setEditData({ ...editData, matchDate: e.target.value })} className="w-36 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3"><input value={editData.league || ''} onChange={e => setEditData({ ...editData, league: e.target.value })} className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3"><input value={editData.homeTeam || ''} onChange={e => setEditData({ ...editData, homeTeam: e.target.value })} className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3"><input value={editData.awayTeam || ''} onChange={e => setEditData({ ...editData, awayTeam: e.target.value })} className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3">
                      <select value={editData.status || ''} onChange={e => setEditData({ ...editData, status: e.target.value })}
                        className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white">
                        {MATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <input type="number" value={editData.homeScore ?? ''} onChange={e => setEditData({ ...editData, homeScore: parseInt(e.target.value) || 0 })} className="w-10 rounded border border-gray-700 bg-gray-800 px-1 py-1 text-xs text-center text-white" />
                        <span className="text-gray-500">-</span>
                        <input type="number" value={editData.awayScore ?? ''} onChange={e => setEditData({ ...editData, awayScore: parseInt(e.target.value) || 0 })} className="w-10 rounded border border-gray-700 bg-gray-800 px-1 py-1 text-xs text-center text-white" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 mr-2"><Save className="h-4 w-4 inline" /></button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4 inline" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-gray-300">{new Date(m.matchDate).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3 text-gray-400">{m.league}</td>
                    <td className="px-4 py-3 text-white">{m.homeTeam}</td>
                    <td className="px-4 py-3 text-white">{m.awayTeam}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={m.status === 'FINISHED' ? 'success' : m.status === 'LIVE' ? 'warning' : 'secondary'} className="text-xs">{m.status}</Badge></td>
                    <td className="px-4 py-3 text-center text-gray-300">{m.homeScore != null ? `${m.homeScore}-${m.awayScore}` : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(m)} className="text-gray-400 hover:text-white mr-2"><Pencil className="h-4 w-4 inline" /></button>
                      <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4 inline" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function AddMatchButton({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ homeTeam: '', awayTeam: '', league: '', matchDate: '', status: 'SCHEDULED' })

  const handleSubmit = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.league || !form.matchDate) { toast({ title: 'Tüm alanları doldurun', variant: 'destructive' }); return }
    const res = await fetch('/api/admin/matches', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { toast({ title: 'Maç eklendi' }); setOpen(false); setForm({ homeTeam: '', awayTeam: '', league: '', matchDate: '', status: 'SCHEDULED' }); onAdded() }
    else { const d = await res.json(); toast({ title: d.error || 'Hata', variant: 'destructive' }) }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Maç Ekle</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Yeni Maç Ekle">
        <div className="space-y-3">
          {(['homeTeam', 'awayTeam', 'league'] as const).map(f => (
            <div key={f}><label className="mb-1 block text-xs text-gray-400">{f === 'homeTeam' ? 'Ev Sahibi' : f === 'awayTeam' ? 'Deplasman' : 'Lig'}</label>
              <Input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={f} /></div>
          ))}
          <div><label className="mb-1 block text-xs text-gray-400">Maç Tarihi</label>
            <Input type="datetime-local" value={form.matchDate} onChange={e => setForm({ ...form, matchDate: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs text-gray-400">Durum</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
              {MATCH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select></div>
        </div>
        <DialogFooter className="mt-4"><Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" />Kaydet</Button></DialogFooter>
      </Modal>
    </>
  )
}

function SubscriptionsTable({ subscriptions, onRefresh, users }: { subscriptions: Subscription[]; onRefresh: () => void; users: User[] }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ userId: '', packageType: 'STANDARD', days: 30 })

  const handleCreate = async () => {
    if (!form.userId) { toast({ title: 'Kullanıcı seçin', variant: 'destructive' }); return }
    const res = await fetch('/api/admin/subscriptions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { toast({ title: 'Abonelik oluşturuldu' }); setOpen(false); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Aboneliği iptal et?')) return
    const res = await fetch('/api/admin/subscriptions', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    })
    if (res.ok) { toast({ title: 'Abonelik iptal edildi' }); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <div className="p-4 flex justify-end"><Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Abonelik Ekle</Button></div>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Kullanıcı</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Paket</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Başlangıç</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Bitiş</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Durum</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">İşlem</th>
          </tr></thead>
          <tbody>
            {subscriptions.map(s => (
              <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white">{s.user?.name || s.user?.email || '-'}</td>
                <td className="px-4 py-3"><Badge>{s.packageType}</Badge></td>
                <td className="px-4 py-3 text-gray-400">{new Date(s.startDate).toLocaleDateString('tr-TR')}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(s.endDate).toLocaleDateString('tr-TR')}</td>
                <td className="px-4 py-3 text-center"><Badge variant={s.isActive ? 'success' : 'secondary'}>{s.isActive ? 'Aktif' : 'Pasif'}</Badge></td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      <Modal open={open} onClose={() => setOpen(false)} title="Abonelik Oluştur">
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs text-gray-400">Kullanıcı</label>
            <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
              <option value="">Seçin...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
            </select></div>
          <div><label className="mb-1 block text-xs text-gray-400">Paket</label>
            <select value={form.packageType} onChange={e => setForm({ ...form, packageType: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
              {PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
            </select></div>
          <div><label className="mb-1 block text-xs text-gray-400">Gün</label>
            <Input type="number" value={form.days} onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 30 })} /></div>
        </div>
        <DialogFooter className="mt-4"><Button onClick={handleCreate}><Save className="mr-1 h-4 w-4" />Oluştur</Button></DialogFooter>
      </Modal>
    </Card>
  )
}

function BookmakersTable({ bookmakers, onRefresh }: { bookmakers: Bookmaker[]; onRefresh: () => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Bookmaker>>({})

  const handleSave = async () => {
    if (!editId) return
    const res = await fetch('/api/admin/bookmakers', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...editData })
    })
    if (res.ok) { toast({ title: 'Bookmaker güncellendi' }); setEditId(null); onRefresh() }
    else toast({ title: 'Hata', variant: 'destructive' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    const res = await fetch('/api/admin/bookmakers', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    })
    if (res.ok) { toast({ title: 'Bookmaker silindi' }); onRefresh() }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Kod</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Ad</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Aktif</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Sıra</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">İşlem</th>
          </tr></thead>
          <tbody>
            {bookmakers.map(b => (
              <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                {editId === b.id ? (
                  <>
                    <td className="px-4 py-3"><input value={editData.code || ''} onChange={e => setEditData({ ...editData, code: e.target.value })} className="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3"><input value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} className="w-24 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white" /></td>
                    <td className="px-4 py-3 text-center"><input type="checkbox" checked={editData.isActive ?? false} onChange={e => setEditData({ ...editData, isActive: e.target.checked })} /></td>
                    <td className="px-4 py-3 text-center"><input type="number" value={editData.sortOrder ?? 0} onChange={e => setEditData({ ...editData, sortOrder: parseInt(e.target.value) || 0 })} className="w-12 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-center text-white" /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 mr-2"><Save className="h-4 w-4 inline" /></button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-white"><X className="h-4 w-4 inline" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-mono text-emerald-400">{b.code}</td>
                    <td className="px-4 py-3 text-white">{b.name}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={b.isActive ? 'success' : 'secondary'}>{b.isActive ? 'Evet' : 'Hayır'}</Badge></td>
                    <td className="px-4 py-3 text-center text-gray-400">{b.sortOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditId(b.id); setEditData({ code: b.code, name: b.name, isActive: b.isActive, sortOrder: b.sortOrder }) }} className="text-gray-400 hover:text-white mr-2"><Pencil className="h-4 w-4 inline" /></button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4 inline" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function AddBookmakerButton({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', sortOrder: 0 })

  const handleSubmit = async () => {
    if (!form.code || !form.name) { toast({ title: 'Kod ve ad gerekli', variant: 'destructive' }); return }
    const res = await fetch('/api/admin/bookmakers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { toast({ title: 'Bookmaker eklendi' }); setOpen(false); setForm({ code: '', name: '', sortOrder: 0 }); onAdded() }
    else { const d = await res.json(); toast({ title: d.error || 'Hata', variant: 'destructive' }) }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Bookmaker Ekle</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Yeni Bookmaker">
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs text-gray-400">Kod (OA-1, OA-2...)</label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs text-gray-400">Ad</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs text-gray-400">Sıra</label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} /></div>
        </div>
        <DialogFooter className="mt-4"><Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" />Kaydet</Button></DialogFooter>
      </Modal>
    </>
  )
}

function PredictionsTable({ predictions, onRefresh }: { predictions: Prediction[]; onRefresh: () => void }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tahmini sil?')) return
    const res = await fetch('/api/admin/predictions', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    })
    if (res.ok) { toast({ title: 'Tahmin silindi' }); onRefresh() }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left font-medium text-gray-400">Maç</th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">Lig</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Tahmin</th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">Güven</th>
            <th className="px-4 py-3 text-right font-medium text-gray-400">İşlem</th>
          </tr></thead>
          <tbody>
            {predictions.map(p => (
              <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="px-4 py-3 text-white">{p.match?.homeTeam} vs {p.match?.awayTeam}</td>
                <td className="px-4 py-3 text-gray-400">{p.match?.league}</td>
                <td className="px-4 py-3 text-center"><Badge>{p.prediction}</Badge></td>
                <td className="px-4 py-3 text-center text-gray-300">{p.confidence ? `%${(p.confidence * 100).toFixed(0)}` : '-'}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function AddPredictionButton({ onAdded, matches }: { onAdded: () => void; matches: MatchData[] }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ matchId: '', prediction: 'MS1', confidence: 0.7 })

  const handleSubmit = async () => {
    if (!form.matchId) { toast({ title: 'Maç seçin', variant: 'destructive' }); return }
    const res = await fetch('/api/admin/predictions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { toast({ title: 'Tahmin eklendi' }); setOpen(false); onAdded() }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Plus className="mr-1 h-4 w-4" />Tahmin Ekle</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tahmin Ekle">
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs text-gray-400">Maç</label>
            <select value={form.matchId} onChange={e => setForm({ ...form, matchId: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
              <option value="">Seçin...</option>
              {matches.map(m => <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</option>)}
            </select></div>
          <div><label className="mb-1 block text-xs text-gray-400">Tahmin</label>
            <select value={form.prediction} onChange={e => setForm({ ...form, prediction: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300">
              {RESULTS.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
            </select></div>
          <div><label className="mb-1 block text-xs text-gray-400">Güven (0-1)</label>
            <Input type="number" min="0" max="1" step="0.05" value={form.confidence} onChange={e => setForm({ ...form, confidence: parseFloat(e.target.value) || 0 })} /></div>
        </div>
        <DialogFooter className="mt-4"><Button onClick={handleSubmit}><Save className="mr-1 h-4 w-4" />Kaydet</Button></DialogFooter>
      </Modal>
    </>
  )
}
