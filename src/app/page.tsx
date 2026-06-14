'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu, X, TrendingUp, Brain, Shield, ChevronDown,
  Check, ArrowRight, Star, Smartphone, Download, Globe,
  BarChart3, Activity, Zap, Target, Clock, AlertTriangle,
} from 'lucide-react'

const BOOKMAKERS = [
  { name: 'OA-1', odds: ['1.85', '3.40', '4.20'], change: '↑0.05' },
  { name: 'OA-2', odds: ['1.88', '3.35', '4.10'], change: '↑0.03' },
  { name: 'OA-3', odds: ['1.90', '3.45', '4.00'], change: '↓0.10' },
  { name: 'OA-4', odds: ['1.82', '3.50', '4.25'], change: '↓0.08' },
  { name: 'OA-5', odds: ['1.92', '3.30', '4.15'], change: '↑0.02' },
  { name: 'OA-6', odds: ['1.87', '3.42', '4.18'], change: '—' },
  { name: 'OA-7', odds: ['1.80', '3.25', '3.95'], change: '—' },
]

const FEATURES = [
  {
    title: 'Oran Arşivi', icon: BarChart3, color: 'emerald',
    desc: '13 platformun açılış ve kapanış oranları 10+ yıl boyunca arşivlendi. 6 milyon kayıta tek tıkla erişin.',
    bullets: ['Uluslararası ve yerel 13 farklı kaynak', 'Açılış · Kapanış · Hareket karşılaştırması', 'Lig, ülke ve tarih bazlı filtreleme'],
  },
  {
    title: 'Smart Analiz', icon: Brain, color: 'violet',
    desc: 'Seçtiğiniz orana benzer geçmiş maçları bulun. MS1 / X / MS2 yüzdelerini istatistiksel olarak görün.',
    bullets: ['Oran aralığı filtresi (açılış veya kapanış)', 'Filtreler kayıt edilebilir ve tekrar kullanılabilir', 'İY / MS · Üst/Alt · KG Var/Yok istatistikleri'],
  },
  {
    title: 'Dropping Odds', icon: TrendingUp, color: 'cyan',
    desc: 'Anlık düşen oranları takip edin. Önemli hareketlerde Telegram bildirimi alın.',
    bullets: ['Gerçek zamanlı oran hareketi izleme', 'Eşik değeri aşıldığında otomatik alarm', 'Birden fazla platformda eşzamanlı takip'],
  },
  {
    title: 'Yapay Zeka Tahminleri', icon: Shield, color: 'amber',
    desc: 'Maç verilerini ve oran hareketlerini analiz eden yapay zeka modeli, olası sonuçları ve risk seviyelerini tahmin eder.',
    bullets: ['Açılış oranı bazlı örüntü tanıma', 'Ülke ve lig bazlı başarı oranı istatistiği', 'WIN / RISK / PASS sinyal sınıflandırması'],
  },
  {
    title: 'Canlı Takip', icon: Activity, color: 'rose',
    desc: 'Maç devam ederken anlık oranları, ataklardan köşe vuruşlarına kadar tüm istatistikleri izleyin.',
    bullets: ['İnPlay — canlı oran ve tehlikeli atak takibi', 'Bugünkü maçlar listesi ve hızlı analiz', 'Para hareketi (money movement) sinyalleri'],
  },
  {
    title: 'KuponX — Kazananlar Kulübü', icon: Target, color: 'blue',
    desc: 'Analizlerinizi kupon olarak paylaşın, topluluğun en başarılı kuponlarını takip edin.',
    bullets: ['Kupon paylaşma ve beğenme sistemi', 'Kazanma oranına göre sıralama', 'Üzeri çizili analiz takibi ve kopyalama'],
  },
]

