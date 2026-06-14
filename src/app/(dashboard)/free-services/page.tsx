'use client'

import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { Loader2, BarChart3, TrendingUp, Activity, Zap } from 'lucide-react'
import type { ColDef } from 'ag-grid-community'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

ModuleRegistry.registerModules([AllCommunityModule])

interface ServiceStat {
  id: string; service: string; today: number; week: number; month: number; total: number; status: string
}

const MOCK: ServiceStat[] = [
  { id: '1', service: 'Oran Arşivi', today: 12450, week: 78200, month: 345000, total: 6200000, status: 'Aktif' },
  { id: '2', service: 'Smart Analiz', today: 8920, week: 56100, month: 256000, total: 4100000, status: 'Aktif' },
  { id: '3', service: 'Dropping Odds', today: 15670, week: 92300, month: 412000, total: 5800000, status: 'Aktif' },
  { id: '4', service: 'Yapay Zeka', today: 6780, week: 44500, month: 198000, total: 2900000, status: 'Aktif' },
  { id: '5', service: 'Bülten Tarama', today: 3450, week: 22300, month: 98700, total: 1500000, status: 'Aktif' },
  { id: '6', service: 'KuponX', today: 2340, week: 15600, month: 67800, total: 890000, status: 'Aktif' },
]

const colDefs: ColDef[] = [
  { headerName: 'Servis', field: 'service', width: 150, sortable: true },
  { headerName: 'Bugün', field: 'today', width: 120, sortable: true, cellRenderer: (p: { value: number }) => p.value.toLocaleString() },
  { headerName: 'Bu Hafta', field: 'week', width: 120, sortable: true, cellRenderer: (p: { value: number }) => p.value.toLocaleString() },
  { headerName: 'Bu Ay', field: 'month', width: 120, sortable: true, cellRenderer: (p: { value: number }) => p.value.toLocaleString() },
  { headerName: 'Toplam', field: 'total', width: 120, sortable: true, cellRenderer: (p: { value: number }) => p.value.toLocaleString() },
  { headerName: 'Durum', field: 'status', width: 100, cellRenderer: (p: { value: string }) => <Badge className="bg-green-600">{p.value}</Badge> },
]

export default function FreeServicesPage() {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ücretsiz Servisler</h1>
        <p className="text-sm text-muted">Tüm servislerin genel istatistikleri ve kullanım durumu</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium text-muted"><BarChart3 className="h-4 w-4"/> Bugün</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-foreground">{MOCK.reduce((a, s) => a + s.today, 0).toLocaleString()}</p></CardContent></Card>
        <Card className="border-border bg-card"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium text-muted"><Activity className="h-4 w-4"/> Haftalık</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-foreground">{MOCK.reduce((a, s) => a + s.week, 0).toLocaleString()}</p></CardContent></Card>
        <Card className="border-border bg-card"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium text-muted"><TrendingUp className="h-4 w-4"/> Aylık</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-foreground">{MOCK.reduce((a, s) => a + s.month, 0).toLocaleString()}</p></CardContent></Card>
        <Card className="border-border bg-card"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium text-muted"><Zap className="h-4 w-4"/> Toplam</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-foreground">{MOCK.reduce((a, s) => a + s.total, 0).toLocaleString()}</p></CardContent></Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-lg text-foreground">Servis İstatistikleri</CardTitle></CardHeader>
        <CardContent>
          <div className="ag-theme-alpine-dark h-[400px] w-full">
            <AgGridReact rowData={MOCK} columnDefs={colDefs} defaultColDef={{ resizable: true }} pagination={false} theme="legacy" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
