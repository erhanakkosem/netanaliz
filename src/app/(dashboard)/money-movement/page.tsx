'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for money movement
const mockMovements = [
  { match: 'Galatasaray vs Fenerbahçe', league: 'Süper Lig', market: 'MS1', opening: 1.85, current: 1.65, change: -10.8, volume: '+₺45.2K', direction: 'down' },
  { match: 'Barcelona vs Real Madrid', league: 'La Liga', market: 'MS2', opening: 2.10, current: 2.45, change: +16.7, volume: '+₺32.1K', direction: 'up' },
  { match: 'Bayern vs Dortmund', league: 'Bundesliga', market: 'ÜST 2.5', opening: 1.72, current: 1.58, change: -8.1, volume: '+₺28.7K', direction: 'down' },
  { match: 'Arsenal vs Chelsea', league: 'Premier League', market: 'KG VAR', opening: 1.90, current: 2.05, change: +7.9, volume: '+₺18.3K', direction: 'up' },
  { match: 'Milan vs Inter', league: 'Serie A', market: 'MSX', opening: 3.20, current: 2.85, change: -10.9, volume: '+₺22.4K', direction: 'down' },
]

const chartData = [
  { time: '09:00', bet365: 1.85, pinnacle: 1.88, bwin: 1.82, unibet: 1.90 },
  { time: '10:00', bet365: 1.83, pinnacle: 1.86, bwin: 1.80, unibet: 1.88 },
  { time: '11:00', bet365: 1.80, pinnacle: 1.84, bwin: 1.78, unibet: 1.85 },
  { time: '12:00', bet365: 1.78, pinnacle: 1.82, bwin: 1.75, unibet: 1.83 },
  { time: '13:00', bet365: 1.75, pinnacle: 1.80, bwin: 1.72, unibet: 1.80 },
  { time: '14:00', bet365: 1.72, pinnacle: 1.78, bwin: 1.70, unibet: 1.78 },
  { time: '15:00', bet365: 1.70, pinnacle: 1.76, bwin: 1.68, unibet: 1.75 },
]

export default function MoneyMovementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Money Movement (Para Hareketleri)</h1>
        <p className="text-muted">Büyük paranın nereye aktığını anlık takip edin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted">Bugünkü Hareket</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-danger">-8.3%</p>
            <p className="text-xs text-muted">Ortalama oran düşüşü</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted">En Çok Düşen</CardTitle>
              <TrendingDown className="h-4 w-4 text-danger" />
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted">Maçta ani düşüş</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted">En Çok Yükselen</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted">Maçta ani yükseliş</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted">Hacim</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-bold">₺146K</p>
            <p className="text-xs text-muted">Tahmini işlem hacmi</p>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Oran Hareketi (Galatasaray vs Fenerbahçe - MS1)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[1.65, 1.95]} stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="bet365" stroke="#10b981" strokeWidth={2} dot={false} name="Bet365" />
                <Line type="monotone" dataKey="pinnacle" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Pinnacle" />
                <Line type="monotone" dataKey="bwin" stroke="#f59e0b" strokeWidth={2} dot={false} name="Bwin" />
                <Line type="monotone" dataKey="unibet" stroke="#06b6d4" strokeWidth={2} dot={false} name="Unibet" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Anlık Para Hareketleri</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm text-muted font-medium">Maç</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Lig</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Market</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Açılış</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Güncel</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Değişim</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Hacim</th>
              </tr>
            </thead>
            <tbody>
              {mockMovements.map((m, i) => (
                <tr key={i} className="border-b border-border hover:bg-card-hover">
                  <td className="p-4 text-sm font-medium">{m.match}</td>
                  <td className="p-4 text-sm text-muted">{m.league}</td>
                  <td className="p-4"><Badge variant="outline">{m.market}</Badge></td>
                  <td className="p-4 text-sm">{m.opening.toFixed(2)}</td>
                  <td className="p-4 text-sm font-bold">{m.current.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {m.direction === 'down' ? (
                        <ArrowDownRight className="h-4 w-4 text-danger" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      )}
                      <span className={m.direction === 'down' ? 'text-danger' : 'text-primary'}>
                        {m.change > 0 ? '+' : ''}{m.change}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-warning">{m.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
