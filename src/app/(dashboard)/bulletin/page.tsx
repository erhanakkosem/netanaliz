'use client'

import { useState, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Save, Upload, Loader2, AlertCircle, ScanLine, Filter } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

interface BulletinMatch {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  ms1: number
  msx: number
  ms2: number
  selected: boolean
}

interface SavedFilter {
  id: string
  name: string
  dateFilter: string
  leagueFilter: string
  minOdds: string
  maxOdds: string
}

const MOCK_BULLETIN: BulletinMatch[] = Array.from({ length: 40 }, (_, i) => {
  const leagues = ['Süper Lig', 'Premier Lig', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', '1. Lig']
  const teams = [
    ['Galatasaray', 'Fenerbahçe'], ['Beşiktaş', 'Trabzonspor'], ['Başakşehir', 'Sivasspor'],
    ['Arsenal', 'Chelsea'], ['Barcelona', 'Real Madrid'], ['Inter', 'Milan'],
    ['Bayern', 'Dortmund'], ['PSG', 'Marseille'], ['Liverpool', 'Man City'],
    ['Juventus', 'Roma'], ['Atletico', 'Sevilla'], ['Lyon', 'Monaco'],
    ['Adana D.', 'Konyaspor'], ['Antalyaspor', 'Alanyaspor'], ['Leverkusen', 'Leipzig'],
    ['Valencia', 'Betis'], ['Rennes', 'Nice'], ['Fiorentina', 'Lazio'],
    ['Milan', 'Napoli'], ['Wolves', 'Aston Villa'],
  ]
  const [home, away] = teams[i % teams.length]
  return {
    id: String(i + 1),
    date: `2025-06-${String((i % 15) + 14).padStart(2, '0')}`,
    league: leagues[i % leagues.length],
    homeTeam: home,
    awayTeam: away,
    ms1: Math.round((1.5 + Math.random() * 4.5) * 100) / 100,
    msx: Math.round((2.8 + Math.random() * 2.5) * 100) / 100,
    ms2: Math.round((2.0 + Math.random() * 5.0) * 100) / 100,
    selected: false,
  }
})

export default function BulletinPage() {
  const gridRef = useRef<AgGridReact>(null)
  const [matches] = useState<BulletinMatch[]>(MOCK_BULLETIN)
  const [filteredMatches, setFilteredMatches] = useState<BulletinMatch[]>(MOCK_BULLETIN)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [leagueFilter, setLeagueFilter] = useState('')
  const [minOdds, setMinOdds] = useState('')
  const [maxOdds, setMaxOdds] = useState('')
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [filterName, setFilterName] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)

  const applyFilters = () => {
    let result = [...matches]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) || m.awayTeam.toLowerCase().includes(q) || m.league.toLowerCase().includes(q),
      )
    }
    if (leagueFilter) {
      result = result.filter((m) => m.league === leagueFilter)
    }
    if (minOdds) {
      result = result.filter((m) => m.ms1 >= Number(minOdds) || m.msx >= Number(minOdds) || m.ms2 >= Number(minOdds))
    }
    if (maxOdds) {
      result = result.filter((m) => m.ms1 <= Number(maxOdds) || m.msx <= Number(maxOdds) || m.ms2 <= Number(maxOdds))
    }
    setFilteredMatches(result)
  }

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return
    const filter: SavedFilter = {
      id: String(Date.now()),
      name: filterName,
      dateFilter,
      leagueFilter,
      minOdds,
      maxOdds,
    }
    setSavedFilters((prev) => [...prev, filter])
    setFilterName('')
    setSaveDialogOpen(false)
  }

  const loadFilter = (filter: SavedFilter) => {
    setDateFilter(filter.dateFilter)
    setLeagueFilter(filter.leagueFilter)
    setMinOdds(filter.minOdds)
    setMaxOdds(filter.maxOdds)
    setLoadDialogOpen(false)
    applyFilters()
  }

  const colDefs: ColDef[] = [
    {
      headerName: '',
      field: 'selected',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 140, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Deplasman', field: 'awayTeam', width: 140, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'MS1', field: 'ms1', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'MSX', field: 'msx', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'MS2', field: 'ms2', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
  ]

  const leagues = [...new Set(matches.map((m) => m.league))]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Bülten Tarama</h1>
          <p className="mt-1 text-sm text-muted">
            Bülten maçlarını filtreleyin, kaydedin ve analiz edin.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Save className="h-4 w-4" />Filtre Kaydet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtre Kaydet</DialogTitle>
                <DialogDescription>Mevcut filtreleri kaydedin.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Filtre Adı</Label>
                <Input
                  placeholder="Filtre adı girin"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>İptal</Button>
                <Button onClick={saveCurrentFilter}>Kaydet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Upload className="h-4 w-4" />Filtre Yükle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtre Yükle</DialogTitle>
                <DialogDescription>Kayıtlı bir filtreyi yükleyin.</DialogDescription>
              </DialogHeader>
              {savedFilters.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Kayıtlı filtre bulunmuyor.</p>
              ) : (
                <div className="space-y-2">
                  {savedFilters.map((f) => (
                    <Button
                      key={f.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => loadFilter(f)}
                    >
                      {f.name}
                    </Button>
                  ))}
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>Kapat</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:w-44">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tüm Tarihler</option>
                <option value="today">Bugün</option>
                <option value="tomorrow">Yarın</option>
                <option value="week">Bu Hafta</option>
              </select>
            </div>
            <div className="relative w-full sm:w-44">
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tüm Ligler</option>
                {leagues.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-32">
              <Input
                type="number"
                step="0.1"
                placeholder="Min oran"
                value={minOdds}
                onChange={(e) => setMinOdds(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-32">
              <Input
                type="number"
                step="0.1"
                placeholder="Max oran"
                value={maxOdds}
                onChange={(e) => setMaxOdds(e.target.value)}
              />
            </div>
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="Maç ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={applyFilters}>
              <Filter className="h-4 w-4" />
              Filtrele
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 360px)', width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={filteredMatches}
              columnDefs={colDefs}
              defaultColDef={{
                resizable: true,
                suppressHeaderMenuButton: true,
              }}
              animateRows
              pagination
              paginationPageSize={50}
              rowHeight={36}
              headerHeight={32}
              rowSelection="multiple"
              quickFilterText={search}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
