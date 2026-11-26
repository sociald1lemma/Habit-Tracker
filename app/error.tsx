'use client'

import Link from 'next/link'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel">
      <h1>Не удалось открыть страницу</h1>
      <p role="alert">Попробуйте загрузить её снова или вернитесь к своим привычкам.</p>
      <div className="actions mt-4">
        <button type="button" onClick={reset}>Повторить</button>
        <Link className="text" href="/">К списку привычек</Link>
      </div>
    </section>
  )
}