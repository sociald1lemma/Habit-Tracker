export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Novosibirsk' }).format(new Date())
export function shift(date: string, days: number) {
  const d = new Date(date + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}