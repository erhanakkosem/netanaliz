"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Brain,
  Activity,
  LineChart,
  Search,
  Database,
  Zap,
  Target,
  Check,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Apple,
  Star,
  Shield,
} from "lucide-react";

const navLinks = [
  { href: "#anasayfa", label: "Ana Sayfa" },
  { href: "#arsiv", label: "Arşiv" },
  { href: "#akilli-analiz", label: "Akıllı Analiz" },
  { href: "#fiyatlar", label: "Fiyatlar" },
];

const stats = [
  { value: "13+", label: "Veri Kaynağı", icon: Database },
  { value: "6M+", label: "Analiz", icon: TrendingUp },
  { value: "100+", label: "Lig", icon: Globe },
  { value: "7/24", label: "Canlı", icon: Activity },
];

const features = [
  {
    icon: BarChart3,
    title: "Oran Arşivi",
    description:
      "Günlük, haftalık ve aylık oran geçmişini detaylı grafiklerle inceleyin. Tüm maçlar için kapsamlı veri arşivi.",
    color: "emerald",
  },
  {
    icon: Brain,
    title: "Smart Analiz",
    description:
      "Akıllı filtreleme araçlarıyla en karlı bahis fırsatlarını anında yakalayın. Kişiselleştirilmiş analiz raporları.",
    color: "violet",
  },
  {
    icon: TrendingUp,
    title: "Dropping Odds",
    description:
      "Oran düşüşlerini gerçek zamanlı takip edin. Hareketli oranları kaçırmamak için anlık bildirimler alın.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Yapay Zeka",
    description:
      "Gelişmiş yapay zeka algoritmalarıyla maç sonucu tahminleri ve olasılık hesaplamaları.",
    color: "amber",
  },
  {
    icon: Activity,
    title: "Canlı Takip",
    description:
      "Canlı maçları ve anlık oran değişimlerini gerçek zamanlı olarak takip edin. Anlık uyarı sistemi.",
    color: "rose",
  },
  {
    icon: LineChart,
    title: "KuponX",
    description:
      "Akıllı kupon oluşturma motoru ile yüksek kazanç potansiyelli kuponlar hazırlayın ve paylaşın.",
    color: "blue",
  },
];

const steps = [
  {
    number: "01",
    title: "Kaynak Seç",
    description:
      "13 farklı veri kaynağı arasından ihtiyacınıza uygun olanı seçin.",
    icon: Database,
  },
  {
    number: "02",
    title: "Filtre Uygula",
    description:
      "Gelişmiş filtreleme araçlarıyla aradığınız maçları ve oranları bulun.",
    icon: Search,
  },
  {
    number: "03",
    title: "Analiz Et",
    description:
      "Detaylı grafikler ve yapay zeka raporlarıyla derinlemesine analiz yapın.",
    icon: Brain,
  },
  {
    number: "04",
    title: "Karar Ver",
    description:
      "Verilere dayalı bilinçli kararlarla kazançlı bahis stratejileri oluşturun.",
    icon: Target,
  },
];

const plans = [
  {
    name: "Jet",
    price: "299₺",
    period: "/15 gün",
    description: "Hızlı ve pratik analiz için ideal",
    features: [
      "5 Kaynağa Erişim",
      "Temel Analiz Araçları",
      "Günlük Oran Takibi",
      "E-posta Desteği",
    ],
    highlighted: false,
    cta: "Başla",
  },
  {
    name: "Standart",
    price: "499₺",
    period: "/ay",
    description: "Profesyonel kullanıcılar için en çok tercih edilen",
    features: [
      "10 Kaynağa Erişim",
      "Gelişmiş Analiz Araçları",
      "Gerçek Zamanlı Bildirimler",
      "Öncelikli Destek",
      "KuponX Entegrasyonu",
    ],
    highlighted: true,
    cta: "Popüler",
  },
  {
    name: "Premium",
    price: "899₺",
    period: "/60 gün",
    description: "Tam kapsamlı profesyonel çözüm",
    features: [
      "13 Kaynağa Tam Erişim",
      "Yapay Zeka Tahminleri",
      "Sınırsız Bildirim",
      "7/24 Öncelikli Destek",
      "KuponX Premium",
      "API Erişimi",
    ],
    highlighted: false,
    cta: "Premium'a Geç",
  },
  {
    name: "Elite",
    price: "1299₺",
    period: "/90 gün",
    description: "Kurumsal çözümler için özel paket",
    features: [
      "Tüm Kaynaklara Erişim",
      "AI Asistan",
      "Özel Analiz Raporları",
      "7/24 VIP Destek",
      "KuponX Elite",
      "Sınırsız API Erişimi",
      "Özel Entegrasyon",
    ],
    highlighted: false,
    cta: "Elite'e Geç",
  },
];

