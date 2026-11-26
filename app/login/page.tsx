import type { Metadata } from 'next'
import SubmitButton from '@/components/submit-button'
import { db } from '@/lib/db'
import { signIn } from '@/lib/session'
import { scryptSync,timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'
async function login(form:FormData) {
  'use server'
  const demo=form.get('demo')==='yes'
  const user=await db.user.findUnique({where:{login:demo?'demo':String(form.get('login'))}})
  if (!user) redirect('/login?error=1')
  const [salt,hash]=user.passwordHash.split(':')
  if (!demo && !timingSafeEqual(scryptSync(String(form.get('password')),salt,64),Buffer.from(hash,'hex'))) redirect('/login?error=1')
  await signIn(user.id)
  redirect('/')
}
export const metadata: Metadata = {
  title: 'Вход в дневник привычек',
  description: 'Откройте демопрофиль одним нажатием или войдите с учебными учётными данными.',
}

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}) {
  return <article className="panel login"><small>HABIT TRACKER</small><h1>Добро пожаловать</h1><p>Войдите, чтобы открыть свой дневник привычек.</p><form action={login}><label>Логин<input name="login" required autoComplete="username"/></label><label>Пароль<input type="password" name="password" required autoComplete="current-password"/></label>{(await searchParams).error && <p role="alert">Проверьте логин и пароль.</p>}<SubmitButton>Войти</SubmitButton></form><form action={login}><SubmitButton className="secondary" name="demo" value="yes">Войти как демо-пользователь</SubmitButton></form></article>
}
