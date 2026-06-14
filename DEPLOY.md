# OranAnaliz - Vercel Deploy Kılavuzu

## 1. Gereksinimler
- Vercel hesabı (vercel.com)
- PostgreSQL veritabanı (Vercel Postgres, Neon, veya Supabase)
- GitHub repository

## 2. PostgreSQL Veritabanı Kurulumu
Vercel Postgres (önerilen):
```bash
# Vercel CLI ile oturum aç
npx vercel login

# Projeyi bağla
npx vercel link

# PostgreSQL oluştur
npx vercel env add DATABASE_URL
```

## 3. Environment Variables
Vercel Dashboard'da şu değişkenleri ekleyin:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Rastgele bir secret (openssl rand -base64 32)
- `NEXTAUTH_URL` - https://orananaliz.vercel.app
- `NEXT_PUBLIC_APP_URL` - https://orananaliz.vercel.app
- `STRIPE_SECRET_KEY` - (opsiyonel) Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - (opsiyonel) Stripe publishable key

## 4. Deploy
```bash
# GitHub'a push
git add .
git commit -m "Initial deploy"
git remote add origin https://github.com/yourusername/orananaliz.git
git push -u origin main

# Vercel'e deploy (otomatik)
# Veya Vercel CLI ile:
npx vercel --prod
```

## 5. Domain Bağlama
Vercel Dashboard > Project > Settings > Domains
- Custom domain ekleyin: orananaliz.com
- DNS ayarlarını Vercel nameservers'a yönlendirin

## 6. Production Build
```bash
npm run build
```

## 7. Local'de Production Test
```bash
npm run build && npm run start
```

## 8. Prisma & PostgreSQL
This project uses **SQLite** for local development. For Vercel production, you **must** switch to PostgreSQL:
1. Change `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`
2. Make sure `DATABASE_URL` in Vercel points to your PostgreSQL connection string
3. Run `npx prisma generate` and `npx prisma db push` (or `npx prisma migrate deploy`) in Vercel build
