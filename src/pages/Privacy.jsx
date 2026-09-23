import { AlertTriangle } from 'lucide-react'
import { PageHero, Section } from '../components/ui/Section'
import { contact, site } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'

/**
 * Privacy notice. (Spec §19 — required before production lead collection.)
 *
 * IMPORTANT: this is a working draft that describes what the site actually
 * does today. It has not been reviewed by a lawyer and the Product Owner must
 * supply or approve final legal wording — including the company's registered
 * entity name, data-retention period and any regional obligations — before this
 * page goes live. The review banner below stays until that happens.
 */
const Privacy = () => {
  usePageMeta(pageMeta.privacy)

  const sections = [
    {
      title: 'What we collect',
      body: [
        'When you submit the Start a Project form we collect the information you enter: the service you are interested in, your business type, your region, an optional budget range, an optional timeline, your project description, and your contact details (name, optional company, email address and phone number).',
        'We also record the page you submitted from, the time of submission, and - where available - the referring site and any campaign parameters in the URL. This tells us which parts of the site are actually useful.',
      ],
    },
    {
      title: 'Why we collect it',
      body: [
        'To respond to your enquiry and to understand what you need well enough to reply usefully. That is the only purpose.',
        'We process this information on the basis of your consent, which you give by ticking the consent box before submitting the form.',
      ],
    },
    {
      title: 'What we do not do',
      body: [
        'We do not sell your information. We do not share it with advertisers or data brokers. We do not add you to a marketing list because you made an enquiry.',
        'We do not collect special category personal data through this website, and we ask you not to include sensitive information in your project description.',
      ],
    },
    {
      title: 'Who can see it',
      body: [
        'Your enquiry is delivered to the Gen Clover team. We use third-party infrastructure to host this website and to deliver enquiry notifications; those providers process the data on our behalf and only for that purpose.',
      ],
    },
    {
      title: 'How long we keep it',
      body: [
        'We keep enquiry records for as long as needed to respond and to maintain a record of our conversation. If you would like your enquiry deleted, email us and we will remove it.',
      ],
    },
    {
      title: 'Your rights',
      body: [
        'You can ask us what we hold about you, ask us to correct it, or ask us to delete it. You can withdraw your consent at any time. To do any of these, email us at the address below.',
      ],
    },
    {
      title: 'Cookies and analytics',
      body: [
        'This website does not set advertising cookies. We store campaign attribution for the length of your browser session so that an enquiry can be connected to how you arrived. Analytics, where enabled, is configured not to collect unnecessary personal information.',
      ],
    },
    {
      title: 'Contact',
      body: [
        `For any question about this notice or about information we hold, email ${contact.email}.`,
      ],
    },
  ]

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy notice."
        description={`How ${site.name} handles the information you submit through this website.`}
      />

      <Section>
        <div
          role="note"
          className="mb-12 flex items-start gap-3.5 rounded-xl border border-accent-800 bg-accent-950/40 p-5"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-silver-300">
            <span className="font-medium text-silver-100">Draft pending approval.</span> This
            notice describes what the website does today, but the final legal wording - including
            the registered entity name, retention period and regional obligations - has not yet
            been supplied. It must be reviewed and approved before production lead collection
            begins.
          </p>
        </div>

        <div className="max-w-prose space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-silver-100">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed text-silver-400">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}

export default Privacy
