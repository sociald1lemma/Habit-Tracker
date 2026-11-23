import Editor from '@/components/editor'
import { db } from '@/lib/db'
import { userId } from '@/lib/session'
import { notFound } from 'next/navigation'
export default async function Edit({params}:{params:Promise<{id:string}>}) {
  const id=Number((await params).id)
  if (!Number.isSafeInteger(id)) notFound()
  const habit=await db.habit.findFirst({where:{id,userId:await userId()}})
  if (!habit) notFound()
  return <><h1>Изменить привычку</h1><Editor habit={habit}/></>
}