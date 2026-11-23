import { z } from 'zod'
import { db } from '@/lib/db'
import { today } from '@/lib/dates'
import { userId } from '@/lib/session'
import { body,invalid,missing } from '@/lib/api'
const schema=z.object({habitId:z.number().int().positive(),date:z.string().date(),done:z.boolean()}).strict()
export async function POST(req:Request) {
  const parsed=schema.safeParse(await body(req))
  if (!parsed.success) return invalid()
  const {habitId,date,done}=parsed.data
  const owner=await userId()
  return db.$transaction(async tx=>{
    const habit=await tx.habit.findFirst({where:{id:habitId,userId:owner}})
    if (!habit) return missing()
    if (date>today() || date<habit.start) return invalid()
    if (done) await tx.habitLog.upsert({where:{habitId_date:{habitId,date}},create:{habitId,date},update:{}})
    else await tx.habitLog.deleteMany({where:{habitId,date}})
    return Response.json({done})
  })
}
export const PATCH=POST