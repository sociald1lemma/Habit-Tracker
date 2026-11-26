import './style.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import localFont from 'next/font/local'
import { cookies } from 'next/headers'
import { verify } from '@/lib/token'
import { db } from '@/lib/db'
import mark from './habit-mark.png'

const manropeLatin = localFont({
  src: './fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope-latin',
  adjustFontFallback: false,
})
const manropeCyrillic = localFont({
  src: './fonts/manrope-cyrillic-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope-cyrillic',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: { default: 'Страница Habit Tracker — дневник привычек', template: '%s | Habit Tracker' },
  description: 'Планируйте привычки, отмечайте выполнение и следите за прогрессом.',
}

const navigation = [
  ['/', 'Сегодня'],
  ['/calendar', 'Календарь'],
  ['/stats', 'Статистика'],
  ['/settings', 'Настройки'],
]

export default async function Layout({ children }: { children: React.ReactNode }) {
  const id = await verify((await cookies()).get('session')?.value)
  const settings = id ? await db.userSettings.findUnique({ where: { userId: id } }) : null

  return (
    <html lang="ru" data-theme={settings?.theme} className={manropeLatin.variable + ' ' + manropeCyrillic.variable}>
      <body>
        <a className="skip-link" href="#content">К содержимому</a>
        <header>
          <div className="wrap flex flex-wrap items-center justify-between gap-3">
            <Link className="brand" href="/">
              <Image src={mark} alt="" width={32} height={32} />
              Habit Tracker
            </Link>
            {id && (
              <nav aria-label="Основная навигация">
                {navigation.map(([url, title]) => <Link href={url} key={url}>{title}</Link>)}
              </nav>
            )}
          </div>
        </header>
        <main id="content" className="wrap" tabIndex={-1}>{children}</main>
      </body>
    </html>
  )
}