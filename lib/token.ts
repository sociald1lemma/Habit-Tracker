const encoder = new TextEncoder()
async function key() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret === 'change-me-in-local-env') throw Error('Set a local AUTH_SECRET')
  return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])
}
export async function issue(id:number) {
  const body = id+'.'+(Date.now()+7*86400000)
  const signature = await crypto.subtle.sign('HMAC',await key(),encoder.encode(body))
  return body+'.'+Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('')
}
export async function verify(value='') {
  if (!/^\d+\.\d+\.[0-9a-f]{64}$/.test(value)) return null
  const [id,expires,hex] = value.split('.')
  if (Number(expires)<=Date.now()) return null
  const bytes=Uint8Array.from(hex.match(/../g)!,s=>parseInt(s,16))
  return await crypto.subtle.verify('HMAC',await key(),bytes,encoder.encode(id+'.'+expires)) ? Number(id) : null
}