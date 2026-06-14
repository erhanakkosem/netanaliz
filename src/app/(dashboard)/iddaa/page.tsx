'use client'

import { useState, useEffect, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

ModuleRegistry.registerModules([AllCommunityModule])

interface IddaaMatch {
  id: string
  date: string
  league: string
  homeTeam: string
  awayTeam: string
  iddaaCode: string
  ms1: number
  msx: number
  ms2: number
  result: '1' | 'X' | '2' | ''
  version: 'V1' | 'V2'
}

function generateMockIddaaData(version: 'V1' | 'V2'): IddaaMatch[] {
  const leagues = ['Süper Lig', '1. Lig', 'Premier Lig', 'La Liga', 'Serie A']
  const teams: [string, string][] = [
    ['Galatasaray', 'Fenerbahçe'], ['Beşiktaş', 'Trabzonspor'], ['Başakşehir', 'Sivasspor'],
    ['Arsenal', 'Chelsea'], ['Barcelona', 'Real Madrid'], ['Inter', 'Milan'],
    ['Bayern', 'Dortmund'], ['PSG', 'Marseille'], ['Liverpool', 'Man City'], ['Juventus', 'Roma'],
  ]
  const results: ('1' | 'X' | '2' | '')[] = ['1', 'X', '2', '', '1', 'X', '2', '', '1', 'X']
  const prefix = version === 'V1' ? '1' : '2'
  return teams.map(([home, away], i) => ({
    id: `${version}-${i}`,
    date: `2025-06-${String(i + 12).padStart(2, '0')}`,
    league: leagues[i % leagues.length],
    homeTeam: home,
    awayTeam: away,
    iddaaCode: `${prefix}${String(1000 + i)}`,
    ms1: Math.round((1.5 + Math.random() * 4) * 100) / 100,
    msx: Math.round((2.5 + Math.random() * 3) * 100) / 100,
    ms2: Math.round((2.0 + Math.random() * 5) * 100) / 100,
    result: results[i % results.length],
    version,
  }))
}

export default function IddaaPage() {
  const [activeTab, setActiveTab] = useState('v1')
  const [searchV1, setSearchV1] = useState('')
  const [searchV2, setSearchV2] = useState('')
  const [dataV1] = useState<IddaaMatch[]>(() => generateMockIddaaData('V1'))
  const [dataV2] = useState<IddaaMatch[]>(() => generateMockIddaaData('V2'))

  const colDefs: ColDef[] = [
    { headerName: 'Tarih', field: 'date', width: 100, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Lig', field: 'league', width: 120, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Ev Sahibi', field: 'homeTeam', width: 135, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Deplasman', field: 'awayTeam', width: 135, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'İddaa Kodu', field: 'iddaaCode', width: 110, sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'MS1', field: 'ms1', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'MSX', field: 'msx', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
    { headerName: 'MS2', field: 'ms2', width: 85, sortable: true, cellStyle: { textAlign: 'center' } as any },
    {
      headerName: 'Sonuç', field: 'result', width: 90, sortable: true,
      cellRenderer: (p: any) => {
        if (!p.value) return <span className="text-muted">-</span>
        return <Badge variant={p.value === '1' ? 'success' : p.value === '2' ? 'destructive' : 'warning'}>{p.value}</Badge>
      },
    },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">İddaa Analiz</h1>
        <p className="mt-1 text-sm text-muted">
          İddaa maç oranlarını ve sonuçlarını görüntüleyin.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="v1">İddaa V1</TabsTrigger>
          <TabsTrigger value="v2">İddaa V2</TabsTrigger>
        </TabsList>

        <TabsContent value="v1" className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  placeholder="Maç ara..."
                  value={searchV1}
                  onChange={(e) => setSearchV1(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 320px)', width: '100%' }}>
                <AgGridReact
                  rowData={dataV1}
                  columnDefs={colDefs}
                  defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
                  animateRows
                  pagination
                  paginationPageSize={50}
                  rowHeight={36}
                  headerHeight={32}
                  quickFilterText={searchV1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="v2" className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  placeholder="Maç ara..."
                  value={searchV2}
                  onChange={(e) => setSearchV2(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <div className="ag-theme-alpine-dark" style={{ height: 'calc(100vh - 320px)', width: '100%' }}>
                <AgGridReact
                  rowData={dataV2}
                  columnDefs={colDefs}
                  defaultColDef={{ resizable: true, suppressHeaderMenuButton: true }}
                  animateRows
                  pagination
                  paginationPageSize={50}
                  rowHeight={36}
                  headerHeight={32}
                  quickFilterText={searchV2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
