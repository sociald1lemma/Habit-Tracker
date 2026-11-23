import './style.css'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { verify } from '@/lib/token'
import { db } from '@/lib/db'
export const metadata={title:'Habit Tracker · Дневник привычек'}
export default async function Layout({children}:{children:React.ReactNode}) {
  const id=await verify((await cookies()).get('session')?.value)
  const settings=id?await db.userSettings.findUnique({where:{userId:id}}):null
  return <html lang="ru" data-theme={settings?.theme}><body><header><div className="wrap flex flex-wrap items-center justify-between gap-4"><Link className="brand" href="/">◒ Habit Tracker</Link>{id && <nav>{[['/','Сегодня'],['/calendar','Календарь'],['/stats','Статистика'],['/settings','Настройки']].map(([url,title])=><Link href={url} key={url}>{title}</Link>)}</nav>}</div></header><main className="wrap">{children}</main></body></html>
}