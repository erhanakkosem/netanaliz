'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Search, BarChart3, Loader2, AlertCircle, Plus, Save, Trash2, Bookmark,
} from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

const BOOKMAKERS = ['Bet365', 'Pinnacle', 'Betfair', 'Bwin', 'Unibet', '1xBet']
const ODDS_TYPES = ['MS1', 'MSX', 'MS2', 'IY1', 'IYX', 'IY2', 'O25', 'U25', 'KG_VAR', 'KG_YOK', 'CS_1X', 'CS_12', 'CS_X2']

interface SmartMatch {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  oddsType: string
  odds: number
  result: '1' | 'X' | '2'
  prediction: '1' | 'X' | '2'
  isHit: boolean
}

function generateMockMatches(oddsType: string, minOdds: number, maxOdds: number): SmartMatch[] {
  const leagues = ['Premier Lig', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
  const teams = [
    ['Arsenal', 'Chelsea'], ['Barcelona', 'Real Madrid'], ['Inter', 'Milan'],
    ['Bayern', 'Dortmund'], ['PSG', 'Marseille'], ['Liverpool', 'Man City'],
    ['Juventus', 'Roma'], ['Atletico', 'Sevilla'], ['Leverkusen', 'Leipzig'],
    ['Lyon', 'Monaco'],
  ]
  const results: ('1' | 'X' | '2')[] = ['1', 'X', '2']
  return Array.from({ length: 30 }, (_, i) => {
    const result = results[i % 3]
    const baseOdds = Math.round((minOdds + Math.random() * (maxOdds - minOdds)) * 100) / 100
    const prediction = results[(i + (i % 2)) % 3]
    return {
      id: String(i + 1),
      date: `2025-06-${String((i % 30) + 1).padStart(2, '0')}`,
      league: leagues[i % leagues.length],
      homeTeam: teams[i % teams.length][0],
      awayTeam: teams[i % teams.length][1],
      oddsType,
      odds: baseOdds,
      result,
      prediction,
      isHit: result === prediction,
    }
  })
}

export default function SmartPage() {
  const [bookmaker, setBookmaker] = useState('')
  const [oddsType, setOddsType] = useState('MS1')
  const [minOdds, setMinOdds] = useState('1.5')
  const [maxOdds, setMaxOdds] = useState('5.0')
  const [useOpeningOdds, setUseOpeningOdds] = useState(true)
  const [matches, setMatches] = useState<SmartMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [savedFilters, setSavedFilters] = useState<any[]>([])
  const [filterName, setFilterName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    fetch('/api/filters')
      .then(r => r.json())
      .then(data => setSavedFilters(data.filters || []))
      .catch(() => {})
  }, [])

  const saveFilter = async () => {
    if (!filterName.trim()) return
    const res = await fetch('/api/filters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: filterName,
        bookmakerIds: [bookmaker],
        oddsType,
        minOdds,
        maxOdds,
        useOpeningOdds,
      }),
    })
    if (res.ok) {
      setShowSaveDialog(false)
      setFilterName('')
      const data = await fetch('/api/filters').then(r => r.json())
      setSavedFilters(data.filters || [])
    }
  }

  const loadFilter = async (filter: any) => {
    let bmIds = filter.bookmakerIds
    try { bmIds = JSON.parse(bmIds) } catch {}
    setBookmaker(Array.isArray(bmIds) ? bmIds[0] || '' : bmIds || '')
    setOddsType(filter.oddsType || 'MS1')
    setMinOdds(filter.minOdds?.toString() || '')
    setMaxOdds(filter.maxOdds?.toString() || '')
    setUseOpeningOdds(filter.useOpeningOdds ?? true)
  }

  const deleteFilter = async (id: string) => {
    await fetch(`/api/filters?id=${id}`, { method: 'DELETE' })
    setSavedFilters(savedFilters.filter(f => f.id !== id))
  }

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/smart-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmaker, oddsType, minOdds: Number(minOdds), maxOdds: Number(maxOdds) }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMatches(data.matches ?? [])
    } catch {
      setMatches(generateMockMatches(oddsType, Number(minOdds), Number(maxOdds)))
    } finally {
      setLoading(false)
      setAnalyzed(true)
    }
  }

  const stats = analyzed && matches.length > 0
    ? {
        total: matches.length,
        hit: matches.filter((m) => m.isHit).length,
        ms1Count: matches.filter((m) => m.prediction === '1' && m.isHit).length,
        ms1Total: matches.filter((m) => m.prediction === '1').length,
        msxCount: matches.filter((m) => m.prediction === 'X' && m.isHit).length,
        msxTotal: matches.filter((m) => m.prediction === 'X').length,
        ms2Count: matches.filter((m) => m.prediction === '2' && m.isHit).length,
        ms2Total: matches.filter((m) => m.prediction === '2').length,
      }
    : null

  const chartData = stats
    ? [
        { name: 'MS1', value: stats.ms1Total > 0 ? Math.round((stats.ms1Count / stats.ms1Total) * 100) : 0, fill: '#10b981' },
        { name: 'MSX', value: stats.msxTotal > 0 ? Math.round((stats.msxCount / stats.msxTotal) * 100) : 0, fill: '#f59e0b' },
        { name: 'MS2', value: stats.ms2Total > 0 ? Math.round((stats.ms2Count / stats.ms2Total) * 100) : 0, fill: '#ef4444' },
      ]
    : []

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 130, sortable: true },
    { headerName: 'Deplasman', field: 'awayTeam', width: 130, sortable: true },
    { headerName: 'Oran Türü', field: 'oddsType', width: 100, sortable: true },
    { headerName: 'Oran', field: 'odds', width: 90, sortable: true },
    {
      headerName: 'Sonuç', field: 'result', width: 80, sortable: true,
      cellRenderer: (p: any) => <Badge variant={p.value === '1' ? 'success' : p.value === '2' ? 'destructive' : 'warning'}>{p.value}</Badge>,
    },
    {
      headerName: 'Tahmin', field: 'prediction', width: 80, sortable: true,
      cellRenderer: (p: any) => (
        <Badge variant={p.data.isHit ? 'success' : 'destructive'}>
          {p.value}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Akıllı Analiz</h1>
        <p className="mt-1 text-sm text-muted">
          Geçmiş verilere dayalı akıllı analizler yapın ve istatistikleri görüntüleyin.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Analiz Kriterleri</CardTitle>
            <div className="flex items-center gap-2">
              {savedFilters.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Kayıtlı Filtreler
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {savedFilters.map((f) => (
                      <div key={f.id} className="flex items-center justify-between px-2 py-1 group">
                        <DropdownMenuItem className="flex-1 cursor-pointer" onSelect={() => loadFilter(f)}>
                          {f.name}
                        </DropdownMenuItem>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteFilter(f.id) }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-destructive transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="secondary" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-1" />
                Filtreyi Kaydet
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>Büro</Label>
              <Select value={bookmaker} onValueChange={setBookmaker}>
                <SelectTrigger><SelectValue placeholder="Tümü" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {BOOKMAKERS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Oran Türü</Label>
              <Select value={oddsType} onValueChange={setOddsType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ODDS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Min Oran</Label>
              <Input
                type="number"
                step="0.1"
                value={minOdds}
                onChange={(e) => setMinOdds(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Oran</Label>
              <Input
                type="number"
                step="0.1"
                value={maxOdds}
                onChange={(e) => setMaxOdds(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="block">Açılış Oranı</Label>
              <div className="flex items-center gap-2 pt-1">
                <Switch checked={useOpeningOdds} onCheckedChange={setUseOpeningOdds} />
                <span className="text-xs text-muted">{useOpeningOdds ? 'Açılış' : 'Güncel'}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <BarChart3 className="h-4 w-4 mr-1" />}
              Analiz Et
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">İstatistikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.hit}/{stats.total}</p>
                  <p className="text-xs text-muted">Toplam İsabet</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total > 0 ? Math.round((stats.hit / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted">İsabet Oranı</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Oran Türü Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} unit="%" />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyzed && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Eşleşen Maçlar ({matches.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="ag-theme-alpine-dark" style={{ height: 400, width: '100%' }}>
              <AgGridReact
                rowData={matches}
                columnDefs={colDefs}
                defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
                animateRows
                pagination
                paginationPageSize={25}
                rowHeight={36}
                headerHeight={32}
                getRowClass={(p) => p.data.isHit ? 'bg-emerald-900/20' : ''}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtreyi Kaydet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Filtre Adı</Label>
              <Input
                placeholder="Örn: Düşük Risk MS1"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveFilter() }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>İptal</Button>
            <Button onClick={saveFilter} disabled={!filterName.trim()}>
              <Save className="h-4 w-4 mr-1" />
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
