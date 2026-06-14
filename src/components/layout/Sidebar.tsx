'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Archive,
  Brain,
  Flag,
  TrendingDown,
  DollarSign,
  Bot,
  FileSearch,
  Radio,
  Ticket,
  BarChart3,
  Crown,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard/archive', label: 'Arşiv', icon: Archive },
  { href: '/dashboard/smart', label: 'Akıllı Analiz', icon: Brain },
  { href: '/dashboard/iddaa', label: 'İddaa Analiz', icon: Flag },
  { href: '/dashboard/dropping-odds', label: 'Dropping Odds', icon: TrendingDown },
  { href: '/dashboard/money-movement', label: 'Para Hareketleri', icon: DollarSign },
  { href: '/dashboard/ai', label: 'Yapay Zeka', icon: Bot },
  { href: '/dashboard/bulletin', label: 'Bülten Tarama', icon: FileSearch },
  { href: '/dashboard/live', label: 'Canlı Maçlar', icon: Radio },
  { href: '/dashboard/coupons', label: 'KuponX', icon: Ticket },
  { href: '/dashboard/statistics', label: 'İstatistikler', icon: BarChart3 },
  { href: '/dashboard/pricing', label: 'Fiyatlar', icon: Crown },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-[#0d1117] p-2 text-gray-400 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0d1117] border-r border-gray-800 transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Oran<span className="text-emerald-500">Analiz</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#1f2937] text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-emerald-400')} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {session?.user?.name || 'Kullanıcı'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-gray-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  )
}
