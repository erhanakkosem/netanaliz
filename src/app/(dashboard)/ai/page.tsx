'use client'

import { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Brain, Loader2, AlertCircle, TrendingUp, Target, Activity } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

interface AiPrediction {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  prediction: 'WIN' | 'RISK' | 'PASS'
  confidence: number
  homePercent: number
  drawPercent: number
  awayPercent: number
}

const MOCK_PREDICTIONS: AiPrediction[] = [
  { id: '1', date: '2025-06-14', league: 'Premier Lig', homeTeam: 'Arsenal', awayTeam: 'Chelsea', prediction: 'WIN', confidence: 87, homePercent: 55, drawPercent: 25, awayPercent: 20 },
  { id: '2', date: '2025-06-14', league: 'La Liga', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', prediction: 'RISK', confidence: 62, homePercent: 40, drawPercent: 30, awayPercent: 30 },
  { id: '3', date: '2025-06-14', league: 'Serie A', homeTeam: 'Inter', awayTeam: 'Milan', prediction: 'WIN', confidence: 82, homePercent: 50, drawPercent: 28, awayPercent: 22 },
  { id: '4', date: '2025-06-14', league: 'Bundesliga', homeTeam: 'Bayern', awayTeam: 'Dortmund', prediction: 'PASS', confidence: 35, homePercent: 60, drawPercent: 20, awayPercent: 20 },
  { id: '5', date: '2025-06-13', league: 'Süper Lig', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', prediction: 'WIN', confidence: 91, homePercent: 52, drawPercent: 28, awayPercent: 20 },
  { id: '6', date: '2025-06-13', league: 'Ligue 1', homeTeam: 'PSG', awayTeam: 'Marseille', prediction: 'RISK', confidence: 68, homePercent: 55, drawPercent: 22, awayPercent: 23 },
  { id: '7', date: '2025-06-13', league: 'Premier Lig', homeTeam: 'Liverpool', awayTeam: 'Man City', prediction: 'WIN', confidence: 78, homePercent: 45, drawPercent: 30, awayPercent: 25 },
  { id: '8', date: '2025-06-12', league: 'Serie A', homeTeam: 'Juventus', awayTeam: 'Roma', prediction: 'PASS', confidence: 40, homePercent: 48, drawPercent: 27, awayPercent: 25 },
]

export default function AiPage() {
  const [rowData, setRowData] = useState<AiPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/ai-predictions')
        if (!res.ok) throw new Error('Veri yüklenemedi')
        const data = await res.json()
        setRowData(data.predictions ?? [])
      } catch {
        setRowData(MOCK_PREDICTIONS)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = rowData.length > 0
    ? {
        total: rowData.length,
        win: rowData.filter((m) => m.prediction === 'WIN').length,
        risk: rowData.filter((m) => m.prediction === 'RISK').length,
        pass: rowData.filter((m) => m.prediction === 'PASS').length,
        avgConfidence: Math.round(rowData.reduce((s, m) => s + m.confidence, 0) / rowData.length),
      }
    : null

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 135, sortable: true },
    { headerName: 'Deplasman', field: 'awayTeam', width: 135, sortable: true },
    {
      headerName: 'Yapay Zeka',
      field: 'prediction',
      width: 110,
      sortable: true,
      cellRenderer: (p: any) => {
        const variant = p.value === 'WIN' ? 'success' : p.value === 'RISK' ? 'warning' : 'destructive'
        return <Badge variant={variant} className="text-xs font-semibold">{p.value}</Badge>
      },
    },
    {
      headerName: 'Güven %',
      field: 'confidence',
      width: 100,
      sortable: true,
      cellRenderer: (p: any) => {
        const color = p.value >= 80 ? '#10b981' : p.value >= 60 ? '#f59e0b' : '#ef4444'
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${p.value}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-muted">{p.value}%</span>
          </div>
        )
      },
    },
    { headerName: 'Ev %', field: 'homePercent', width: 80, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'Beraberlik %', field: 'drawPercent', width: 80, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'Deplasman %', field: 'awayPercent', width: 80, sortable: true, cellStyle: { textAlign: 'center' } as any },
  ]

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
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Yapay Zeka Tahminleri</h1>
        <p className="mt-1 text-sm text-muted">
          Gelişmiş yapay zeka algoritmalarıyla maç tahminleri ve olasılık hesaplamaları.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Toplam</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">WIN</CardTitle>
              <Target className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{stats.win}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">RISK</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{stats.risk}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Ort. Güven</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.avgConfidence}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 400px)', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
                animateRows
                pagination
                paginationPageSize={50}
                rowHeight={36}
                headerHeight={32}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
