import type { Metadata } from 'next'
import Link from 'next/link'
import { z } from 'zod'
import { db } from '@/lib/db'
import { userId } from '@/lib/session'
import { today,shift } from '@/lib/dates'
import Rows from '@/components/rows'
export const metadata: Metadata = {
  title: 'Календарь отметок по привычкам',
  description: 'Просматривайте прошлые дни и меняйте отметки в календаре привычек.',
}

export default async function Calendar({searchParams}:{searchParams:Promise<{date?:string}>}) {
  const now=today(),raw=(await searchParams).date
  const date=raw && z.string().date().safeParse(raw).success && raw<=now && raw>='1900-01-01'?raw:now
  const first=date.slice(0,7)+'-01',next=shift(first,32).slice(0,7)+'-01'
  const habits=await db.habit.findMany({where:{userId:await userId()},include:{logs:{where:{date:{gte:first,lt:next}}}}})
  const days=Array.from({length:Number(shift(next,-1).slice(-2))},(_,i)=>shift(first,i))
  const offset=(new Date(first+'T12:00Z').getUTCDay()+6)%7
  return <><h1>Календарь</h1><section className="panel calendar-panel"><div className="actions justify-between"><Link aria-label="Предыдущий месяц" href={'?date='+shift(first,-1)}>←</Link><h2>{new Intl.DateTimeFormat('ru',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(first))}</h2>{next<=now?<Link aria-label="Следующий месяц" href={'?date='+next}>→</Link>:<span/>}</div><div className="grid7 calendar-grid">{'Пн Вт Ср Чт Пт Сб Вс'.split(' ').map(d=><small className="text-center" key={d}>{d}</small>)}{Array.from({length:offset},(_,i)=><span key={i}/>)}{days.map(d=>d>now?<span className="day opacity-40" key={d}>{Number(d.slice(-2))}</span>:<Link aria-current={d===date?'date':undefined} className={'day '+(d===date?'active':'')} key={d} href={'?date='+d}>{Number(d.slice(-2))}<span>✓ {habits.filter(h=>h.logs.some(l=>l.date===d)).length}</span></Link>)}</div></section><h2>Отметки за {date.split('-').reverse().join('.')}</h2><Rows date={date} habits={habits.filter(h=>h.start<=date).map(h=>({...h,logs:h.logs.filter(l=>l.date===date)}))}/></>
}
