export const BOOKMAKERS = [
  { code: 'OA-1', name: 'Bet365' },
  { code: 'OA-2', name: 'Pinnacle' },
  { code: 'OA-3', name: 'Betfair' },
  { code: 'OA-4', name: 'Bwin' },
  { code: 'OA-5', name: 'Unibet' },
  { code: 'OA-6', name: '1xBet' },
  { code: 'OA-7', name: 'İddaa' },
  { code: 'OA-8', name: 'Bilyoner' },
  { code: 'OA-9', name: 'Kambi' },
] as const

export const ODDS_TYPES = [
  'MS1', 'MSX', 'MS2',
  'IY1', 'IYX', 'IY2',
  'O25', 'U25',
  'KG_VAR', 'KG_YOK',
  'CS_1X', 'CS_12', 'CS_X2',
  'DNB',
  'H1', 'HX', 'H2',
  'IY05UST', 'IY05ALT',
] as const

export const ODDS_TYPE_LABELS: Record<string, string> = {
  MS1: 'Maç Sonucu 1',
  MSX: 'Maç Sonucu X',
  MS2: 'Maç Sonucu 2',
  IY1: 'İlk Yarı 1',
  IYX: 'İlk Yarı X',
  IY2: 'İlk Yarı 2',
  O25: '2.5 Üst',
  U25: '2.5 Alt',
  KG_VAR: 'Karşılıklı Gol Var',
  KG_YOK: 'Karşılıklı Gol Yok',
  CS_1X: 'Çifte Şans 1-X',
  CS_12: 'Çifte Şans 1-2',
  CS_X2: 'Çifte Şans X-2',
  DNB: 'Beraberlik İade',
  H1: 'Handikap 1',
  HX: 'Handikap X',
  H2: 'Handikap 2',
  IY05UST: 'İlk Yarı 0.5 Üst',
  IY05ALT: 'İlk Yarı 0.5 Alt',
}

export const PACKAGES = [
  {
    id: 'JET',
    name: 'Jet Paket',
    duration: 15,
    price: 299,
    features: [
      '15 gün premium erişim',
      'Tüm maç analizleri',
      'Düşen oran bildirimleri',
      'Akıllı filtreleme',
    ],
  },
  {
    id: 'STANDARD',
    name: 'Standart Paket',
    duration: 30,
    price: 499,
    features: [
      '30 gün premium erişim',
      'Tüm maç analizleri',
      'Düşen oran bildirimleri',
      'Akıllı filtreleme',
      'Kupon oluşturma',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium Paket',
    duration: 60,
    price: 899,
    features: [
      '60 gün premium erişim',
      'Tüm maç analizleri',
      'Düşen oran bildirimleri',
      'Akıllı filtreleme',
      'Kupon oluşturma',
      'Özel tahminler',
    ],
  },
  {
    id: 'ELITE',
    name: 'Elite Paket',
    duration: 90,
    price: 1299,
    features: [
      '90 gün premium erişim',
      'Tüm maç analizleri',
      'Düşen oran bildirimleri',
      'Akıllı filtreleme',
      'Kupon oluşturma',
      'Özel tahminler',
      'Öncelikli destek',
    ],
  },
] as const

export type PackageId = (typeof PACKAGES)[number]['id']

export const NAV_ITEMS = [
  { href: '/archive', label: 'Arşiv', icon: 'Archive' },
  { href: '/smart', label: 'Akıllı Analiz', icon: 'Brain' },
  { href: '/iddaa', label: 'İddaa', icon: 'Flag' },
  { href: '/dropping-odds', label: 'Dropping Odds', icon: 'TrendingDown' },
  { href: '/money-movement', label: 'Para Hareketleri', icon: 'DollarSign' },
  { href: '/ai', label: 'Yapay Zeka', icon: 'Bot' },
  { href: '/bulletin', label: 'Bülten', icon: 'FileSearch' },
  { href: '/inplay', label: 'Canlı Maçlar', icon: 'Radio' },
  { href: '/coupons', label: 'KuponX', icon: 'Ticket' },
  { href: '/pricing', label: 'Fiyatlar', icon: 'Crown' },
  { href: '/settings', label: 'Ayarlar', icon: 'Settings' },
] as const
