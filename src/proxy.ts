import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuth = !!token
  const { pathname } = req.nextUrl

  const publicPages = ['/', '/login', '/register', '/pricing']
  const isPublicPage = publicPages.some(p => pathname === p)
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isApiRoute = pathname.startsWith('/api/')
  const publicApis = ['/api/auth/', '/api/packages', '/api/statistics']
  const isPublicApi = publicApis.some(p => pathname.startsWith(p))
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/Images') || 
                   pathname === '/favicon.ico'

  if (isStatic) return NextResponse.next()

  if (isApiRoute) {
    if (!isPublicApi && !isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/archive', req.url))
  }

  if (!isPublicPage && !isAuth) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|Images|favicon.ico).*)']
}
