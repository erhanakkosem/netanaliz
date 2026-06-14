'use client'

import { useState } from 'react'
import {
  Bell, Plus, TrendingDown, TrendingUp, Trash2, Loader2, AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  match: string
  bookmaker: string
  oddsType: string
  initialOdds: number
  currentOdds: number
  changePercent: number
  time: string
  direction: 'up' | 'down'
  active: boolean
}

interface NewAlertForm {
  match: string
  bookmaker: string
  oddsType: string
  threshold: string
}

const BOOKMAKERS = ['Bet365', 'Pinnacle', 'Betfair', 'Bwin', 'Unibet', '1xBet']
const ODDS_TYPES = ['MS1', 'MSX', 'MS2', 'IY1', 'IYX', 'IY2', 'O25', 'U25', 'KG_VAR', 'KG_YOK']
const MATCHES = [
  'Arsenal - Chelsea', 'Barcelona - Real Madrid', 'Inter - Milan',
  'Bayern - Dortmund', 'PSG - Marseille', 'Liverpool - Man City',
  'Galatasaray - Fenerbahçe', 'Juventus - Roma',
]

const MOCK_ALERTS: Alert[] = [
  { id: '1', match: 'Arsenal - Chelsea', bookmaker: 'Bet365', oddsType: 'MS1', initialOdds: 2.10, currentOdds: 1.95, changePercent: -7.14, time: '10:23', direction: 'down', active: true },
  { id: '2', match: 'Barcelona - Real Madrid', bookmaker: 'Pinnacle', oddsType: 'MS2', initialOdds: 3.40, currentOdds: 3.65, changePercent: 7.35, time: '10:15', direction: 'up', active: true },
  { id: '3', match: 'Inter - Milan', bookmaker: 'Betfair', oddsType: 'MSX', initialOdds: 3.10, currentOdds: 2.88, changePercent: -7.10, time: '09:45', direction: 'down', active: true },
  { id: '4', match: 'Bayern - Dortmund', bookmaker: 'Bwin', oddsType: 'MS1', initialOdds: 1.80, currentOdds: 1.72, changePercent: -4.44, time: '09:30', direction: 'down', active: true },
  { id: '5', match: 'PSG - Marseille', bookmaker: 'Unibet', oddsType: 'O25', initialOdds: 1.90, currentOdds: 2.05, changePercent: 7.89, time: '08:50', direction: 'up', active: false },
  { id: '6', match: 'Galatasaray - Fenerbahçe', bookmaker: 'Bet365', oddsType: 'MS1', initialOdds: 2.20, currentOdds: 2.05, changePercent: -6.82, time: '08:10', direction: 'down', active: true },
]

export default function DroppingOddsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [newAlert, setNewAlert] = useState<NewAlertForm>({ match: '', bookmaker: '', oddsType: '', threshold: '' })

  const handleAddAlert = () => {
    if (!newAlert.match || !newAlert.bookmaker || !newAlert.oddsType || !newAlert.threshold) return
    const alert: Alert = {
      id: String(Date.now()),
      match: newAlert.match,
      bookmaker: newAlert.bookmaker,
      oddsType: newAlert.oddsType,
      initialOdds: 0,
      currentOdds: 0,
      changePercent: 0,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      direction: 'down',
      active: true,
    }
    setAlerts((prev) => [alert, ...prev])
    setNewAlert({ match: '', bookmaker: '', oddsType: '', threshold: '' })
    setModalOpen(false)
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const toggleAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dropping Odds (Oran Düşüşleri)</h1>
          <p className="mt-1 text-sm text-muted">
            Oran düşüşlerini ve yükselişlerini anlık olarak takip edin.
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Yeni Alarm Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Alarm Ekle</DialogTitle>
              <DialogDescription>
                Oran değişimlerini takip etmek için yeni bir alarm oluşturun.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Maç</Label>
                <Select
                  value={newAlert.match}
                  onValueChange={(v) => setNewAlert((p) => ({ ...p, match: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Maç seçin" /></SelectTrigger>
                  <SelectContent>
                    {MATCHES.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Büro</Label>
                <Select
                  value={newAlert.bookmaker}
                  onValueChange={(v) => setNewAlert((p) => ({ ...p, bookmaker: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Büro seçin" /></SelectTrigger>
                  <SelectContent>
                    {BOOKMAKERS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Oran Türü</Label>
                <Select
                  value={newAlert.oddsType}
                  onValueChange={(v) => setNewAlert((p) => ({ ...p, oddsType: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="Oran türü seçin" /></SelectTrigger>
                  <SelectContent>
                    {ODDS_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Eşik Değer (%)</Label>
                <Input
                  type="number"
                  placeholder="Örn: 5"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert((p) => ({ ...p, threshold: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>İptal</Button>
              <Button onClick={handleAddAlert}>Ekle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Aktif Alarmlar ({alerts.filter((a) => a.active).length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {alerts.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-muted">
                <Bell className="h-12 w-12" />
                <p>Henüz alarm bulunmuyor</p>
              </div>
            )}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                  !alert.active && 'opacity-50',
                )}
              >
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleAlert(alert.id)}
                    className={cn(
                      'h-8 w-8',
                      alert.direction === 'down' ? 'text-danger' : 'text-success',
                    )}
                  >
                    {alert.direction === 'down' ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.match}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted">
                      <span>{alert.bookmaker}</span>
                      <span>•</span>
                      <span>{alert.oddsType}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-muted">
                      {alert.initialOdds.toFixed(2)} → {alert.currentOdds.toFixed(2)}
                    </p>
                    <Badge
                      variant={alert.direction === 'down' ? 'destructive' : 'success'}
                      className="text-xs"
                    >
                      {alert.changePercent > 0 ? '+' : ''}
                      {alert.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="h-8 w-8 text-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
