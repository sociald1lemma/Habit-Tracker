import type { Metadata } from 'next'
import Link from 'next/link'
import Rows from '@/components/rows'
import { db } from '@/lib/db'
import { today } from '@/lib/dates'
import { userId } from '@/lib/session'
export const metadata: Metadata = {
  title: 'Мои привычки на сегодня | Habit Tracker',
  description: 'Отмечайте выполненные привычки, следите за дневной целью и фильтруйте список.',
}

export default async function Home({searchParams}:{searchParams:Promise<{kind?:string}>}) {
  const date=today(), id=await userId(), kind=(await searchParams).kind
  const habits=await db.habit.findMany({where:{userId:id,start:{lte:date}},include:{logs:{where:{date}}},orderBy:{id:'asc'}})
  const goal=(await db.userSettings.findUnique({where:{userId:id}}))?.goal??3
  const count=habits.filter(h=>h.logs.length).length
  return <><small>{date.split('-').reverse().join('.')}</small><h1>Мои привычки</h1><section className="panel"><h2>Прогресс дня</h2><p>{count} из {habits.length} выполнено · личная цель {goal}</p><progress aria-label="Выполнение привычек за день" value={count} max={habits.length||1}/></section><div className="actions my-6"><Link className="btn" href="/habits/new">+ Новая привычка</Link>{[['','Все'],['build','Полезные'],['avoid','Отказ от вредных']].map(([k,title])=><Link className={k===(kind||'')?'font-bold underline':''} key={k} href={k?'/?kind='+k:'/'}>{title}</Link>)}</div><Rows habits={habits.filter(h=>!['avoid','build'].includes(kind||'') || h.kind===kind)} date={date}/></>
}