const PACKAGES = [
  {
    name: 'Jet', days: 15, originalPrice: 500, price: 350, discount: 30,
    features: ['13 Odds Source Analysis', 'Opening & Closing Odds Analysis', 'Smart Analysis', 'Filter Bulletin Scanning', 'Mobile Access'],
    highlighted: false,
  },
  {
    name: 'Standart', days: 30, originalPrice: 700, price: 500, discount: 29,
    features: ['13 Odds Source Analysis', 'Opening & Closing Odds Analysis', 'Filter Bulletin Scanning', 'Smart Analysis', 'Mobile Access', 'Personal Analysis', '1 Opening Filter added to Smart'],
    highlighted: false,
  },
  {
    name: 'Premium', days: 60, originalPrice: 1400, price: 1000, discount: 29,
    features: ['All Standard Features', '2-Month Access', 'VIP Support', 'Priority Response', '1 Opening + 1 Closing Filter added to Smart'],
    highlighted: true,
    badge: 'RECOMMENDED',
  },
  {
    name: 'Elite', days: 90, originalPrice: 1800, price: 1200, discount: 33,
    features: ['All Premium Features', '3-Month Access', 'VIP Support', 'Maximum Savings', '1 Opening + 2 Closing Filters added to Smart'],
    highlighted: false,
  },
  {
    name: 'WC 2026 VIP', days: 0, originalPrice: 0, price: 1500, discount: 0, period: '11 Haziran – 19 Temmuz',
    features: ['Her maça özel oran analizi', 'Anlık sinyal bildirimleri', 'Günlük özel kuponlar', '13 kaynaktan veri akışı', '7/24 aktif Telegram grubu', 'Sadece 50 kişi · Kontenjan sınırlı!'],
    highlighted: false, badge: 'DÜNYA KUPASI 2026',
    isWC: true,
  },
]

