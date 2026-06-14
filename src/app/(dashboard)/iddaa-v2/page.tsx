'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Loader2 } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

ModuleRegistry.registerModules([AllCommunityModule])

interface IddaaV2Match {
  id: string; date: string; homeTeam: string; awayTeam: string
  iy1: number; iyx: number; iy2: number; ms1: number; msx: number; ms2: number; result: string
}

const MOCK: IddaaV2Match[] = Array.from({ length: 80 }, (_, i) => ({
  id: String(i + 1),
  date: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  homeTeam: ['Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzon', 'Başakşehir', 'Adana'][i % 6],
  awayTeam: ['Samsun', 'Antalya', 'Konya', 'Alanya', 'Kayseri', 'Sivas'][(i + 2) % 6],
  iy1: Number((1.2 + Math.random() * 1.5).toFixed(2)),
  iyx: Number((1.5 + Math.random() * 1.2).toFixed(2)),
  iy2: Number((1.8 + Math.random() * 2).toFixed(2)),
  ms1: Number((1.5 + Math.random() * 2).toFixed(2)),
  msx: Number((2.5 + Math.random() * 1.5).toFixed(2)),
  ms2: Number((2.0 + Math.random() * 2.5).toFixed(2)),
  result: ['1', 'X', '2'][i % 3],
}))

export default function IddaaV2Page() {
  const gridRef = useRef<AgGridReact>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [rowData] = useState<IddaaV2Match[]>(MOCK)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])
  const onFilter = useCallback(() => gridRef.current?.api.setGridOption('quickFilterText', search), [search])

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 140, sortable: true },
    { headerName: 'Deplasman', field: 'awayTeam', width: 140, sortable: true },
    { headerName: 'İY1', field: 'iy1', width: 70, sortable: true, cellClass: 'text-green-400' },
    { headerName: 'İYX', field: 'iyx', width: 70, sortable: true, cellClass: 'text-yellow-400' },
    { headerName: 'İY2', field: 'iy2', width: 70, sortable: true, cellClass: 'text-red-400' },
    { headerName: 'MS1', field: 'ms1', width: 70, sortable: true, cellClass: 'text-green-400' },
    { headerName: 'MSX', field: 'msx', width: 70, sortable: true, cellClass: 'text-yellow-400' },
    { headerName: 'MS2', field: 'ms2', width: 70, sortable: true, cellClass: 'text-red-400' },
    { headerName: 'Sonuç', field: 'result', width: 70, sortable: true },
  ]

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">İddaa V2 Analizi</h1>
        <p className="text-sm text-muted">İddaa V2 maç analizi — İY + MS detaylı oran karşılaştırması</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg text-foreground">İddaa V2 Maçları</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input placeholder="Maç ara..." value={search} onChange={(e) => setSearch(e.target.value)} onInput={onFilter} className="w-48 bg-background pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="ag-theme-alpine-dark h-[600px] w-full">
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={colDefs} defaultColDef={{ resizable: true }} pagination={true} paginationPageSize={25} theme="legacy" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
