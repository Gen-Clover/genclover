// Clinic data and the scheduling rules shared by the three views.

export const DOCTORS = [
  { id: 'mehta', name: 'Dr. Anaya Mehta', role: 'General physician', hue: 168, start: '09:00', end: '13:00', slot: 15, breaks: ['11:00', '11:15'], room: 'Room 1' },
  { id: 'khan', name: 'Dr. Farhan Khan', role: 'Paediatrician', hue: 24, start: '10:00', end: '14:00', slot: 20, breaks: ['12:00'], room: 'Room 2' },
  { id: 'iyer', name: 'Dr. Leela Iyer', role: 'Dermatologist', hue: 262, start: '09:30', end: '13:30', slot: 30, breaks: [], room: 'Room 3' },
]

export const REASONS = ['Fever or cold', 'Follow-up visit', 'Skin concern', 'Child check-up', 'Report review', 'Something else']

export const toMin = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
export const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
export const label = (t) => {
  const n = toMin(t)
  const h = Math.floor(n / 60)
  return `${((h + 11) % 12) + 1}:${String(n % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

// every bookable start time for a doctor, minus breaks
export const slotsFor = (doc) => {
  const out = []
  for (let t = toMin(doc.start); t + doc.slot <= toMin(doc.end); t += doc.slot) {
    if (!doc.breaks.includes(fromMin(t))) out.push(fromMin(t))
  }
  return out
}

const active = (b) => b.status !== 'cancelled'

// slots with their state for one doctor on one day; `now` (minutes) hides past slots today
export const availability = (doc, date, bookings, now = null) =>
  slotsFor(doc).map((time) => ({
    time,
    taken: bookings.some((b) => active(b) && b.doctor === doc.id && b.date === date && b.time === time),
    past: now != null && toMin(time) < now,
  }))

export const firstFree = (doc, date, bookings, now = null) =>
  availability(doc, date, bookings, now).find((s) => !s.taken && !s.past)?.time ?? null

// tokens follow appointment time, so they stay stable as people book
export const tokenOf = (booking, bookings) =>
  bookings
    .filter((b) => active(b) && b.doctor === booking.doctor && b.date === booking.date)
    .sort((a, b) => toMin(a.time) - toMin(b.time))
    .indexOf(booking) + 1

// who the doctor sees next: the one in the room, then arrivals by appointment time
export const queueFor = (docId, date, bookings) => {
  const day = bookings.filter((b) => b.doctor === docId && b.date === date)
  const byTime = (a, b) => toMin(a.time) - toMin(b.time)
  return {
    current: day.find((b) => b.status === 'in') ?? null,
    waiting: day.filter((b) => b.status === 'arrived').sort(byTime),
    later: day.filter((b) => b.status === 'booked').sort(byTime),
    done: day.filter((b) => b.status === 'done').length,
  }
}

export const validPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/[\s-]/g, ''))
