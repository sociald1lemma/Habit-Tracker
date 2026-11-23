'use client'
import type { Habit } from '@prisma/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function Editor({habit:h}:{habit?:Habit}) {
  const router=useRouter(),[error,setError]=useState(''),[busy,setBusy]=useState(false)
  async function save(form?:FormData) {
    if (!form && !confirm('Удалить привычку вместе с историей?')) return
    setBusy(true);setError('')
    try {
      const res=await fetch('/api/habits'+(h?'/'+h.id:''),{method:form?(h?'PATCH':'POST'):'DELETE',headers:{'Content-Type':'application/json'},body:form?JSON.stringify({...Object.fromEntries(form),target:Number(form.get('target'))}):undefined})
      if (!res.ok) throw Error((await res.json()).error)
      router.push('/');router.refresh()
    } catch(e){setError(e instanceof Error?e.message:'Ошибка сохранения');setBusy(false)}
  }
  return <section className="panel"><form onSubmit={e=>{e.preventDefault();void save(new FormData(e.currentTarget))}}>
  <label>Название<input required maxLength={80} name="title" defaultValue={h?.title}/></label><label>Описание<textarea name="description" maxLength={500} defaultValue={h?.description}/></label>
  <label>Категория<input required maxLength={40} name="category" defaultValue={h?.category??'Здоровье'}/></label><label>Тип<select name="kind" defaultValue={h?.kind}><option value="build">Полезная</option><option value="avoid">Отказ от вредной</option></select></label>
  <label>Цель, дней в неделю<input type="number" required min="1" max="7" name="target" defaultValue={h?.target??5}/></label><label>Значок<input name="icon" required maxLength={12} defaultValue={h?.icon??'✦'}/></label><label>Цвет<input type="color" className="p-0" name="color" defaultValue={h?.color??'#42795c'}/></label>
  {error && <p role="alert">{error}</p>}<div className="actions"><button disabled={busy}>Сохранить</button>{h && <button disabled={busy} type="button" className="secondary" onClick={()=>save()}>Удалить</button>}</div></form></section>
}