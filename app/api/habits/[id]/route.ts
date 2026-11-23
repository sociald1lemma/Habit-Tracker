import { db } from '@/lib/db'
import { userId } from '@/lib/session'
import { body,habitSchema,invalid,missing } from '@/lib/api'
type Context={params:Promise<{id:string}>}
async function owner(ctx:Context) {
  const id=Number((await ctx.params).id)
  return {id:Number.isSafeInteger(id)?id:-1,userId:await userId()}
}
export async function GET(_:Request,ctx:Context) {
  const habit=await db.habit.findFirst({where:await owner(ctx)})
  return habit?Response.json(habit):missing()
}
export async function PATCH(req:Request,ctx:Context) {
  const result=habitSchema.partial().safeParse(await body(req))
  if (!result.success || !Object.keys(result.data).length) return invalid()
  const {count}=await db.habit.updateMany({where:await owner(ctx),data:result.data})
  return count?Response.json({ok:true}):missing()
}
export async function DELETE(_:Request,ctx:Context) {
  const {count}=await db.habit.deleteMany({where:await owner(ctx)})
  return count?new Response(null,{status:204}):missing()
}