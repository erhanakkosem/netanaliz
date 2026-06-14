'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Link from 'next/link'


interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  matchDate: string
  status: string
}

export default function DailyListPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/archive')
      .then(res => res.json())
      .then(data => {
        setMatches(data.matches || data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = matches.filter(m =>
    m.homeTeam?.toLowerCase().includes(search.toLowerCase()) ||
    m.awayTeam?.toLowerCase().includes(search.toLowerCase()) ||
    m.league?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Daily List</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search matches..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-gray-800 bg-gray-900/50 p-8 text-center">
          <p className="text-gray-400">{search ? 'No matches found' : 'No matches available'}</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(match => (
            <Link key={match.id} href={`/archive?id=${match.id}`}>
              <Card className="border-gray-800 bg-gray-900/50 p-4 transition-colors hover:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-emerald-400">{match.league}</p>
                    <p className="text-sm font-medium text-white">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {match.matchDate ? new Date(match.matchDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
