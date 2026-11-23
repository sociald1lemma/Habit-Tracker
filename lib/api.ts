import { z } from 'zod'
export const habitSchema=z.object({
  title:z.string().trim().min(1).max(80),description:z.string().trim().max(500),
  kind:z.enum(['build','avoid']),category:z.string().trim().min(1).max(40),
  target:z.number().int().min(1).max(7),color:z.string().regex(/^#[0-9a-f]{6}$/i),
  icon:z.string().trim().min(1).max(12)
}).strict()
export const error=(message:string,status:number)=>Response.json({error:message},{status})
export const missing=()=>error('Привычка не найдена',404)
export const invalid=()=>error('Проверьте значения полей',400)
export const body=(request:Request)=>request.json().catch(()=>null)