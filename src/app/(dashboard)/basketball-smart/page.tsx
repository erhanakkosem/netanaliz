'use client'

import { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Brain, Loader2 } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

ModuleRegistry.registerModules([AllCommunityModule])

const colDefs: ColDef[] = [
  { headerName: 'Tarih', field: 'date', width: 100, sortable: true },
  { headerName: 'Lig', field: 'league', width: 120, sortable: true },
  { headerName: 'Ev Sahibi', field: 'homeTeam', width: 140, sortable: true },
  { headerName: 'Deplasman', field: 'awayTeam', width: 140, sortable: true },
  { headerName: 'Toplam', field: 'total', width: 80, sortable: true },
  { headerName: 'Tahmin', field: 'prediction', width: 90, sortable: true },
  { headerName: 'Sonuç', field: 'result', width: 80, sortable: true },
  { headerName: 'İsabet', field: 'isHit', width: 80, cellRenderer: (p: { value: boolean }) => p.value ? '✅' : '❌' },
]

export default function BasketballSmartPage() {
  const [oddsType, setOddsType] = useState('MS1')
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [rowData, setRowData] = useState<Record<string, unknown>[]>([])

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
      setRowData(Array.from({ length: 20 }, (_, i) => ({
        date: '2026-06-14',
        league: ['NBA', 'EuroLeague', 'BSL', 'ACB'][i % 4],
        homeTeam: `Team ${i + 1}`, awayTeam: `Team ${20 - i}`,
        total: Number((150 + Math.random() * 50).toFixed(0)),
        prediction: ['1', '2'][i % 2],
        result: ['1', '2'][i % 2],
        isHit: Math.random() > 0.5,
      })))
      setLoading(false)
      setAnalyzed(true)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Basketbol Smart Analiz</h1>
        <p className="text-sm text-muted">Basketbol maçları için akıllı analiz ve benzer maç bulma</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg text-foreground">Analiz Kriterleri</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={oddsType} onValueChange={setOddsType}>
                <SelectTrigger className="w-36 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MS1">Ev/Galibiyet</SelectItem>
                  <SelectItem value="MS2">Dep/Galibiyet</SelectItem>
                  <SelectItem value="O165">Over 165</SelectItem>
                  <SelectItem value="U165">Under 165</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Analiz Et
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {analyzed ? (
            <div className="ag-theme-alpine-dark h-[500px] w-full">
              <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={{ resizable: true }} pagination={true} paginationPageSize={20} theme="legacy" />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted">Analiz yapmak için "Analiz Et" butonuna tıklayın.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
