'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Filter, Loader2 } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

ModuleRegistry.registerModules([AllCommunityModule])

interface StatAreaMatch {
  id: string; date: string; league: string; homeTeam: string; awayTeam: string
  homeAvg: number; drawAvg: number; awayAvg: number; confidence: number; result: string
}

const MOCK_DATA: StatAreaMatch[] = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  league: ['Premier Lig', 'La Liga', 'Serie A', 'Bundesliga', 'Süper Lig'][i % 5],
  homeTeam: ['Arsenal', 'Barcelona', 'Inter', 'Bayern', 'Galatasaray', 'Liverpool', 'Juventus', 'PSG'][i % 8],
  awayTeam: ['Chelsea', 'Real Madrid', 'Milan', 'Dortmund', 'Fenerbahçe', 'Man City', 'Roma', 'Marseille'][(i + 3) % 8],
  homeAvg: Number((1.5 + Math.random() * 2).toFixed(2)),
  drawAvg: Number((2.5 + Math.random() * 1.5).toFixed(2)),
  awayAvg: Number((2.0 + Math.random() * 2.5).toFixed(2)),
  confidence: Number((50 + Math.random() * 45).toFixed(0)),
  result: ['1', 'X', '2'][i % 3],
}))

export default function StatAreaPage() {
  const gridRef = useRef<AgGridReact>(null)
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('')
  const [loading, setLoading] = useState(true)
  const [rowData] = useState<StatAreaMatch[]>(MOCK_DATA)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current?.api.setGridOption('quickFilterText', search)
  }, [search])

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true, filter: true },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true, filter: true },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 130, sortable: true },
    { headerName: 'Deplasman', field: 'awayTeam', width: 130, sortable: true },
    { headerName: 'Ev Ø', field: 'homeAvg', width: 80, sortable: true, cellClass: 'text-green-400 font-medium' },
    { headerName: 'Ber Ø', field: 'drawAvg', width: 80, sortable: true, cellClass: 'text-yellow-400 font-medium' },
    { headerName: 'Dep Ø', field: 'awayAvg', width: 80, sortable: true, cellClass: 'text-red-400 font-medium' },
    {
      headerName: 'Güven', field: 'confidence', width: 90, sortable: true,
      cellRenderer: (p: { value: number }) => (
        <Badge className={p.value > 75 ? 'bg-green-600' : p.value > 60 ? 'bg-yellow-600' : 'bg-gray-600'}>
          %{p.value}
        </Badge>
      ),
    },
    {
      headerName: 'Sonuç', field: 'result', width: 80, sortable: true,
      cellRenderer: (p: { value: string }) => (
        <span className={p.value === '1' ? 'text-green-400' : p.value === '2' ? 'text-red-400' : 'text-yellow-400'}>
          {p.value === '1' ? '1' : p.value === '2' ? '2' : 'X'}
        </span>
      ),
    },
  ]

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">StatArea Analizi</h1>
        <p className="text-sm text-muted">İstatistiksel ortalama verileriyle maç analizi</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg text-foreground">Tüm Maçlar</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  placeholder="Maç ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onInput={onFilterTextBoxChanged}
                  className="w-48 bg-background pl-9"
                />
              </div>
              <select value={league} onChange={(e) => setLeague(e.target.value)}
                className="flex h-10 w-36 rounded-md border border-zinc-800 bg-background px-3 py-2 text-sm text-foreground">
                <option value="">Tüm Ligler</option>
                <option value="Premier Lig">Premier Lig</option>
                <option value="La Liga">La Liga</option>
                <option value="Serie A">Serie A</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Süper Lig">Süper Lig</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="ag-theme-alpine-dark h-[600px] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
              pagination={true}
              paginationPageSize={25}
              theme="legacy"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