const footerLinks = [
  {
    title: "Ürün",
    links: ["Özellikler", "Fiyatlar", "API", "Entegrasyonlar"],
  },
  {
    title: "Şirket",
    links: ["Hakkımızda", "Blog", "Kariyer", "İletişim"],
  },
  {
    title: "Destek",
    links: ["Yardım Merkezi", "Dokümantasyon", "API Durum", "Sıkça Sorulan"],
  },
  {
    title: "Yasal",
    links: ["Gizlilik Politikası", "Kullanım Şartları", "Çerez Politikası"],
  },
];

function Globe(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-header/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Oran<span className="text-primary">Analiz</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
            >
              Kayıt Ol
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-muted transition-colors hover:text-foreground md:hidden"
            aria-label="Menüyü aç/kapat"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-header/95 backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section
        id="anasayfa"
        className="relative flex min-h-screen items-center overflow-hidden pt-16"
      >
        <div
          className="pointer-events-none absolute inset-0 animate-gradient"
          style={{
            background:
              "linear-gradient(-45deg, #0a0a1a, #111827, #064e3b, #0a0a1a)",
            backgroundSize: "400% 400%",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>Yeni Nesil Analiz Platformu</span>
            </div>

            <h1 className="animate-fade-in-up text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              13 Kaynaktan Canlı Oranlar,
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Tek Ekranda
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-base leading-relaxed text-muted sm:text-lg">
              Profesyonel maç analiz platformu ile 13 farklı kaynaktan canlı
              oranları takip edin, akıllı analiz araçlarıyla kazançlı
              fırsatları yakalayın.
            </p>

            <div className="mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
              >
                Hemen Başla
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register?free=true"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-card-hover sm:w-auto"
              >
                <Star className="h-5 w-5 text-primary" />
                Ücretsiz Dene
              </Link>
            </div>

            <div className="mt-10 flex animate-fade-in-up items-center justify-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Kredi Kartı Gerekmez</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>SSL Güvenli</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-card/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center">
                <stat.icon className="mx-auto h-6 w-6 text-primary transition-all group-hover:scale-110" />
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="arsiv" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Güçlü Analiz Araçları
            </h2>
            <p className="mt-4 text-base text-muted">
              Profesyonel bahisçiler için geliştirilmiş kapsamlı analiz
              araçlarıyla rakiplerinizin önüne geçin.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const borderColor = {
                emerald: "border-emerald-500/20 hover:border-emerald-500/40",
                violet: "border-violet-500/20 hover:border-violet-500/40",
                cyan: "border-cyan-500/20 hover:border-cyan-500/40",
                amber: "border-amber-500/20 hover:border-amber-500/40",
                rose: "border-rose-500/20 hover:border-rose-500/40",
                blue: "border-blue-500/20 hover:border-blue-500/40",
              }[feature.color];
              const bgColor = {
                emerald: "bg-emerald-500/10 text-emerald-400",
                violet: "bg-violet-500/10 text-violet-400",
                cyan: "bg-cyan-500/10 text-cyan-400",
                amber: "bg-amber-500/10 text-amber-400",
                rose: "bg-rose-500/10 text-rose-400",
                blue: "bg-blue-500/10 text-blue-400",
              }[feature.color];

              return (
                <div
                  key={feature.title}
                  className={`group cursor-default rounded-xl border ${borderColor} bg-card p-6 transition-all hover:bg-card-hover`}
                  style={{
                    animation: "fade-in-up 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  <div
                    className={`mb-4 inline-flex rounded-lg ${bgColor} p-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="akilli-analiz" className="relative border-y border-border bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Nasıl Çalışır?
            </h2>
            <p className="mt-4 text-base text-muted">
              Dört basit adımda profesyonel analizlere başlayın.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-primary/50 to-transparent md:block" />
                  )}
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                    <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fiyatlar" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Esnek Fiyatlandırma
            </h2>
            <p className="mt-4 text-base text-muted">
              İhtiyacınıza uygun paketi seçin, dilediğiniz zaman iptal edin.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-xl shadow-primary/10"
                    : "border-border bg-card"
                } p-6 transition-all hover:border-primary/30`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    Popüler
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-muted">{plan.period}</span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-sm text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-primary text-white shadow-lg hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/25"
                      : "border border-border text-foreground hover:border-primary/50 hover:bg-card-hover"
                  }`}
                >
                  {plan.cta}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Hemen Katılın, Kazanmaya Başlayın
              </h2>
              <p className="mt-4 text-base text-muted">
                50.000+ profesyonel kullanıcıya katılın, ilk ay ücretsiz
                deneyin.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90 sm:w-auto"
                >
                  <Apple className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">App Store</div>
                    <div className="-mt-0.5 text-sm font-semibold">
                      İndir
                    </div>
                  </div>
                </Link>
                <Link
                  href="/register"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-card-hover sm:w-auto"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Google Play</div>
                    <div className="-mt-0.5 text-sm font-semibold">
                      İndir
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-header py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  Oran<span className="text-primary">Analiz</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Profesyonel maç analiz platformu ile kazançlı bahis fırsatlarını
                yakalayın.
              </p>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-sm font-semibold text-foreground">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-muted transition-colors hover:text-primary"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-sm text-muted">
              &copy; {new Date().getFullYear()} OranAnaliz. Tüm hakları
              saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
