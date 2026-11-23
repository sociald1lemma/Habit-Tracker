import { db } from '@/lib/db'
import { userId } from '@/lib/session'
import { today } from '@/lib/dates'
import { body,habitSchema,invalid } from '@/lib/api'
export async function GET() {
  return Response.json(await db.habit.findMany({where:{userId:await userId()}}))
}
export async function POST(req:Request) {
  const data=habitSchema.safeParse(await body(req))
  if (!data.success) return invalid()
  return Response.json(await db.habit.create({data:{...data.data,start:today(),userId:await userId()}}),{status:201})
}