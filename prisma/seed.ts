import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BOOKMAKERS = [
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

const LEAGUES = ['Süper Lig', '1.Lig', 'Premier League', 'La Liga', 'Serie A'] as const

const TEAMS: Record<string, string[]> = {
  'Süper Lig': [
    'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor',
    'Başakşehir', 'Adana Demirspor', 'Sivasspor', 'Kayserispor',
    'Gaziantep FK', 'Antalyaspor', 'Alanyaspor', 'Çaykur Rizespor',
    'Kasımpaşa', 'Hatayspor', 'Bodrumspor', 'Konyaspor',
  ],
  '1.Lig': [
    'Eyüpspor', 'Göztepe', 'Sakaryaspor', 'Çorum FK',
    'Kocaelispor', 'Boluspor', 'Gençlerbirliği', 'Manisa FK',
    'Keçiörengücü', 'Ümraniyespor', 'Bandırmaspor', 'Adanaspor',
  ],
  'Premier League': [
    'Manchester City', 'Arsenal', 'Liverpool', 'Manchester United',
    'Chelsea', 'Tottenham', 'Newcastle', 'Aston Villa',
    'Brighton', 'West Ham',
  ],
  'La Liga': [
    'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Real Sociedad',
    'Athletic Bilbao', 'Villarreal', 'Betis', 'Sevilla',
    'Valencia', 'Girona',
  ],
  'Serie A': [
    'Inter', 'AC Milan', 'Juventus', 'Napoli',
    'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino',
  ],
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMatches(count: number) {
  const matches: Array<{
    matchDate: Date
    league: string
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
    result: string | null
    status: string
  }> = []
  const usedPairs = new Set<string>()

  for (let i = 0; i < count; i++) {
    const league = pickRandom(LEAGUES) as string
    const teams = TEAMS[league]
    let homeTeam: string, awayTeam: string, pairKey: string

    do {
      homeTeam = pickRandom(teams)
      awayTeam = pickRandom(teams)
      pairKey = `${homeTeam}-${awayTeam}`
    } while (homeTeam === awayTeam || usedPairs.has(pairKey))

    usedPairs.add(pairKey)

    const daysFromNow = Math.floor(Math.random() * 14) - 7
    const matchDate = new Date()
    matchDate.setDate(matchDate.getDate() + daysFromNow)
    matchDate.setHours(17 + Math.floor(Math.random() * 6), 0, 0, 0)

    let status: string
    let homeScore: number | null = null
    let awayScore: number | null = null
    let result: string | null = null

    if (daysFromNow < 0) {
      status = 'FINISHED'
      homeScore = Math.floor(Math.random() * 5)
      awayScore = Math.floor(Math.random() * 4)
      if (homeScore > awayScore) result = '1'
      else if (homeScore < awayScore) result = '2'
      else result = 'X'
    } else if (daysFromNow === 0) {
      status = 'LIVE'
    } else {
      status = 'SCHEDULED'
    }

    matches.push({ matchDate, league, homeTeam, awayTeam, homeScore, awayScore, result, status })
  }

  return matches
}

function generateOddsValue(oddsType: string): number {
  switch (oddsType) {
    case 'MS1': return randomFloat(1.50, 5.50)
    case 'MSX': return randomFloat(2.80, 4.00)
    case 'MS2': return randomFloat(1.50, 5.50)
    default: return randomFloat(1.50, 5.00)
  }
}

async function main() {
  console.log('Seeding database...')

  await prisma.bookmaker.deleteMany()
  await prisma.user.deleteMany()
  await prisma.match.deleteMany()
  await prisma.matchOdds.deleteMany()
  await prisma.prediction.deleteMany()

  const bookmakers = await Promise.all(
    BOOKMAKERS.map((b, i) =>
      prisma.bookmaker.create({
        data: { code: b.code, name: b.name, isActive: true, sortOrder: i + 1 },
      })
    )
  )
  console.log(`Created ${bookmakers.length} bookmakers`)

  const hashedPassword = await bcrypt.hash('test123', 12)

  const freeUser = await prisma.user.create({
    data: {
      name: 'Test Kullanıcı',
      email: 'test@orananaliz.com',
      hashedPassword,
      role: 'FREE',
      credits: 0,
    },
  })

  const premiumUser = await prisma.user.create({
    data: {
      name: 'Premium Kullanıcı',
      email: 'premium@orananaliz.com',
      hashedPassword,
      role: 'PREMIUM',
      credits: 100,
    },
  })
  console.log('Created 2 test users')

  const matches = generateMatches(50)
  const createdMatches = await Promise.all(
    matches.map((m) =>
      prisma.match.create({
        data: {
          matchDate: m.matchDate,
          league: m.league,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          result: m.result,
          status: m.status,
        },
      })
    )
  )
  console.log(`Created ${createdMatches.length} matches`)

  const oddsTypes = ['MS1', 'MSX', 'MS2']
  const oddsBatch: Array<{
    matchId: string
    bookmakerId: string
    oddsType: string
    openingOdds: number
    closingOdds: number | null
  }> = []

  for (const match of createdMatches) {
    for (const bookmaker of bookmakers) {
      for (const oddsType of oddsTypes) {
        const openingOdds = generateOddsValue(oddsType)
        const closingOdds = match.status === 'FINISHED' ? generateOddsValue(oddsType) : null
        oddsBatch.push({
          matchId: match.id,
          bookmakerId: bookmaker.id,
          oddsType,
          openingOdds,
          closingOdds,
        })
      }
    }
  }

  await prisma.matchOdds.createMany({ data: oddsBatch })
  console.log(`Created ${oddsBatch.length} match odds`)

  const predictions = createdMatches
    .filter((m) => m.status !== 'LIVE')
    .slice(0, 15)
    .map((match) => {
      const homeProb = randomFloat(20, 60, 1)
      const drawProb = randomFloat(15, 35, 1)
      const awayProb = parseFloat((100 - homeProb - drawProb).toFixed(1))

      let prediction: string
      if (homeProb > drawProb && homeProb > awayProb) prediction = '1'
      else if (awayProb > homeProb && awayProb > drawProb) prediction = '2'
      else prediction = 'X'

      const confidence = randomFloat(55, 92, 0)

      return prisma.prediction.create({
        data: {
          matchId: match.id,
          prediction,
          confidence,
          homeProb,
          drawProb,
          awayProb,
        },
      })
    })

  await Promise.all(predictions)
  console.log(`Created ${predictions.length} predictions`)

  console.log('Seeding complete!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
