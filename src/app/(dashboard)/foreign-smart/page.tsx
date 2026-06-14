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
  { headerName: 'Oran', field: 'odds', width: 80, sortable: true },
  { headerName: 'Tahmin', field: 'prediction', width: 90, sortable: true },
  { headerName: 'Sonuç', field: 'result', width: 80, sortable: true },
  { headerName: 'İsabet', field: 'isHit', width: 80, cellRenderer: (p: { value: boolean }) => p.value ? '✅' : '❌' },
]

const BOOKMAKERS = ['Bet365', 'Pinnacle', 'Betfair', 'Bwin', 'Unibet', '1xBet']

export default function ForeignSmartPage() {
  const [bookmaker, setBookmaker] = useState('Bet365')
  const [oddsType, setOddsType] = useState('MS1')
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [rowData, setRowData] = useState<Record<string, unknown>[]>([])

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
      setRowData(Array.from({ length: 25 }, (_, i) => ({
        date: '2026-06-14',
        league: ['Premier Lig', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'][i % 5],
        homeTeam: `Takım ${i + 1}`, awayTeam: `Rakip ${i + 1}`,
        odds: Number((1.5 + Math.random() * 3).toFixed(2)),
        prediction: oddsType,
        result: ['1', 'X', '2'][i % 3],
        isHit: Math.random() > 0.5,
      })))
      setLoading(false)
      setAnalyzed(true)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Yabancı Smart Analiz</h1>
        <p className="text-sm text-muted">Yabancı ligler için akıllı analiz ve benzer maç bulma</p>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg text-foreground">Analiz Kriterleri</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={bookmaker} onValueChange={setBookmaker}>
                <SelectTrigger className="w-32 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BOOKMAKERS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={oddsType} onValueChange={setOddsType}>
                <SelectTrigger className="w-24 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MS1">MS1</SelectItem>
                  <SelectItem value="MSX">MSX</SelectItem>
                  <SelectItem value="MS2">MS2</SelectItem>
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
              <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={{ resizable: true }} pagination={true} paginationPageSize={25} theme="legacy" />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted">Analiz yapmak için kriterleri seçin ve "Analiz Et" butonuna tıklayın.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
