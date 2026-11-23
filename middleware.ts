import { NextRequest, NextResponse } from 'next/server'
import { verify } from './lib/token'
export async function middleware(req:NextRequest) {
  if (await verify(req.cookies.get('session')?.value)) return NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({error:'Требуется вход'},{status:401})
  return NextResponse.redirect(new URL('/login',req.url))
}
export const config={matcher:['/','/habits/:path*','/stats','/calendar','/settings','/api/:path*']}