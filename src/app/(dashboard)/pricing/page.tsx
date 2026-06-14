'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check, Zap, Gem, Crown, Star, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { PACKAGES } from '@/lib/constants'
import { toast } from '@/components/ui/toast'

const PACKAGE_ICONS: Record<string, React.ReactNode> = {
  JET: <Zap className="h-6 w-6 text-amber-400" />,
  STANDARD: <Gem className="h-6 w-6 text-blue-400" />,
  PREMIUM: <Crown className="h-6 w-6 text-emerald-400" />,
  ELITE: <Star className="h-6 w-6 text-purple-400" />,
}

const PACKAGE_COLORS: Record<string, string> = {
  JET: 'border-amber-500/30',
  STANDARD: 'border-blue-500/30',
  PREMIUM: 'border-emerald-500/30',
  ELITE: 'border-purple-500/30',
}

const PACKAGE_GLOWS: Record<string, string> = {
  JET: 'shadow-amber-500/10',
  STANDARD: 'shadow-blue-500/10',
  PREMIUM: 'shadow-emerald-500/20',
  ELITE: 'shadow-purple-500/10',
}

export default function PricingPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState<string | null>(null)
  const [activeSubscription, setActiveSubscription] = useState<{ packageType: string; endDate: string } | null>(null)

  const activePackageId = activeSubscription?.packageType ?? null
  const currentEndDate = activeSubscription?.endDate ?? null

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({ title: 'Ödeme başarılı', description: 'Paketiniz aktifleştirildi!', variant: 'success' })
      router.replace('/pricing')
    } else if (searchParams.get('canceled') === 'true') {
      toast({ title: 'Ödeme iptal edildi', description: 'Herhangi bir ücret alınmadı.', variant: 'warning' })
      router.replace('/pricing')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/payments')
        .then(r => r.json())
        .then(data => {
          if (data.subscription?.isActive) {
            setActiveSubscription(data.subscription)
            setPurchased(data.subscription.packageType)
          }
        })
        .catch(() => {})
    }
  }, [session])

  const handlePurchase = async () => {
    if (!selectedPackage) return
    setPurchasing(true)
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType: selectedPackage }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 400 && data.error === 'Payment not configured for this package') {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setPurchased(selectedPackage)
          return
        }
        throw new Error(data.error || 'Payment failed')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast({ title: 'Hata', description: 'Ödeme başlatılamadı. Lütfen tekrar deneyin.', variant: 'destructive' })
    } finally {
      setPurchasing(false)
      setSelectedPackage(null)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Paketlerimiz</h1>
        <p className="mt-2 text-sm text-muted">
          Size en uygun paketi seçin, premium ayrıcalıkların tadını çıkarın.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PACKAGES.map((pkg) => {
          const isActive = activePackageId === pkg.id
          const isRecommended = pkg.id === 'PREMIUM'
          const isPurchased = purchased === pkg.id

          return (
            <Card
              key={pkg.id}
              className={cn(
                'relative flex flex-col transition-all hover:scale-[1.02]',
                PACKAGE_COLORS[pkg.id],
                PACKAGE_GLOWS[pkg.id],
                isPurchased && 'scale-[1.02] border-primary shadow-lg shadow-primary/20',
                isActive && 'ring-2 ring-primary',
              )}
            >
              {isRecommended && !isActive && !isPurchased && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success" className="px-3 py-1 text-xs font-semibold">
                    Önerilen
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4 text-center">
                <div className="mb-2 flex justify-center">{PACKAGE_ICONS[pkg.id]}</div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription>{pkg.duration} gün</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="mb-4 text-center">
                  <span className="text-3xl font-bold text-foreground">{pkg.price.toLocaleString('tr-TR')} ₺</span>
                </div>
                <ul className="mb-6 flex-1 space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isPurchased ? 'outline' : isRecommended ? 'default' : 'outline'}
                  className={cn('w-full', isPurchased && 'border-primary text-primary')}
                  onClick={() => {
                    if (!session) {
                      router.push('/login')
                      return
                    }
                    if (!isPurchased) setSelectedPackage(pkg.id)
                  }}
                  disabled={isPurchased}
                >
                  {isPurchased ? 'Aktif Paketiniz' : isActive ? 'Mevcut Paket' : 'Satın Al'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedPackage} onOpenChange={(o) => !o && setSelectedPackage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Satın Almayı Onayla</DialogTitle>
            <DialogDescription>
              {selectedPackage && (() => {
                const pkg = PACKAGES.find((p) => p.id === selectedPackage)
                return pkg
                  ? `${pkg.name} — ${pkg.duration} gün — ${pkg.price.toLocaleString('tr-TR')} ₺`
                  : ''
              })()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPackage(null)} disabled={purchasing}>
              İptal
            </Button>
            <Button onClick={handlePurchase} disabled={purchasing}>
              {purchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {purchasing ? 'Yönlendiriliyor...' : 'Satın Al'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
