import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { issue,verify } from './token'
export async function userId() {
  const id=await verify((await cookies()).get('session')?.value)
  if (!id) redirect('/login')
  return id
}
export async function signIn(id:number) {
  const h=await headers()
  const secure=h.get('x-forwarded-proto')==='https' || h.get('origin')?.startsWith('https://')===true
  ;(await cookies()).set('session',await issue(id),{httpOnly:true,sameSite:'lax',secure,path:'/',maxAge:604800})
}