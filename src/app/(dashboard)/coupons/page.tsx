'use client'

import { useState } from 'react'
import {
  Ticket, Plus, Heart, HeartOff, CheckCircle, XCircle, Clock, Trophy, Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface CouponMatch {
  id: string
  homeTeam: string
  awayTeam: string
  selection: string
  odds: number
}

interface Coupon {
  id: string
  title: string
  totalOdds: number
  creator: string
  date: string
  status: 'WON' | 'LOST' | 'ACTIVE'
  matches: CouponMatch[]
  likes: number
  liked: boolean
  isCommunity: boolean
}

const MOCK_MATCHES = [
  { id: 'm1', homeTeam: 'Arsenal', awayTeam: 'Chelsea' },
  { id: 'm2', homeTeam: 'Barcelona', awayTeam: 'Real Madrid' },
  { id: 'm3', homeTeam: 'Inter', awayTeam: 'Milan' },
  { id: 'm4', homeTeam: 'Bayern', awayTeam: 'Dortmund' },
  { id: 'm5', homeTeam: 'PSG', awayTeam: 'Marseille' },
  { id: 'm6', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe' },
]

const SELECTIONS = ['MS1', 'MSX', 'MS2', 'O25', 'U25', 'KG_VAR', 'KG_YOK']

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1', title: 'Haftanın Bankosu', totalOdds: 3.45, creator: 'Ahmet Y.', date: '2025-06-13',
    status: 'ACTIVE', likes: 24, liked: false, isCommunity: true,
    matches: [
      { id: 'c1m1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', selection: 'MS1', odds: 1.85 },
      { id: 'c1m2', homeTeam: 'Bayern', awayTeam: 'Dortmund', selection: 'MS1', odds: 1.45 },
      { id: 'c1m3', homeTeam: 'PSG', awayTeam: 'Marseille', selection: 'O25', odds: 1.65 },
    ],
  },
  {
    id: '2', title: 'Sürpriz Avı', totalOdds: 12.80, creator: 'Mehmet K.', date: '2025-06-12',
    status: 'WON', likes: 56, liked: false, isCommunity: true,
    matches: [
      { id: 'c2m1', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', selection: 'MSX', odds: 3.20 },
      { id: 'c2m2', homeTeam: 'Inter', awayTeam: 'Milan', selection: 'MS2', odds: 4.00 },
    ],
  },
  {
    id: '3', title: 'Düşük Risk', totalOdds: 2.10, creator: 'Ali R.', date: '2025-06-11',
    status: 'WON', likes: 12, liked: true, isCommunity: true,
    matches: [
      { id: 'c3m1', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', selection: 'KG_VAR', odds: 1.55 },
      { id: 'c3m2', homeTeam: 'Liverpool', awayTeam: 'Man City', selection: 'O25', odds: 1.35 },
    ],
  },
  {
    id: '4', title: 'Riskli Kupon', totalOdds: 28.50, creator: 'Can D.', date: '2025-06-10',
    status: 'LOST', likes: 8, liked: false, isCommunity: true,
    matches: [
      { id: 'c4m1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', selection: 'MS2', odds: 3.80 },
      { id: 'c4m2', homeTeam: 'PSG', awayTeam: 'Marseille', selection: 'MSX', odds: 3.50 },
      { id: 'c4m3', homeTeam: 'Bayern', awayTeam: 'Dortmund', selection: 'MS2', odds: 4.20 },
      { id: 'c4m4', homeTeam: 'Inter', awayTeam: 'Milan', selection: 'MS1', odds: 2.50 },
    ],
  },
  {
    id: '5', title: 'Kendi Kuponum #1', totalOdds: 5.40, creator: 'Ben', date: '2025-06-14',
    status: 'ACTIVE', likes: 0, liked: false, isCommunity: false,
    matches: [
      { id: 'c5m1', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', selection: 'MS1', odds: 2.30 },
      { id: 'c5m2', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', selection: 'U25', odds: 2.35 },
    ],
  },
]

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCouponTitle, setNewCouponTitle] = useState('')
  const [newCouponMatches, setNewCouponMatches] = useState<
    { matchId: string; selection: string; odds: string }[]
  >([])

  const userCoupons = coupons.filter((c) => !c.isCommunity)
  const communityCoupons = coupons.filter((c) => c.isCommunity)

  const toggleLike = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c,
      ),
    )
  }

  const addMatchToNewCoupon = () => {
    setNewCouponMatches((prev) => [
      ...prev,
      { matchId: '', selection: '', odds: '' },
    ])
  }

  const updateNewMatch = (index: number, field: string, value: string) => {
    setNewCouponMatches((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    )
  }

  const removeNewMatch = (index: number) => {
    setNewCouponMatches((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateCoupon = () => {
    if (!newCouponTitle.trim() || newCouponMatches.length === 0) return
    const matches: CouponMatch[] = newCouponMatches.map((m, i) => {
      const match = MOCK_MATCHES.find((mm) => mm.id === m.matchId)
      return {
        id: `nc${i}`,
        homeTeam: match?.homeTeam ?? '',
        awayTeam: match?.awayTeam ?? '',
        selection: m.selection,
        odds: Number(m.odds),
      }
    })
    const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1)
    const coupon: Coupon = {
      id: String(Date.now()),
      title: newCouponTitle,
      totalOdds: Math.round(totalOdds * 100) / 100,
      creator: 'Ben',
      date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      matches,
      likes: 0,
      liked: false,
      isCommunity: false,
    }
    setCoupons((prev) => [coupon, ...prev])
    setNewCouponTitle('')
    setNewCouponMatches([])
    setDialogOpen(false)
  }

  const statusVariant = (status: Coupon['status']) => {
    switch (status) {
      case 'WON': return 'success'
      case 'LOST': return 'destructive'
      case 'ACTIVE': return 'warning'
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">KuponX — Kazananlar Kulübü</h1>
          <p className="mt-1 text-sm text-muted">
            Kuponlarınızı oluşturun, topluluk kuponlarını keşfedin.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Yeni Kupon Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Kupon Oluştur</DialogTitle>
              <DialogDescription>
                Kuponunuza maç ekleyin ve tahminlerinizi belirleyin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kupon Adı</Label>
                <Input
                  placeholder="Kupon adı girin"
                  value={newCouponTitle}
                  onChange={(e) => setNewCouponTitle(e.target.value)}
                />
              </div>
              {newCouponMatches.map((m, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Maç {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNewMatch(index)}
                      className="h-6 text-xs text-danger"
                    >
                      Kaldır
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={m.matchId}
                      onValueChange={(v) => updateNewMatch(index, 'matchId', v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Maç seçin" /></SelectTrigger>
                      <SelectContent>
                        {MOCK_MATCHES.map((mm) => (
                          <SelectItem key={mm.id} value={mm.id}>
                            {mm.homeTeam} vs {mm.awayTeam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Seçim</Label>
                      <Select
                        value={m.selection}
                        onValueChange={(v) => updateNewMatch(index, 'selection', v)}
                      >
                        <SelectTrigger><SelectValue placeholder="Seçim" /></SelectTrigger>
                        <SelectContent>
                          {SELECTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Oran</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1.50"
                        value={m.odds}
                        onChange={(e) => updateNewMatch(index, 'odds', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={addMatchToNewCoupon}>
                <Plus className="h-4 w-4" />
                Maç Ekle
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button onClick={handleCreateCoupon}>Oluştur</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="mine" className="w-full">
        <TabsList>
          <TabsTrigger value="mine" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Kuponlarım ({userCoupons.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Popüler Kuponlar ({communityCoupons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine" className="space-y-4">
          {userCoupons.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-16 text-muted">
                <Ticket className="h-12 w-12" />
                <p>Henüz kupon oluşturmadınız</p>
              </CardContent>
            </Card>
          ) : (
            userCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} onToggleLike={toggleLike} />
            ))
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {communityCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onToggleLike={toggleLike} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CouponCard({ coupon, onToggleLike }: { coupon: Coupon; onToggleLike: (id: string) => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-base">{coupon.title}</CardTitle>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span>{coupon.creator}</span>
            <span>•</span>
            <span>{coupon.date}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={coupon.status === 'WON' ? 'success' : coupon.status === 'LOST' ? 'destructive' : 'warning'}>
            {coupon.status === 'WON' && <CheckCircle className="mr-1 h-3 w-3" />}
            {coupon.status === 'LOST' && <XCircle className="mr-1 h-3 w-3" />}
            {coupon.status === 'ACTIVE' && <Clock className="mr-1 h-3 w-3" />}
            {coupon.status === 'WON' ? 'Kazandı' : coupon.status === 'LOST' ? 'Kaybetti' : 'Aktif'}
          </Badge>
          {coupon.isCommunity && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleLike(coupon.id)}
              className="h-8 w-8"
            >
              {coupon.liked ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              ) : (
                <HeartOff className="h-4 w-4 text-muted" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {coupon.matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-muted" />
                <span className="text-foreground">
                  {match.homeTeam} vs {match.awayTeam}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{match.selection}</Badge>
                <span className="font-semibold text-foreground">{match.odds.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted">Toplam Oran</span>
          <span className="text-lg font-bold text-primary">{coupon.totalOdds.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
