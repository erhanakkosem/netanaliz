'use client'

import { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Calendar, Filter, Loader2, AlertCircle } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

interface BasketballMatch {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  odds1: number
  oddsX: number
  odds2: number
  handicap: string
  overUnder: string
  result: '1' | 'X' | '2'
  prediction: '1' | 'X' | '2'
}

const LEAGUES = ['NBA', 'EuroLeague', 'TBL', 'ACB', 'VTB']

const MOCK_DATA: BasketballMatch[] = [
  { id: '1', date: '2025-06-13', league: 'NBA', homeTeam: 'Lakers', awayTeam: 'Celtics', odds1: 1.85, oddsX: 8.5, odds2: 1.95, handicap: '-3.5', overUnder: 'O 218.5', result: '1', prediction: '1' },
  { id: '2', date: '2025-06-13', league: 'EuroLeague', homeTeam: 'Fenerbahçe', awayTeam: 'Efes', odds1: 1.72, oddsX: 7.5, odds2: 2.10, handicap: '+2.5', overUnder: 'U 162.5', result: '2', prediction: '1' },
  { id: '3', date: '2025-06-12', league: 'NBA', homeTeam: 'Warriors', awayTeam: 'Bucks', odds1: 2.10, oddsX: 9.0, odds2: 1.75, handicap: '-5.5', overUnder: 'O 224.5', result: '1', prediction: '1' },
  { id: '4', date: '2025-06-12', league: 'EuroLeague', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', odds1: 1.65, oddsX: 7.0, odds2: 2.25, handicap: '+1.5', overUnder: 'U 158.5', result: 'X', prediction: '2' },
  { id: '5', date: '2025-06-11', league: 'TBL', homeTeam: 'Anadolu Efes', awayTeam: 'Galatasaray', odds1: 1.55, oddsX: 8.0, odds2: 2.40, handicap: '-6.5', overUnder: 'O 172.5', result: '1', prediction: '1' },
  { id: '6', date: '2025-06-10', league: 'NBA', homeTeam: 'Nuggets', awayTeam: 'Thunder', odds1: 2.20, oddsX: 8.5, odds2: 1.68, handicap: '+4.5', overUnder: 'U 220.5', result: '2', prediction: '2' },
]

export default function BasketballPage() {
  const gridRef = useRef<AgGridReact>(null)
  const [rowData, setRowData] = useState<BasketballMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedLeague, setSelectedLeague] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/basketball')
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

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 135, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Deplasman', field: 'awayTeam', width: 135, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: '1', field: 'odds1', width: 75, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'X', field: 'oddsX', width: 75, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: '2', field: 'odds2', width: 75, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'Handikap', field: 'handicap', width: 100, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'Alt/Üst', field: 'overUnder', width: 100, sortable: true, cellStyle: { textAlign: 'center' } as any },
    {
      headerName: 'Sonuç', field: 'result', width: 80, sortable: true,
      cellRenderer: (p: any) => {
        const isCorrect = p.data.prediction === p.data.result
        return <Badge variant={isCorrect ? 'success' : 'destructive'}>{p.value}</Badge>
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
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Basketbol Analiz</h1>
        <p className="mt-1 text-sm text-muted">
          Basketbol maç oranlarını ve sonuçlarını görüntüleyin.
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
                defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
                getRowClass={getRowClass}
                animateRows
                pagination
                paginationPageSize={50}
                rowHeight={36}
                headerHeight={32}
                quickFilterText={search}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
