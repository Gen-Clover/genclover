/**
 * QA for Clovi, the chat assistant: plays the conversation with right answers,
 * wrong answers and everyday human mistakes, and checks what Clovi does with
 * each. Runs the real engine (src/lib/clovi/engine.js) with the network faked.
 *
 *   npm run test:clovi
 *
 * Each case: the step it starts at, what the visitor types or taps, the step
 * Clovi should end on, and optionally what it should have stored.
 */
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let failures = 0
let passes = 0

try {
  const E = await server.ssrLoadModule('/src/lib/clovi/engine.js')
  const P = await server.ssrLoadModule('/src/lib/clovi/parse.js')
  const { validateApplication } = await server.ssrLoadModule('/src/lib/application.js')

  const JOBS = [{ id: 'data-analyst', title: 'Data Analyst', status: 'open', skills: ['SQL', 'Power BI', 'DAX'], experienceMin: 3, experienceMax: null, workplace: 'remote', locations: ['India'], summary: 'Data role', employmentType: 'full-time', postedAt: new Date().toISOString() }]
  const sent = { contact: [], lead: [], apply: [], transcript: [] }
  const ctx = {
    contact: async (s, o) => void sent.contact.push({ ...s.contact, updated: o?.updated }),
    lead: async (s) => (sent.lead.push(s.lead), { confirmation: true }),
    apply: async (s) => (sent.apply.push(s.job), { confirmation: true }),
    transcript: async (s) => void sent.transcript.push(s.messages.length),
    jobs: async () => JOBS,
  }
  const t = (text) => ({ kind: 'text', text })
  const c = (value, label = value) => ({ kind: 'chip', value, label })
  const ph = (phone, country = 'IN') => ({ kind: 'phone', phone, country })
  const file = (name, type, size) => ({ kind: 'file', file: { name, type, size } })
  const run = async (inputs, from = E.initialState()) => {
    let s = from
    for (const i of inputs) s = await E.reply(s, i, ctx)
    return s
  }
  const lastBot = (s) => s.messages.filter((m) => m.from === 'bot').slice(-1)[0]?.text ?? ''
  const shown = (i) => (i.kind === 'text' ? JSON.stringify(i.text) : i.kind === 'phone' ? `phone ${i.phone} (${i.country})` : i.kind === 'file' ? `file ${i.file.name}` : `tap ${i.value}`)

  const check = async (group, setup, input, expectStep, expectFn) => {
    const s = await E.reply(await run(setup), input, ctx)
    const okStep = expectStep === undefined || s.step === expectStep
    const detail = expectFn ? expectFn(s) : true
    const ok = okStep && detail === true
    if (ok) passes++
    else {
      failures++
      console.log(`✗ ${group}: ${shown(input)} → [${s.step}] ${lastBot(s).slice(0, 110)}${typeof detail === 'string' ? `  (${detail})` : ''}  expected [${expectStep}]`)
    }
    return s
  }
  const is = (label, actual, expected) => (actual === expected ? true : `${label} was ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`)

  /* ---------------------------------------------------------- starting points */
  const toName = [c('purpose:project')]
  const toEmail = [...toName, t('Rahul Verma')]
  const toPhone = [...toEmail, t('rahul@gmail.com')]
  const toService = [...toPhone, ph('98114 27365')]
  const toType = [...toService, c('service:websites')]
  const toTimeline = [...toType, c('type:startup')]
  const toBudget = [...toTimeline, c('timeline:asap')]
  const toDetails = [...toBudget, c('budget:')]
  const toRole = [c('purpose:job'), t('Rahul Verma'), t('rahul@gmail.com'), ph('98114 27365')]
  const toExp = [...toRole, c('role:data-analyst')]
  const toNotice = [...toExp, c('exp:4')]
  const toCity = [...toNotice, c('notice:30-days')]
  const toSkill = [...toCity, t('Pune')]
  const toLink = [...toSkill, c('skill:Expert'), c('skill:Expert'), c('skill:Expert')]
  const toCv = [...toLink, c('skip')]
  const toConfirm = [...toCv, file('cv.pdf', 'application/pdf', 1000)]
  const inChat = [c('purpose:question'), t('Rahul Verma'), t('rahul@gmail.com'), ph('98114 27365')]

  /* ----------------------------------------------------------------- purpose */
  for (const [text, step] of [['I want a website', 'name'], ['job', 'name'], ['are you hiring', 'name'], ['question', 'name'], ['I have a question?', 'name'], ['hi', 'purpose'], ['asdfgh', 'purpose'], ['🙂', 'purpose']])
    await check('purpose', [], t(text), step)

  /* -------------------------------------------------------------------- name */
  const name = (s) => s.contact.name
  for (const text of ['', 'a', '123', 'rahul@gmail.com', 'hi', 'Rahul123', 'yes', 'x'.repeat(80), '🙂🙂', '<script>x</script>', 'asdfgh', 'www.x.com'])
    await check('name rejects', toName, t(text), 'name')
  for (const [text, expected] of [['my name is rahul verma', 'Rahul Verma'], ['Dr. A.K. Sharma', 'Dr. A.K. Sharma'], ["O'Brien", "O'Brien"], ['राहुल', 'राहुल'], ['RAHUL VERMA', 'Rahul Verma'], ["I'm Priya", 'Priya'], ['Anne-Marie', 'Anne-Marie'], ['Priya.', 'Priya']])
    await check('name accepts', toName, t(text), 'email', (s) => is('name', name(s), expected))
  await check('name greeting skips title', toName, t('Dr. Anil Sharma'), 'email', (s) => (/Anil!/.test(lastBot(s)) ? true : 'greeting should use Anil'))

  /* ------------------------------------------------------------------- email */
  const email = (s) => s.contact.email
  for (const text of ['rahul', 'rahul@gmail', 'rahul@@gmail.com', '9876543210', 'rahul@gmail..com', 'rahul@.com'])
    await check('email rejects', toEmail, t(text), 'email')
  for (const [text, expected] of [[' Rahul@Gmail.com ', 'rahul@gmail.com'], ['my email is rahul@gmail.com', 'rahul@gmail.com'], ['rahul at gmail dot com', 'rahul@gmail.com'], ['rahul@gmail.com, other@x.com', 'rahul@gmail.com'], ['mailto:rahul@company.in', 'rahul@company.in'], ['rahul@company.co.in.', 'rahul@company.co.in']])
    await check('email accepts', toEmail, t(text), 'phone', (s) => is('email', email(s), expected))
  await check('email typo', toEmail, t('rahul@gmial.com'), 'email_fix')
  await check('email typo → yes', [...toEmail, t('rahul@gmial.com')], c('email:suggested'), 'phone', (s) => is('email', email(s), 'rahul@gmail.com'))
  await check('email typo → no', [...toEmail, t('rahul@gmial.com')], c('email:typed'), 'phone', (s) => is('email', email(s), 'rahul@gmial.com'))
  await check('email typo → typed yes', [...toEmail, t('rahul@gmail.co')], t('yes'), 'phone', (s) => is('email', email(s), 'rahul@gmail.com'))
  await check('email typo → retyped', [...toEmail, t('rahul@gmail.co')], t('rahul@gmail.com'), 'phone', (s) => is('email', email(s), 'rahul@gmail.com'))

  /* ------------------------------------------------------------------- phone */
  for (const i of [ph('12'), ph('abcdef'), ph(' '), ph('98765'), ph('12345 67890'), ph('98765 43210'), ph('99999 99999'), ph('+91 00000 00000')]) await check('phone rejects', toPhone, i, 'phone')
  for (const [i, country] of [[ph('+91 98114 27365'), 'IN'], [ph('098114 27365'), 'IN'], [ph('919811427365'), 'IN'], [ph('98114-27365'), 'IN'], [ph('+1 415 555 0123'), 'US'], [ph('07400 123456', 'GB'), 'GB']])
    await check('phone accepts', toPhone, i, 'p_service', (s) => is('country', s.contact.phoneCountry, country))
  await check('phone typed in message box', toPhone, t('98114 27365'), 'p_service')
  await check('phone as text rejects', toPhone, t('my number'), 'phone')

  /* ----------------------------------------------------------------- project */
  const lead = (s) => s.lead
  for (const [text, v] of [['website', 'websites'], ['online shop', 'ecommerce'], ['web app', 'web-applications'], ['AI chatbot', 'ai-automation'], ['data dashboard', 'data-analytics'], ["i don't know", 'other'], ['mobile app', 'other'], ['other', 'other']])
    await check('service', toService, t(text), 'p_type', (s) => is('service', lead(s).service, v))
  await check('service gibberish', toService, t('asdf'), 'p_service')
  for (const [text, v] of [['startup', 'startup'], ['big company', 'corporate'], ['MNC', 'corporate'], ['enterprise', 'enterprise'], ['small', 'small-business'], ['freelancer', 'other'], ['NGO', 'other']])
    await check('business type', toType, t(text), 'p_timeline', (s) => is('businessType', lead(s).businessType, v))
  await check('business type gibberish', toType, t('asdf'), 'p_type')
  for (const [text, v] of [['asap', 'asap'], ['next month', '1-2-months'], ['in 2 months', '2-3-months'], ['in 3 months', '3-6-months'], ['6 months', '6-plus-months'], ['next year', '6-plus-months'], ['no idea', 'not-sure'], ['flexible', 'flexible'], ['urgent', 'asap']])
    await check('timeline', toTimeline, t(text), 'p_budget', (s) => is('timeline', lead(s).timeline, v))
  await check('timeline gibberish', toTimeline, t('asdf'), 'p_timeline')
  for (const [text, v] of [['50k', '50k'], ['10 lakh', '10 lakh'], ['$20000', '$20000'], ['no budget', ''], ['idk', ''], ['not sure', '']])
    await check('budget', toBudget, t(text), 'p_details', (s) => is('budget', lead(s).budget, v))
  for (const text of ['x'.repeat(100), 'asdf', 'cheap']) await check('budget rejects', toBudget, t(text), 'p_budget')
  for (const text of ['yy', 'vcytdytfjhvbyu gfyfyufyugiulh', 'asdfasdfasdf', 'website', '1111111111111', 'aaaa bbbb cccc', 'hello there'])
    await check('details rejects', toDetails, t(text), 'p_details')
  await check('details accepts', toDetails, t('I need a website for my bakery with online orders'), 'chat', () => (sent.lead.length ? true : 'lead not sent'))
  await check('details accepts Hindi', toDetails, t('मुझे अपनी दुकान के लिए एक वेबसाइट चाहिए'), 'chat')

  /* --------------------------------------------------------------------- job */
  const job = (s) => s.job
  for (const [text, v] of [['data', 'data-analyst'], ['analyst', 'data-analyst'], ['Data Analyst', 'data-analyst'], ['general', 'general']])
    await check('role', toRole, t(text), 'j_exp', (s) => is('jobId', job(s).jobId, v))
  await check('role unknown', toRole, t('developer'), 'j_role', (s) => (/isn’t open/.test(lastBot(s)) ? true : 'should say the role is not open'))
  for (const [text, v] of [['5', '5'], ['five', '5'], ['5 years', '5'], ['2.5', '2'], ['fresher', '0'], ['none', '0'], ['10+', '10'], ['6 months', '0'], ['30', '21']])
    await check('experience', toExp, t(text), 'j_notice', (s) => is('experience', job(s).experienceYears, v))
  for (const text of ['-1', '100', 'asdf', 'lots']) await check('experience rejects', toExp, t(text), 'j_exp')
  for (const [text, v] of [['immediately', 'immediate'], ['now', 'immediate'], ['2 weeks', '15-days'], ['1 month', '30-days'], ['60 days', '60-days'], ['3 months', '90-days'], ['serving notice', 'serving']])
    await check('notice', toNotice, t(text), 'j_city', (s) => is('notice', job(s).noticePeriod, v))
  await check('notice gibberish', toNotice, t('asdf'), 'j_notice')
  for (const text of ['111', '!!!', 'x'.repeat(80), 'rahul@gmail.com', 'https://x.com', 'asdfgh'])
    await check('city rejects', toCity, t(text), 'j_city')
  for (const text of ['New Delhi', 'Bengaluru, India', 'Pune', 'São Paulo', 'मुंबई']) await check('city accepts', toCity, t(text), 'j_skill')
  for (const [text, v] of [['expert', 'Expert'], ['advanced', 'Expert'], ['good', 'Comfortable'], ['intermediate', 'Comfortable'], ['beginner', 'Learning'], ['9/10', 'Expert'], ['6 out of 10', 'Comfortable'], ['3/10', 'Learning']])
    await check('skill', toSkill, t(text), 'j_skill', (s) => is('SQL', job(s).skills.SQL, v))
  await check('skill gibberish', toSkill, t('asdf'), 'j_skill')
  for (const [text, v] of [['no', ''], ['skip', ''], ['not available', ''], ["don't have one", ''], ['linkedin.com/in/rahul', 'https://linkedin.com/in/rahul'], ['www.rahul.dev', 'https://www.rahul.dev/'], ['https://github.com/rahul', 'https://github.com/rahul'], ['medium.com/@rahul', 'https://medium.com/@rahul']])
    await check('link', toLink, t(text), 'j_cv', (s) => is('link', job(s).profileUrl, v))
  for (const text of ['https://x', 'http://localhost', 'rahul@gmail.com', '1111', 'my linkedin', '192.168.1.1']) await check('link rejects', toLink, t(text), 'j_link')
  await check('cv text', toCv, t('here is my cv'), 'j_cv')
  await check('cv no cv', toCv, t("I don't have my CV"), 'j_cv', (s) => (lastBot(s).includes('without a CV') || s.messages.at(-1).chips?.some((x) => x.value === 'cv:skip') ? true : 'should offer to send without CV'))
  await check('cv skip → handoff', toCv, c('cv:skip'), 'chat', (s) => (s.handoff ? true : 'should hand off'))
  for (const i of [file('photo.png', 'image/png', 1000), file('huge.pdf', 'application/pdf', 9e6), file('empty.pdf', 'application/pdf', 0), file('virus.exe', 'application/x-msdownload', 1000)])
    await check('cv rejects', toCv, i, 'j_cv')
  for (const i of [file('cv.pdf', 'application/pdf', 1000), file('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1000), file('CV.PDF', '', 1000)])
    await check('cv accepts', toCv, i, 'j_confirm')
  for (const text of ['yes', 'ok send', 'Yes please', 'sure', 'haan']) await check('confirm yes', toConfirm, t(text), 'chat', (s) => (s.sent.application ? true : 'not sent'))
  for (const text of ['no', 'wait', 'not yet', 'asdf']) await check('confirm not yes', toConfirm, t(text), 'j_confirm')
  await check('experience below role minimum still allowed', toExp, c('exp:1'), 'j_notice', (s) => (s.messages.some((m) => /asks for 3\+ years/.test(m.text ?? '')) ? true : 'should mention the requirement'))

  /* ---------------------------------------------------------------- back / edit */
  await check('back from email', toEmail, t('back'), 'name')
  await check('back from budget', toBudget, t('back'), 'p_timeline')
  await check('back from city', toCity, t('go back'), 'j_notice')
  await check('edit email in chat', inChat, t('change my email'), 'email')
  await check('edit email → saved', [...inChat, t('change my email')], t('new@company.com'), 'chat', (s) => (s.contact.email === 'new@company.com' && sent.contact.at(-1)?.updated ? true : 'email not updated / not re-sent'))
  await check('edit phone mid project', toBudget, t('my number is wrong'), 'phone')
  await check('edit phone → resumes project', [...toBudget, t('my number is wrong')], ph('91234 56789'), 'p_budget', (s) => is('phone', s.contact.phone, '+91 91234 56789'))
  await check('edit name', inChat, t('update my name'), 'name')
  await check('edit name → saved', [...inChat, t('update my name')], t('Rahul Kumar'), 'chat', (s) => is('name', s.contact.name, 'Rahul Kumar'))

  /* -------------------------------------------------------------------- chat */
  const unansweredAfter = async (text) => (await run([...inChat, t(text)])).unanswered.length
  for (const text of ['ok', 'hmm', '?', 'yes', 'no', 'lol', 'fuck you', 'you are useless', 'asdfgh', 'tell me more'])
    await check('chat no spam to team', inChat, t(text), 'chat').then(async () => {
      const n = await unansweredAfter(text)
      if (n) { failures++; console.log(`✗ chat: ${JSON.stringify(text)} was sent to the team as a question`) } else passes++
    })
  await check('chat real unknown question noted', inChat, t('do you work with blockchain and web3 projects?'), 'chat', (s) => (s.unanswered.length === 1 ? true : 'should note for team'))
  await check('chat restart hint', inChat, t('restart'), 'chat', (s) => (/↻/.test(lastBot(s)) ? true : 'should explain restart'))
  await check('chat start project', inChat, t('start a project'), 'p_service')
  await check('chat jobs', inChat, t('any openings?'), 'j_role')
  await check('chat handoff', inChat, t('can I speak to a person'), 'chat', (s) => (s.handoff ? true : 'no handoff'))
  await check('chat pricing', inChat, t('how much does a website cost'), 'chat', (s) => (/tailored|scope/i.test(lastBot(s)) ? true : 'no pricing answer'))
  const afterLead = [...toDetails, t('I need a website for my bakery with online orders')]
  await check('after lead: another project asks first', afterLead, t('start a new project'), 'chat', (s) => (/already with the team/.test(lastBot(s)) ? true : 'should ask about another brief'))
  await check('after lead: another project chip', afterLead, c('go:project'), 'p_service')
  await check('after lead: apply for job', afterLead, t('I want to apply for a job'), 'j_role')

  /* ------------------------------------------------------------ search answers */
  const K = await server.ssrLoadModule('/src/lib/clovi/knowledge.js')
  const answers = {
    'How much does a website cost?': 'pricing', 'where are you located': 'location', 'do you do power bi dashboards': 'service:data-analytics',
    'Have you built AI agents?': 'service:ai-automation', 'who are your clients': 'clients', 'do you sign NDA': 'privacy',
    'healthcare experience': 'industry:healthcare', 'Have you done anything in healthcare?': 'industry:healthcare', 'ecommerce store': 'service:ecommerce',
    'are you hiring': 'jobs', 'seo services': 'service:digital-marketing-seo', 'I need a website for my restaurant': 'service:websites',
    'do you work with startups': 'audience', 'do you build mobile apps': 'mobile', 'AI chatbot for customer support': 'service:ai-automation',
    'what is your pricing for maintenance': 'support', 'how long will it take': 'timeline', 'what is your process': 'process', 'how do you work': 'process',
    'can you work with our developers': 'inhouse', 'why should I choose you': 'why', 'can I get a call': 'contact', 'take over our existing app': 'start',
    'show me your work': 'work', 'do you use python': 'tech', 'churn prediction': 'project:customer-churn-prediction',
    blockchain: null, 'weather today': null, 'I like pizza': null, 'do you work with blockchain and web3 projects?': null,
  }
  for (const [q, expected] of Object.entries(answers)) {
    const got = K.search(q)?.id ?? null
    got === expected ? passes++ : (failures++, console.log(`✗ search: ${JSON.stringify(q)} → ${got}, expected ${expected}`))
  }

  /* ----------------------------------------------------- server-side rules match */
  const base = { name: 'Rahul Verma', email: 'r@x.com', phoneCountry: 'IN', phone: '98114 27365', city: 'Pune', experienceYears: '4', noticePeriod: '30-days', consent: true }
  for (const url of ['https://x', 'http://localhost', 'https://192.168.1.1', 'https://rahul@gmail.com'])
    (validateApplication({ ...base, profileUrl: url }).errors.profileUrl ? passes++ : (failures++, console.log(`✗ server accepts bad link ${url}`)))
  for (const url of ['https://linkedin.com/in/rahul', 'https://www.rahul.dev/', 'https://medium.com/@rahul'])
    (validateApplication({ ...base, profileUrl: url }).errors.profileUrl ? (failures++, console.log(`✗ server rejects good link ${url}`)) : passes++)
  for (const n of ['123', 'rahul@gmail.com', 'hi']) (P.parseName(n).error ? passes++ : (failures++, console.log(`✗ parseName accepts ${n}`)))

  /* ------------------------------------------------------- whole conversations */
  const full = await run([t('I need a website'), t('my name is priya sharma'), t('PRIYA@Gmial.com'), c('email:suggested'), ph('+91 98111 22333'), t('online store'), t('small business'), t('next month'), t('around 5 lakh'), t('An online store for handmade furniture with payments'), t('do you provide support after launch?'), t('thanks'), t('bye')])
  const fullOk = full.contact.name === 'Priya Sharma' && full.contact.email === 'priya@gmail.com' && full.sent.lead && full.lead.service === 'ecommerce' && full.lead.timeline === '1-2-months'
  fullOk ? passes++ : (failures++, console.log('✗ full project conversation', JSON.stringify({ contact: full.contact, lead: full.lead, sent: full.sent })))
  const fullJob = await run([t('are you hiring?'), t('Amit'), t('amit@yahoo.com'), t('9811122333'), t('data analyst'), t('three years'), t('one month'), t('Chandigarh'), t('good'), t('expert'), t('learning'), t('linkedin.com/in/amit'), file('Amit CV.pdf', 'application/pdf', 5000), t('yes send it')])
  const fullJobOk = fullJob.sent.application && fullJob.job.experienceYears === '3' && fullJob.job.noticePeriod === '30-days' && fullJob.job.skills.SQL === 'Comfortable'
  fullJobOk ? passes++ : (failures++, console.log('✗ full job conversation', fullJob.step, JSON.stringify(fullJob.job), lastBot(fullJob)))
} finally {
  await server.close()
}

console.log(`\nClovi QA: ${passes} passed, ${failures} failed`)
process.exit(failures ? 1 : 0)
