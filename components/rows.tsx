'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState,useTransition } from 'react'
import type { Habit,HabitLog } from '@prisma/client'
export default function Rows({habits,date}:{habits:(Habit & {logs:HabitLog[]})[],date:string}) {
  const router=useRouter(), [busy,setBusy]=useState(false), [pending,transition]=useTransition(), [error,setError]=useState('')
  async function mark(habitId:number,done:boolean) {
    setBusy(true);setError('')
    try {
      const res=await fetch('/api/logs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({habitId,date,done})})
      if (!res.ok) throw Error()
      transition(()=>router.refresh())
    } catch {setError('Не удалось сохранить отметку. Повторите попытку.')} finally {setBusy(false)}
  }
  return <>{error && <p role="alert">{error}</p>}{!habits.length && <p className="panel">На эту дату привычек нет.</p>}{habits.map(h=><div key={h.id} className="row"><button disabled={busy||pending} aria-label={'Отметить: '+h.title} aria-pressed={!!h.logs.length} className={'mark '+(h.logs.length?'':'secondary')} onClick={()=>mark(h.id,!h.logs.length)}>{h.logs.length?'✓':'○'}</button><div className="grow"><small style={{borderLeft:'4px solid '+h.color,paddingLeft:6}}>{h.category} · {h.target} дн./нед.</small><h3>{h.icon} {h.title}</h3>{h.description && <p>{h.description}</p>}</div><Link className="text" aria-label={'Изменить: '+h.title} href={'/habits/'+h.id+'/edit'}>Изменить</Link></div>)}</>
}