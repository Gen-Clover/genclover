// Stock rules for a small fastener factory: reserve, ship, make and reorder.

export const available = (item) => item.onHand - item.reserved
export const isLow = (item) => available(item) <= item.reorder

const find = (items, sku) => {
  const it = items.find((i) => i.sku === sku)
  if (!it) throw new Error(`unknown item ${sku}`)
  return it
}

// what an order is missing right now, line by line
export const shortfall = (order, items) =>
  order.lines.map(([sku, qty]) => [sku, Math.max(0, qty - available(find(items, sku)))]).filter(([, short]) => short > 0)

export function reserve(order, items) {
  if (order.status !== 'new') throw new Error(`${order.id} is already ${order.status}`)
  if (shortfall(order, items).length) throw new Error(`${order.id} is short`)
  order.lines.forEach(([sku, qty]) => (find(items, sku).reserved += qty))
  order.status = 'picking'
}

export function pack(order) {
  if (order.status !== 'picking') throw new Error(`${order.id} isn't being picked`)
  order.status = 'packed'
}

export function ship(order, items) {
  if (order.status !== 'packed') throw new Error(`${order.id} isn't packed`)
  order.lines.forEach(([sku, qty]) => {
    const it = find(items, sku)
    it.onHand -= qty
    it.reserved -= qty
  })
  order.status = 'shipped'
}

// raw material needed to make `qty` of a finished item, and what's missing
export const needs = (sku, qty, items) =>
  find(items, sku).bom.map(([raw, per]) => {
    const need = +(per * qty).toFixed(2)
    return { sku: raw, need, short: Math.max(0, +(need - available(find(items, raw))).toFixed(2)) }
  })

export function make(sku, qty, items) {
  const req = needs(sku, qty, items)
  if (req.some((r) => r.short > 0)) throw new Error(`not enough raw material for ${sku}`)
  req.forEach((r) => (find(items, r.sku).onHand = +(find(items, r.sku).onHand - r.need).toFixed(2)))
  find(items, sku).onHand += qty
  return req
}

// suggested purchase: back up to twice the reorder point
export const suggestQty = (item) => Math.max(0, Math.ceil(item.reorder * 2 - available(item)))

export function receive(sku, qty, items) {
  find(items, sku).onHand = +(find(items, sku).onHand + qty).toFixed(2)
}