const SOURCES = ['Futbol', 'Basketbol', '100+ Lig', '50+ Ülke', 'Canlı Oranlar', 'Geçmiş Veriler', 'Oran Hareketleri', 'Telegram Bildirimi', 'API Entegrasyonu', 'Mobil Erişim', 'Günlük Güncelleme', 'Anlık Alarm', 'Çoklu Filtre']

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [showDownloadBar, setShowDownloadBar] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showBanner && (
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-center text-sm text-white">
          <span className="font-semibold">Dünya Kupası 2026 VIP Paketi</span> — Sadece 50 kişi! Kontenjan sınırlı.
          <a href="#pricing" className="ml-3 underline font-medium">Hemen Katıl →</a>
          <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">Oran<span className="text-primary">Analiz</span></span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/free-services" className="text-sm font-medium text-muted hover:text-foreground">Ücretsiz Servisler</Link>
            <Link href="/ai" className="text-sm font-medium text-muted hover:text-foreground">Yapay Zeka</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted hover:text-foreground">Fiyatlar</Link>
            <Link href="/bulletin" className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground">
              Bülten Tarama <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
            </Link>
            <Link href="/inplay" className="text-sm font-medium text-muted hover:text-foreground">Radar</Link>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground">
                Arşiv <ChevronDown className="h-3 w-3" />
              </button>
              <div className="invisible absolute left-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-card py-2 shadow-xl group-hover:visible">
                <Link href="/archive" className="block px-4 py-2 text-sm hover:bg-card-hover">Yabancı Arşiv</Link>
                <Link href="/iddaa-v1" className="block px-4 py-2 text-sm hover:bg-card-hover">İddaa V1</Link>
                <Link href="/iddaa-v2" className="block px-4 py-2 text-sm hover:bg-card-hover">İddaa V2</Link>
                <Link href="/basketball" className="block px-4 py-2 text-sm hover:bg-card-hover">Basketbol</Link>
                <Link href="/statarea" className="block px-4 py-2 text-sm hover:bg-card-hover">StatArea</Link>
              </div>
            </div>
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground">
                Smart Analiz <ChevronDown className="h-3 w-3" />
              </button>
              <div className="invisible absolute left-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-card py-2 shadow-xl group-hover:visible">
                <Link href="/smart" className="block px-4 py-2 text-sm hover:bg-card-hover">Yabancı Smart</Link>
                <Link href="/iddaa-v1-smart" className="block px-4 py-2 text-sm hover:bg-card-hover">İddaa V1 Smart</Link>
                <Link href="/iddaa-v2-smart" className="block px-4 py-2 text-sm hover:bg-card-hover">İddaa V2 Smart</Link>
                <Link href="/basketball-smart" className="block px-4 py-2 text-sm hover:bg-card-hover">Basketbol Smart</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 md:flex">
              <Globe className="h-4 w-4 text-muted" />
              <select className="bg-transparent text-xs text-muted focus:outline-none">
                <option>Türkçe</option><option>English</option><option>Deutsch</option><option>Español</option>
              </select>
            </div>
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground">Giriş Yap</Link>
            <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Kayıt Ol</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-muted hover:text-foreground md:hidden">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link href="/free-services" className="text-sm text-muted hover:text-foreground">Ücretsiz Servisler</Link>
              <Link href="/ai" className="text-sm text-muted hover:text-foreground">Yapay Zeka</Link>
              <Link href="/pricing" className="text-sm text-muted hover:text-foreground">Fiyatlar</Link>
              <Link href="/bulletin" className="text-sm text-muted hover:text-foreground">Bülten Tarama</Link>
              <Link href="/inplay" className="text-sm text-muted hover:text-foreground">Radar</Link>
              <Link href="/archive" className="text-sm text-muted hover:text-foreground">Yabancı Arşiv</Link>
              <Link href="/iddaa-v1" className="text-sm text-muted hover:text-foreground">İddaa V1</Link>
              <Link href="/iddaa-v2" className="text-sm text-muted hover:text-foreground">İddaa V2</Link>
              <Link href="/smart" className="text-sm text-muted hover:text-foreground">Smart Analiz</Link>
              <a href="https://tinyurl.com/oranarsiviios" target="_blank" rel="noopener" className="text-sm text-muted hover:text-foreground">iOS İndir</a>
              <a href="https://tinyurl.com/oranarsiviandroid" target="_blank" rel="noopener" className="text-sm text-muted hover:text-foreground">Android İndir</a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Zap className="h-3 w-3" /> #1 Analysis Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            ORAN<br />ARŞİVİ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
            Professional football analysis · AI-powered predictions · 13 bookmaker data on one screen
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-2xl mx-auto">
            {[
              { value: '13', label: 'Kaynak' },
              { value: '6M+', label: 'Kayıt' },
              { value: '100+', label: 'Lig' },
              { value: '24/7', label: 'Canlı' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted">
            {['Dropping Odds', 'Canlı Oranlar', 'Anlık Alarm', 'Yapay Zeka'].map((t) => (
              <span key={t} className="rounded-full border border-border bg-card px-3 py-1">{t}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="https://tinyurl.com/oranarsiviios" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90">
              <Download className="h-4 w-4" /> App Store
            </a>
            <a href="https://tinyurl.com/oranarsiviandroid" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-card-hover">
              <Download className="h-4 w-4" /> Google Play
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Real-Time Odds Tracking</p>
            <h2 className="mt-2 text-2xl font-bold">13 Sources · One Screen</h2>
            <p className="mt-1 text-sm text-muted">13 domestic and international odds sources — instant odds comparison</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted sm:text-sm">
            <div><span className="text-lg font-bold text-foreground">6M+</span><br />Analyzed Matches</div>
            <div><span className="text-lg font-bold text-foreground">24/7</span><br />Live Updates</div>
            <div><span className="text-lg font-bold text-foreground">%98</span><br />Data Accuracy</div>
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-3 py-2 text-left">BOOKMAKER</th>
                  <th className="px-3 py-2 text-center">1</th>
                  <th className="px-3 py-2 text-center">X</th>
                  <th className="px-3 py-2 text-center">2</th>
                  <th className="px-3 py-2 text-center">CHG.</th>
                </tr>
              </thead>
              <tbody>
                {BOOKMAKERS.map((b, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-card-hover">
                    <td className="px-3 py-2 font-medium">{b.name}</td>
                    <td className="px-3 py-2 text-center text-green-400">{b.odds[0]}</td>
                    <td className="px-3 py-2 text-center text-yellow-400">{b.odds[1]}</td>
                    <td className="px-3 py-2 text-center text-red-400">{b.odds[2]}</td>
                    <td className={`px-3 py-2 text-center ${b.change.startsWith('↑') ? 'text-green-400' : b.change.startsWith('↓') ? 'text-red-400' : 'text-muted'}`}>{b.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Professional Analysis Tools</p>
            <h2 className="mt-2 text-2xl font-bold">Dropping Odds</h2>
            <p className="mt-1 text-sm text-muted">See where the big money flows. Track odds drops, make smart decisions.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div className="rounded-xl border border-border bg-card p-6">
              <AlertTriangle className="mx-auto h-8 w-8 text-cyan-400" />
              <h3 className="mt-3 font-semibold">Dropping Odds Alarm</h3>
              <p className="mt-1 text-xs text-muted">Anlık düşen oranlar</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <FileSearchIcon className="mx-auto h-8 w-8 text-violet-400" />
              <h3 className="mt-3 font-semibold">Smart Bulletin Scan</h3>
              <p className="mt-1 text-xs text-muted">Otomatik bülten tarama</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <BarChart3 className="mx-auto h-8 w-8 text-amber-400" />
              <h3 className="mt-3 font-semibold">Personal Analysis Panel</h3>
              <p className="mt-1 text-xs text-muted">Kişisel analiz paneli</p>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-center gap-4 text-3xl font-mono text-muted">
              <span className="text-green-400">2.50</span>
              <span className="text-green-300">2.20</span>
              <span className="text-yellow-400">1.90</span>
              <span className="text-red-300">1.65</span>
              <span className="text-red-400">1.40</span>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-400">CROSS</span>
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-400">↑ ALARM</span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-400">Dropping Odds</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">AI Prediction Engine</p>
            <h2 className="mt-2 text-2xl font-bold">AI Powered Predictions</h2>
            <p className="mt-1 text-sm text-muted">Prediction system powered by machine learning. First half, result, goals — all scenarios analyzed.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted sm:text-sm">
            <div><span className="text-lg font-bold text-foreground">10K+</span><br />Active Members</div>
            <div><span className="text-lg font-bold text-foreground">4.9</span><br />User Rating</div>
            <div><span className="text-lg font-bold text-foreground">2022</span><br />Founded</div>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-card p-6 max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {['MATCH', 'ODDS', 'STATS'].map((h) => (
                <div key={h} className="rounded bg-background/50 p-2 font-bold text-muted">{h}</div>
              ))}
              {['WIN', 'RISK', 'OUTPUT'].map((h) => (
                <div key={h} className="rounded bg-background/50 p-2 font-bold text-primary">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Platform Nedir?</h2>
            <p className="mt-2 text-base text-muted max-w-2xl mx-auto">
              OranAnaliz; 13 farklı kaynaktan derlenen açılış ve kapanış oranlarını 10 yılı aşkın süre boyunca arşivler.
              Geçmiş verilerle filtrelenmiş analiz yapın, oran hareketlerini takip edin, yapay zeka tahminlerinden yararlanın.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                  <div className={`mb-3 inline-flex rounded-lg bg-${f.color}-500/10 p-2`}>
                    <Icon className={`h-5 w-5 text-${f.color}-400`} />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted">{f.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {f.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted">
                        <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">Nasıl Çalışır?</h2>
          <p className="mt-1 text-sm text-muted">4 Adımda Analiz</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-4">
            {[
              { n: '1', title: 'Kaynak Seç', desc: 'Uluslararası ve yerel 13 farklı kaynaktan birini veya birkaçını seçin.' },
              { n: '2', title: 'Filtrele', desc: 'Tarih, lig, ülke ve oran aralığı filtrelerini uygulayın.' },
              { n: '3', title: 'Benzer Maçları Bul', desc: 'Benzer oran yapısına sahip tüm geçmiş maçları listeleyin.' },
              { n: '4', title: 'İstatistiğe Bak', desc: 'MS1/X/MS2, İY, Üst/Alt, KG yüzdelerini görüp kararınızı verin.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{s.n}</div>
                <h3 className="mt-3 font-semibold text-sm">{s.title}</h3>
                <p className="mt-1 text-xs text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">13 Kaynaktan Tek Platformda</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SOURCES.map((s) => (
              <span key={s} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium">{s}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">Her kaynak için açılış ve kapanış oranları ayrı ayrı arşivlenir.</p>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 items-center lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Mobil Uygulama<br />Her Yerde, Her Cihazda</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="mt-1 h-5 w-5 text-primary" />
                  <div><p className="font-semibold text-sm">iOS & Android Uygulaması</p><p className="text-xs text-muted">iPhone ve Android için yerel uygulama. Aynı analiz gücü, cebinizde.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-primary" />
                  <div><p className="font-semibold text-sm">Anlık Bildirimler</p><p className="text-xs text-muted">Dropping odds alarmları ve Telegram bildirimleri masaüstünü açmadan ulaşır.</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="mt-1 h-5 w-5 text-primary" />
                  <div><p className="font-semibold text-sm">Dokunmatik Optimize</p><p className="text-xs text-muted">Filtre, analiz ve oran takibi; mobil için yeniden tasarlanmış arayüz ile.</p></div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="https://tinyurl.com/oranarsiviios" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90">
                  <Download className="h-4 w-4" /> App Store
                </a>
                <a href="https://tinyurl.com/oranarsiviandroid" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-card-hover">
                  <Download className="h-4 w-4" /> Google Play
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-80 w-48 rounded-3xl border-4 border-border bg-card shadow-2xl flex items-center justify-center">
                <Smartphone className="h-20 w-20 text-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Membership Packages</p>
            <h2 className="mt-2 text-2xl font-bold">Choose the Right Package for You</h2>
            <p className="mt-1 text-sm text-muted">Instant access to professional analysis · Cancel anytime</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-2">
            {PACKAGES.map((p) => (
              <div key={p.name} className={`relative flex flex-col rounded-xl border p-6 ${p.highlighted ? 'border-primary bg-card shadow-xl shadow-primary/10' : 'border-border bg-card'}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">{p.badge}</div>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.days > 0 && <p className="text-xs text-muted">{p.days} Days</p>}
                {p.period && <p className="text-xs text-muted">{p.period}</p>}
                <div className="mt-3">
                  <span className="text-2xl font-bold">₺{p.price}</span>
                  {p.discount > 0 && <span className="ml-1 text-xs text-muted">-{p.discount}%</span>}
                  {p.originalPrice > 0 && <span className="ml-1 text-xs text-muted line-through">₺{p.originalPrice}</span>}
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted">
                      <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />{f}
                    </li>
                  ))}
                </ul>
                <a href={p.isWC ? 'https://t.me/OranArsivi' : '/register'} target={p.isWC ? '_blank' : undefined}
                  className={`mt-4 block rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
                    p.highlighted ? 'bg-primary text-white hover:bg-primary/90' : 'border border-border hover:bg-card-hover'
                  }`}>
                  {p.isWC ? 'Kayıt İçin DM' : 'Satın Al'}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center text-xs text-muted">
            <div className="flex items-center justify-center gap-2"><Shield className="h-4 w-4 text-primary" /> Secure Payment</div>
            <div className="flex items-center justify-center gap-2"><Clock className="h-4 w-4 text-primary" /> 24/7 Support</div>
            <div className="flex items-center justify-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant Activation</div>
            <div className="flex items-center justify-center gap-2"><Star className="h-4 w-4 text-primary" /> Premium Quality</div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-3">
          <p>© Copyright <strong className="text-white">OranAnaliz</strong>. All Rights Reserved.</p>
          <p>OranAnaliz provides informational content for football enthusiasts. No betting or gambling is operated on our site. Users who place bets are responsible for complying with the laws of their country. Only individuals aged 18 and over may register on OranAnaliz.com.</p>
          <div className="flex justify-center gap-4 pt-1">
            <Link href="/privacy" className="text-gray-400 underline hover:text-white">
              <i className="icofont-shield-alt me-1"></i>Privacy Policy
            </Link>
            <Link href="/delete-account" className="text-gray-400 underline hover:text-white">
              <i className="icofont-ui-delete me-1"></i>Delete Account
            </Link>
          </div>
          <div className="flex justify-center items-center gap-3 pt-1">
            <a href="https://tinyurl.com/oranarsiviios" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-gray-400 hover:bg-gray-800 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              <span><small className="block text-[9px] leading-tight">İndir</small>App Store</span>
            </a>
            <a href="https://tinyurl.com/oranarsiviandroid" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-gray-400 hover:bg-gray-800 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.61 4.32C3.23 4.7 3 5.26 3 5.91v12.18c0 .65.23 1.21.61 1.59l.07.06 7.82-6.89v-.12L3.61 4.32zM16.85 15.37l-4.47-3.18v-.12l4.47-3.18.06.04 5.42 3.06c.95.54.95 1.42 0 1.96l-5.42 3.06-.06.36z"/><path d="M16.91 15.73L12.38 12.5H3v.12l7.5 6.59c.35.31.84.46 1.35.35.51-.12.96-.47 1.23-.95l3.83-2.88z"/><path d="M16.91 8.27L12.38 11.5H3v-.12l7.5-6.59c.35-.31.84-.46 1.35-.35.51.12.96.47 1.23.95l3.83 2.88z"/></svg>
              <span><small className="block text-[9px] leading-tight">İndir</small>Google Play</span>
            </a>
          </div>
          <div className="flex justify-center gap-4 pt-1 text-lg">
            <a href="https://twitter.com/oranarsivi" target="_blank" rel="nofollow" className="text-gray-500 hover:text-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a href="https://www.facebook.com/oranarsivi/" target="_blank" rel="nofollow" className="text-gray-500 hover:text-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="https://www.instagram.com/oran_arsivi/" target="_blank" rel="nofollow" className="text-gray-500 hover:text-white"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FileSearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v6"></path><path d="M8 11h6"></path>
    </svg>
  )
}
