import { randomBytes, scryptSync } from 'node:crypto'
import { db } from '../lib/db'
import { shift, today } from '../lib/dates'

const examples = [
  ['Утренняя растяжка','Движение','☀'], ['Читать 15 минут','Развитие','📖'],
  ['Пройти 6000 шагов','Движение','👟'], ['Выпить воду утром','Здоровье','💧'],
  ['Записать три мысли','Рефлексия','✎'], ['Вечер без соцсетей','Отдых','☾'],
  ['Лечь до полуночи','Отдых','☾'], ['День без газировки','Питание','🍋'],
  ['Повторить новые слова','Развитие','✦'], ['Прогулка в обед','Движение','☀'],
  ['Овощи на ужин','Питание','🥕'], ['Перерыв без телефона','Отдых','☕']
]
async function seed() {
  for (const [login,name] of [['demo','Алекс'],['guest','Саша']]) {
    const salt = randomBytes(16).toString('hex')
    const passwordHash = salt + ':' + scryptSync('habit-demo',salt,64).toString('hex')
    await db.$transaction(async tx => {
      const user = await tx.user.upsert({where:{login}, update:{}, create:{login,name,passwordHash,settings:{create:{}}}})
      if (await tx.habit.count({where:{userId:user.id}})) return
      for (const [i,[title,category,icon]] of examples.slice(0,login==='demo'?12:3).entries()) {
        const start = shift(today(),-13)
        const dates = Array.from({length:14},(_,j)=>j).filter(j=>(j*3+i)%7<4 && (j!==13 || i<5))
        await tx.habit.create({data:{title,category,icon,userId:user.id,start,target:3+i%5,
          color:['#42795c','#bf704d','#697abc'][i%3],kind:[5,7,11].includes(i)?'avoid':'build',
          logs:{create:dates.map(j=>({date:shift(start,j)}))}}})
      }
    })
  }
}
seed().finally(()=>db.$disconnect())