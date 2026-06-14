'use client'

import { useState, useEffect } from 'react'
import { Radio, Clock, Activity, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface LiveMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  minute: number
  league: string
  events: string[]
  oddsHistory: { minute: number; home: number; draw: number; away: number }[]
}

const MOCK_MATCHES: LiveMatch[] = [
  {
    id: '1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 2, awayScore: 1, minute: 72,
    league: 'Premier Lig', events: ['Saka 23\'', 'Havertz 45\'', 'Palmer 68\''],
    oddsHistory: [
      { minute: 0, home: 2.1, draw: 3.4, away: 3.8 },
      { minute: 15, home: 2.05, draw: 3.5, away: 3.9 },
      { minute: 30, home: 1.95, draw: 3.6, away: 4.1 },
      { minute: 45, home: 1.85, draw: 3.7, away: 4.3 },
      { minute: 60, home: 1.75, draw: 3.8, away: 4.6 },
      { minute: 75, home: 1.65, draw: 3.9, away: 4.9 },
    ],
  },
  {
    id: '2', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', homeScore: 1, awayScore: 1, minute: 55,
    league: 'La Liga', events: ['Vinicius 32\'', 'Lewandowski 48\''],
    oddsHistory: [
      { minute: 0, home: 2.3, draw: 3.2, away: 3.4 },
      { minute: 15, home: 2.25, draw: 3.25, away: 3.45 },
      { minute: 30, home: 2.35, draw: 3.15, away: 3.3 },
      { minute: 45, home: 2.5, draw: 3.1, away: 3.15 },
      { minute: 55, home: 2.6, draw: 3.05, away: 3.05 },
    ],
  },
  {
    id: '3', homeTeam: 'Inter', awayTeam: 'Milan', homeScore: 0, awayScore: 0, minute: 34,
    league: 'Serie A', events: ['Kırmızı Kart: Theo 28\''],
    oddsHistory: [
      { minute: 0, home: 2.5, draw: 3.1, away: 3.0 },
      { minute: 15, home: 2.45, draw: 3.15, away: 3.05 },
      { minute: 30, home: 2.7, draw: 3.0, away: 2.85 },
    ],
  },
  {
    id: '4', homeTeam: 'Bayern', awayTeam: 'Dortmund', homeScore: 3, awayScore: 0, minute: 80,
    league: 'Bundesliga', events: ['Kane 12\'', 'Musiala 44\'', 'Kane 67\''],
    oddsHistory: [
      { minute: 0, home: 1.8, draw: 3.8, away: 4.2 },
      { minute: 15, home: 1.75, draw: 3.85, away: 4.3 },
      { minute: 30, home: 1.65, draw: 3.9, away: 4.5 },
      { minute: 45, home: 1.55, draw: 4.0, away: 4.8 },
      { minute: 60, home: 1.45, draw: 4.2, away: 5.2 },
      { minute: 75, home: 1.35, draw: 4.4, away: 5.6 },
    ],
  },
  {
    id: '5', homeTeam: 'PSG', awayTeam: 'Marseille', homeScore: 2, awayScore: 2, minute: 67,
    league: 'Ligue 1', events: ['Mbappe 15\'', 'Aubameyang 30\'', 'Mbappe 55\'', 'Harit 62\''],
    oddsHistory: [
      { minute: 0, home: 1.9, draw: 3.5, away: 4.0 },
      { minute: 15, home: 1.85, draw: 3.6, away: 4.1 },
      { minute: 30, home: 2.0, draw: 3.4, away: 3.8 },
      { minute: 45, home: 2.1, draw: 3.35, away: 3.7 },
      { minute: 60, home: 2.2, draw: 3.3, away: 3.6 },
    ],
  },
  {
    id: '6', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', homeScore: 1, awayScore: 2, minute: 90,
    league: 'Süper Lig', events: ['Icardi 10\'', 'Tadic 40\'', 'Fred 85\''],
    oddsHistory: [
      { minute: 0, home: 2.2, draw: 3.3, away: 3.5 },
      { minute: 15, home: 2.15, draw: 3.35, away: 3.55 },
      { minute: 30, home: 2.3, draw: 3.2, away: 3.4 },
      { minute: 45, home: 2.5, draw: 3.1, away: 3.2 },
      { minute: 60, home: 2.7, draw: 3.0, away: 3.0 },
      { minute: 75, home: 3.0, draw: 2.9, away: 2.8 },
      { minute: 90, home: 3.5, draw: 2.8, away: 2.6 },
    ],
  },
]

export default function InPlayPage() {
  const [matches, setMatches] = useState<LiveMatch[]>(MOCK_MATCHES)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev =>
        prev.map(m => ({
          ...m,
          minute: Math.min(m.minute + 1, 90),
        }))
      )
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const selected = matches.find(m => m.id === selectedMatch)

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Canlı Maçlar (İnPlay)</h1>
        <p className="mt-1 text-sm text-muted">
          Canlı maçları gerçek zamanlı olarak takip edin, oran hareketlerini izleyin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <Card
            key={match.id}
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              selectedMatch === match.id && 'border-primary',
            )}
            onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-danger" />
                <CardTitle className="text-sm font-medium">{match.league}</CardTitle>
              </div>
              <Badge variant="destructive" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {match.minute}&apos;
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={cn(
                    'text-sm font-semibold',
                    match.homeScore > match.awayScore && 'text-primary',
                  )}>
                    {match.homeTeam}
                  </p>
                </div>
                <div className="mx-4 flex items-center gap-3">
                  <span className="text-2xl font-bold text-foreground">{match.homeScore}</span>
                  <span className="text-sm text-muted">-</span>
                  <span className="text-2xl font-bold text-foreground">{match.awayScore}</span>
                </div>
                <div className="flex-1 text-right">
                  <p className={cn(
                    'text-sm font-semibold',
                    match.awayScore > match.homeScore && 'text-primary',
                  )}>
                    {match.awayTeam}
                  </p>
                </div>
              </div>
              {match.events.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {match.events.map((event, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full bg-card-hover px-2 py-0.5 text-xs text-muted">
                      <Activity className="h-3 w-3" />
                      {event}
                    </span>
                  ))}
                </div>
              )}
              {selectedMatch === match.id && selected && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-1 text-xs text-muted">
                    <Zap className="h-3 w-3" />
                    Oran Hareketleri
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={match.oddsHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="minute" stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${v}'`} />
                        <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                          labelStyle={{ color: '#e5e7eb' }}
                        />
                        <Line type="monotone" dataKey="home" stroke="#10b981" strokeWidth={1.5} dot={false} name="Ev" />
                        <Line type="monotone" dataKey="draw" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Beraberlik" />
                        <Line type="monotone" dataKey="away" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Deplasman" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
