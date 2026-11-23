import { today,shift } from '@/lib/dates'
import { db } from '@/lib/db'
import { userId } from '@/lib/session'
function streak(dates:string[],now:string) {
  let best=0,run=0,previous=''
  for (const d of dates) {
    run=previous && shift(previous,1)===d?run+1:1
    best=Math.max(best,run);previous=d
  }
  return {best,current:previous>=shift(now,-1)?run:0}
}
export default async function Stats() {
  const now=today(),habits=await db.habit.findMany({where:{userId:await userId()},include:{logs:{orderBy:{date:'asc'}}}})
  function rate(n:number) {
    let actual=0,possible=0
    for(const h of habits) for(let i=0;i<n;i++) {
      const d=shift(now,-i)
      if(d<h.start) continue
      possible++;if(h.logs.some(l=>l.date===d)) actual++
    }
    return possible?Math.round(100*actual/possible):0
  }
  return <><h1>Статистика</h1><div className="grid sm:grid-cols-3 gap-3">{[['Привычек',habits.length],['За 7 дней',rate(7)+'%'],['За 30 дней',rate(30)+'%']].map(([k,v])=><article className="panel" key={k}><small>{k}</small><h2>{v}</h2></article>)}</div><p>Процент показывает долю отмеченных дней по всем привычкам с даты их создания.</p><section className="panel"><h2>Выполнение за неделю</h2><div className="grid7 items-end mt-6">{Array.from({length:7},(_,i)=>shift(now,i-6)).map(d=>{const n=habits.filter(h=>h.logs.some(l=>l.date===d)).length;return <div key={d} className="text-center"><small>{n}</small><div className="bar mx-auto w-3/4" style={{height:100*n/(habits.length||1)}}/><small>{d.slice(-2)}.{d.slice(5,7)}</small></div>})}</div></section><h2>Серии по привычкам</h2>{habits.map(h=>{const s=streak(h.logs.map(l=>l.date),now);return <div key={h.id} className="row"><div className="grow"><h3>{h.icon} {h.title}</h3><p>Текущая серия {s.current} дн. · лучшая {s.best} дн.</p></div></div>})}</>
}