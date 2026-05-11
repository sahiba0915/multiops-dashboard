import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const TENANTS = ['t1', 't2', 't3', 't4', 't5']
const ROLES = ['admin', 'manager', 'user']
const ORDER_STATUSES = ['pending', 'completed', 'cancelled']

const users = []
for (let i = 1; i <= 120; i += 1) {
  const tenantId = TENANTS[(i - 1) % TENANTS.length]
  users.push({
    id: `u${String(i).padStart(4, '0')}`,
    tenantId,
    name: `User ${i}`,
    email: `user${i}@tenant-${tenantId}.example.com`,
    role: ROLES[i % ROLES.length],
  })
}

const orders = []
for (let i = 1; i <= 1200; i += 1) {
  const tenantId = TENANTS[i % TENANTS.length]
  const day = 1 + (i % 90)
  orders.push({
    id: `o${String(i).padStart(5, '0')}`,
    tenantId,
    customerName: `Customer ${(i % 220) + 1} LLC`,
    amount: Math.round(100 + Math.random() * 9999),
    status: ORDER_STATUSES[i % ORDER_STATUSES.length],
    createdAt: new Date(Date.UTC(2026, 0, day, 10, (i * 7) % 60, 0)).toISOString(),
  })
}

const outPath = join(root, 'mock', 'db.json')
writeFileSync(outPath, JSON.stringify({ users, orders }, null, 2), 'utf-8')
console.log(`Wrote ${users.length} users and ${orders.length} orders to ${outPath}`)
