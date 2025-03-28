
import JsonDB from './elio-json-db/JsonDB.js';

export const db = new JsonDB({
  menus: {
    id: { type: "string", primary: true, unique: true, autoIncrement: true },
    title: { type: "string", notNull: true },
    description: { type: "string", notNull: true },
    emoji: { type: "string", notNull: true, default: "🍎" },
    created_at: { type: "string", default: () => new Date().toISOString() },
    updated_at: { type: "string", onUpdate: () => new Date().toISOString() }
  },
  invitations: {
    id: { type: "string", primary: true, unique: true, autoIncrement: true },
    code: { type: "string", notNull: true },
    name: { type: "string", notNull: true, default:"" },
    leader: { type: "boolean", notNull: true, default: false },
    name_locked: { type: "boolean", notNull: true, default: false },
    menu_id: { type: "string", notNull: false, default: null },
    confirmed: { type: "boolean", notNull: false, default:null },
    created_at: { type: "string", default: () => new Date().toISOString() },
    updated_at: { type: "string", onUpdate: () => new Date().toISOString() }
  }
})


