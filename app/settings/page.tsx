import { db } from '@/lib/db'
import { userId,signIn } from '@/lib/session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
async function save(f:FormData) {
  'use server'
  const id=await userId(),p=z.object({name:z.string().trim().min(1).max(60),goal:z.coerce.number().int().min(1).max(100),theme:z.enum(['light','dark'])}).safeParse(Object.fromEntries(f))
  if(!p.success) redirect('/settings?message=error')
  const {name,...settings}=p.data
  await db.user.update({where:{id},data:{name,settings:{upsert:{create:settings,update:settings}}}})
  redirect('/settings?message=saved')
}
async function swap() {
  'use server'
  const u=await db.user.findUniqueOrThrow({where:{id:await userId()}})
  const other=await db.user.findUniqueOrThrow({where:{login:u.login==='demo'?'guest':'demo'}})
  await signIn(other.id);redirect('/')
}
async function logout() {
  'use server'
  ;(await cookies()).delete('session');redirect('/login')
}
export default async function Settings({searchParams}:{searchParams:Promise<{message?:string}>}) {
  const u=await db.user.findUniqueOrThrow({where:{id:await userId()},include:{settings:true}})
  const message=(await searchParams).message
  return <><h1>Настройки</h1><section className="panel"><small>Профиль · {u.login}</small><form action={save}><label>Имя<input name="name" maxLength={60} defaultValue={u.name} required/></label><label>Цель на день<input name="goal" type="number" min="1" max="100" required defaultValue={u.settings?.goal}/></label><label>Тема<select name="theme" defaultValue={u.settings?.theme}><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label><button>Сохранить</button>{message && <p role="status">{message==='saved'?'Настройки сохранены':'Проверьте значения полей'}</p>}</form></section><div className="actions"><form action={swap}><button className="secondary">Переключить демо-профиль</button></form><form action={logout}><button className="secondary">Выйти</button></form></div></>
}