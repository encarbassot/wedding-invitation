import { generateAlphaNumericNonRepeated } from "./crypto.js"

const EMAIL_CODE_EXPIRATION = process.env.EMAIL_CODE_EXPIRATION || 20 // Minutos

export default class CodeVerificationList {
  constructor() {
    this.list = new Map() // Map para búsquedas rápidas
    setInterval(() => this.sanitize(), EMAIL_CODE_EXPIRATION * 60 * 1000 * 10) // Auto-limpieza periódica
  }

  push(user) {
    const existing = this.list.get(user.id)
    if (existing) {
      existing.timestamp = Date.now()
      return existing // Retorna el código existente
    }

    const code = generateAlphaNumericNonRepeated(6, [...this.list.values()], x => x.code, 20)

    const obj = { user, code, timestamp: Date.now() }
    this.list.set(user.id, obj)

    console.log("CODE GENERATED", code)
    return obj
  }

  check(code, user) {
    const found = this.list.get(user.id)
    if (!found || found.code !== code) return null

    const now = Date.now()
    if (now - found.timestamp > EMAIL_CODE_EXPIRATION * 60 * 1000) {
      this.list.delete(user.id)
      return null
    }

    return found
  }

  sanitize() {
    const now = Date.now()
    for (const [id, data] of this.list.entries()) {
      if (now - data.timestamp > EMAIL_CODE_EXPIRATION * 60 * 1000 * 10) {
        this.list.delete(id)
      }
    }
  }
}
