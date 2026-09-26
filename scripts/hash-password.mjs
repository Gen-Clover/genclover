/**
 * Prints the values for the admin portal's environment variables.
 *
 *   npm run admin:hash-password
 *
 * Type the password when asked (it is not echoed). Paste the output into
 * Vercel → Settings → Environment Variables, or into .env.local for local dev.
 * The password itself is never stored anywhere, only its salted scrypt hash.
 */
import { randomBytes } from 'node:crypto'
import { hashPassword } from '../api/_lib/auth.js'

const ask = (prompt) =>
  new Promise((resolveAnswer) => {
    process.stdout.write(prompt)
    const stdin = process.stdin
    let value = ''
    if (stdin.isTTY) stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
    const onData = (char) => {
      if (char === '\r' || char === '\n' || char === '\u0004') {
        if (stdin.isTTY) stdin.setRawMode(false)
        stdin.pause()
        stdin.off('data', onData)
        process.stdout.write('\n')
        resolveAnswer(value)
      } else if (char === '\u0003') {
        process.exit(1)
      } else if (char === '\u007f' || char === '\b') {
        value = value.slice(0, -1)
      } else {
        value += char
      }
    }
    stdin.on('data', onData)
  })

const password = await ask('Admin password (12+ characters): ')
if (password.length < 12) {
  console.error('Use at least 12 characters.')
  process.exit(1)
}
const confirm = await ask('Type it again: ')
if (confirm !== password) {
  console.error('The two passwords do not match.')
  process.exit(1)
}

console.log('\nADMIN_PASSWORD_HASH=' + hashPassword(password))
console.log('ADMIN_SESSION_SECRET=' + randomBytes(32).toString('base64url'))
console.log('\nAlso set ADMIN_EMAIL to the address you will sign in with.')
