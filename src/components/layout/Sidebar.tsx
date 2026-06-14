'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Archive, Brain, Flag, TrendingDown, DollarSign, Bot, FileSearch, Radio,
  Ticket, Crown, Menu, X, LogOut, User, Settings, BarChart3, Shield,
  ChevronDown, Activity,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavItem {
  href?: string; label: string; icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Ana Sayfa', icon: Activity },
  { href: '/free-services', label: 'Ücretsiz Servisler', icon: Shield },
  { href: '/ai', label: 'Yapay Zeka', icon: Bot },
  { href: '/pricing', label: 'Fiyatlar', icon: Crown },
  { href: '/bulletin', label: 'Bülten Tarama', icon: FileSearch },
  { href: '/inplay', label: 'Radar', icon: Radio },
  { label: 'Arşiv', icon: Archive, children: [
    { href: '/archive', label: 'Yabancı Arşiv' },
    { label: 'İddaa', icon: Flag, children: [
      { href: '/iddaa-v1', label: 'İddaa V1' },
      { href: '/iddaa-v2', label: 'İddaa V2' },
    ]},
    { href: '/basketball', label: 'Basketbol' },
    { href: '/statarea', label: 'StatArea' },
  ]},
  { label: 'Smart Analiz', icon: Brain, children: [
    { href: '/smart', label: 'Yabancı Smart' },
    { href: '/iddaa-v1-smart', label: 'İddaa V1 Smart' },
    { href: '/iddaa-v2-smart', label: 'İddaa V2 Smart' },
    { href: '/basketball-smart', label: 'Basketbol Smart' },
  ]},
  { href: '/dropping-odds', label: 'Dropping Odds', icon: TrendingDown },
  { href: '/money-movement', label: 'Para Hareketleri', icon: DollarSign },
  { href: '/coupons', label: 'KuponX', icon: Ticket },
  { href: '/profile', label: 'Profil', icon: User },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
  { href: '/admin', label: 'Admin', icon: Shield },
]

function SidebarItem({ item, depth = 0, onClose }: { item: NavItem; depth?: number; onClose: () => void }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    const anyActive = item.children ? item.children.some(c =>
      c.href === pathname || (c.children ? c.children.some(ch => ch.href === pathname) : false)
    ) : false
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            anyActive
              ? 'bg-[#1f2937] text-emerald-400'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
          )}
        >
          {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>
        {open && item.children && (
          <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
            {item.children.map((child) => (
              <SidebarItem key={child.label} item={child} depth={depth + 1} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const active = pathname === item.href
  if (!item.href) return null
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-[#1f2937] text-emerald-400'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
      )}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
      {item.label}
    </Link>
  )
}

export default function Sidebar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

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
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeMobile} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0d1117] border-r border-gray-800 transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <Link href="/archive" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingDown className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Oran<span className="text-emerald-500">Analiz</span>
            </span>
          </Link>
          <button
            onClick={closeMobile}
            className="rounded-lg p-1 text-gray-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.label} item={item} onClose={closeMobile} />
          ))}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {session?.user?.name || 'Kullanıcı'}
              </p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email || ''}</p>
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
