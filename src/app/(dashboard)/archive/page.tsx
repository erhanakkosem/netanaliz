'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Calendar, Filter, Loader2, AlertCircle } from 'lucide-react'
import type { ColDef, ColGroupDef } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

interface ArchiveMatch {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  result: '1' | 'X' | '2'
  prediction: '1' | 'X' | '2'
  openingOdds: Record<string, { MS1: number; MSX: number; MS2: number }>
  closingOdds: Record<string, { MS1: number; MSX: number; MS2: number }>
  difference: { MS1: string; MSX: string; MS2: string }
}

const BOOKMAKERS = ['Bet365', 'Pinnacle', 'Betfair', 'Bwin', 'Unibet']
const LEAGUES = ['Premier Lig', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Süper Lig']

const MOCK_DATA: ArchiveMatch[] = [
  {
    id: '1', date: '2025-06-13', league: 'Premier Lig', homeTeam: 'Arsenal', awayTeam: 'Chelsea',
    result: '1', prediction: '1',
    openingOdds: { Bet365: { MS1: 2.1, MSX: 3.4, MS2: 3.8 }, Pinnacle: { MS1: 2.05, MSX: 3.5, MS2: 3.9 }, Betfair: { MS1: 2.08, MSX: 3.45, MS2: 3.85 }, Bwin: { MS1: 2.12, MSX: 3.38, MS2: 3.82 }, Unibet: { MS1: 2.09, MSX: 3.42, MS2: 3.87 } },
    closingOdds: { Bet365: { MS1: 1.95, MSX: 3.6, MS2: 4.1 }, Pinnacle: { MS1: 1.92, MSX: 3.65, MS2: 4.2 }, Betfair: { MS1: 1.94, MSX: 3.62, MS2: 4.15 }, Bwin: { MS1: 1.96, MSX: 3.58, MS2: 4.12 }, Unibet: { MS1: 1.93, MSX: 3.63, MS2: 4.18 } },
    difference: { MS1: '-0.15', MSX: '+0.20', MS2: '+0.30' },
  },
  {
    id: '2', date: '2025-06-13', league: 'La Liga', homeTeam: 'Barcelona', awayTeam: 'Real Madrid',
    result: '2', prediction: 'X',
    openingOdds: { Bet365: { MS1: 2.3, MSX: 3.2, MS2: 3.4 }, Pinnacle: { MS1: 2.28, MSX: 3.25, MS2: 3.45 }, Betfair: { MS1: 2.29, MSX: 3.22, MS2: 3.42 }, Bwin: { MS1: 2.32, MSX: 3.18, MS2: 3.38 }, Unibet: { MS1: 2.27, MSX: 3.24, MS2: 3.44 } },
    closingOdds: { Bet365: { MS1: 2.45, MSX: 3.1, MS2: 3.15 }, Pinnacle: { MS1: 2.48, MSX: 3.08, MS2: 3.12 }, Betfair: { MS1: 2.46, MSX: 3.09, MS2: 3.14 }, Bwin: { MS1: 2.5, MSX: 3.06, MS2: 3.1 }, Unibet: { MS1: 2.47, MSX: 3.07, MS2: 3.13 } },
    difference: { MS1: '+0.15', MSX: '-0.12', MS2: '-0.28' },
  },
  {
    id: '3', date: '2025-06-12', league: 'Serie A', homeTeam: 'Inter', awayTeam: 'Milan',
    result: 'X', prediction: 'X',
    openingOdds: { Bet365: { MS1: 2.5, MSX: 3.1, MS2: 3.0 }, Pinnacle: { MS1: 2.48, MSX: 3.15, MS2: 3.05 }, Betfair: { MS1: 2.49, MSX: 3.12, MS2: 3.02 }, Bwin: { MS1: 2.52, MSX: 3.08, MS2: 2.98 }, Unibet: { MS1: 2.47, MSX: 3.14, MS2: 3.04 } },
    closingOdds: { Bet365: { MS1: 2.55, MSX: 3.05, MS2: 2.95 }, Pinnacle: { MS1: 2.52, MSX: 3.1, MS2: 2.98 }, Betfair: { MS1: 2.54, MSX: 3.07, MS2: 2.96 }, Bwin: { MS1: 2.58, MSX: 3.02, MS2: 2.92 }, Unibet: { MS1: 2.53, MSX: 3.08, MS2: 2.97 } },
    difference: { MS1: '+0.05', MSX: '-0.05', MS2: '-0.05' },
  },
  {
    id: '4', date: '2025-06-12', league: 'Bundesliga', homeTeam: 'Bayern', awayTeam: 'Dortmund',
    result: '1', prediction: '2',
    openingOdds: { Bet365: { MS1: 1.8, MSX: 3.8, MS2: 4.2 }, Pinnacle: { MS1: 1.78, MSX: 3.85, MS2: 4.3 }, Betfair: { MS1: 1.79, MSX: 3.82, MS2: 4.25 }, Bwin: { MS1: 1.82, MSX: 3.78, MS2: 4.18 }, Unibet: { MS1: 1.77, MSX: 3.84, MS2: 4.28 } },
    closingOdds: { Bet365: { MS1: 1.72, MSX: 3.9, MS2: 4.5 }, Pinnacle: { MS1: 1.7, MSX: 3.95, MS2: 4.6 }, Betfair: { MS1: 1.71, MSX: 3.92, MS2: 4.55 }, Bwin: { MS1: 1.73, MSX: 3.88, MS2: 4.48 }, Unibet: { MS1: 1.69, MSX: 3.94, MS2: 4.58 } },
    difference: { MS1: '-0.08', MSX: '+0.10', MS2: '+0.30' },
  },
  {
    id: '5', date: '2025-06-11', league: 'Süper Lig', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe',
    result: '1', prediction: '1',
    openingOdds: { Bet365: { MS1: 2.2, MSX: 3.3, MS2: 3.5 }, Pinnacle: { MS1: 2.18, MSX: 3.35, MS2: 3.55 }, Betfair: { MS1: 2.19, MSX: 3.32, MS2: 3.52 }, Bwin: { MS1: 2.22, MSX: 3.28, MS2: 3.48 }, Unibet: { MS1: 2.17, MSX: 3.34, MS2: 3.54 } },
    closingOdds: { Bet365: { MS1: 2.05, MSX: 3.45, MS2: 3.7 }, Pinnacle: { MS1: 2.02, MSX: 3.5, MS2: 3.75 }, Betfair: { MS1: 2.04, MSX: 3.47, MS2: 3.72 }, Bwin: { MS1: 2.06, MSX: 3.43, MS2: 3.68 }, Unibet: { MS1: 2.03, MSX: 3.48, MS2: 3.74 } },
    difference: { MS1: '-0.15', MSX: '+0.15', MS2: '+0.20' },
  },
]

export default function ArchivePage() {
  const gridRef = useRef<AgGridReact>(null)
  const [rowData, setRowData] = useState<ArchiveMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedLeague, setSelectedLeague] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/archive')
        if (!res.ok) throw new Error('Veri yüklenemedi')
        const data = await res.json()
        setRowData(data.matches ?? [])
      } catch {
        setRowData(MOCK_DATA)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const colDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Tarih',
      field: 'date',
      width: 110,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Lig',
      field: 'league',
      width: 130,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Ev Sahibi',
      field: 'homeTeam',
      width: 140,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Deplasman',
      field: 'awayTeam',
      width: 140,
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Açılış',
      children: BOOKMAKERS.flatMap((bm) => [
        { headerName: `${bm} MS1`, field: `openingOdds.${bm}.MS1`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
        { headerName: `${bm} MSX`, field: `openingOdds.${bm}.MSX`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
        { headerName: `${bm} MS2`, field: `openingOdds.${bm}.MS2`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
      ]),
    },
    {
      headerName: 'Kapanış',
      children: BOOKMAKERS.flatMap((bm) => [
        { headerName: `${bm} MS1`, field: `closingOdds.${bm}.MS1`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
        { headerName: `${bm} MSX`, field: `closingOdds.${bm}.MSX`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
        { headerName: `${bm} MS2`, field: `closingOdds.${bm}.MS2`, width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
      ]),
    },
    {
      headerName: 'Fark',
      children: [
        { headerName: 'MS1 Δ', field: 'difference.MS1', width: 85, sortable: true, cellStyle: (params: any) => params.value?.startsWith('+') ? { color: '#10b981', textAlign: 'center' } : { color: '#ef4444', textAlign: 'center' } },
        { headerName: 'MSX Δ', field: 'difference.MSX', width: 85, sortable: true, cellStyle: (params: any) => params.value?.startsWith('+') ? { color: '#10b981', textAlign: 'center' } : { color: '#ef4444', textAlign: 'center' } },
        { headerName: 'MS2 Δ', field: 'difference.MS2', width: 85, sortable: true, cellStyle: (params: any) => params.value?.startsWith('+') ? { color: '#10b981', textAlign: 'center' } : { color: '#ef4444', textAlign: 'center' } },
      ],
    },
    {
      headerName: 'Sonuç',
      field: 'result',
      width: 100,
      sortable: true,
      cellRenderer: (params: any) => {
        const isCorrect = params.data.prediction === params.data.result
        return (
          <Badge variant={isCorrect ? 'success' : 'destructive'} className="text-xs">
            {params.value}
          </Badge>
        )
      },
    },
  ]

  const getRowClass = (params: any) => {
    if (params.data.prediction === params.data.result) return 'bg-emerald-900/20'
    return ''
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-danger" />
          <p className="text-lg font-medium text-foreground">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Tekrar Dene</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Yabancı Büro Arşivi</h1>
        <p className="mt-1 text-sm text-muted">
          Tüm yabancı büro maç oranlarını ve sonuçlarını görüntüleyin.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:w-48">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tümü</option>
                <option value="today">Bugün</option>
                <option value="yesterday">Dün</option>
                <option value="7days">Son 7 Gün</option>
              </select>
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tüm Ligler</option>
                {LEAGUES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 320px)', width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{
                  resizable: true,
                  suppressHeaderMenuButton: true,
                }}
                getRowClass={getRowClass}
                animateRows
                pagination
                paginationPageSize={50}
                domLayout="normal"
                headerHeight={32}
                groupHeaderHeight={32}
                rowHeight={36}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
