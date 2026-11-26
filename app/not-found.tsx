import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="panel">
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес. Возможно, привычка уже удалена.</p>
      <Link className="btn mt-4" href="/">К списку привычек</Link>
    </section>
  )
}