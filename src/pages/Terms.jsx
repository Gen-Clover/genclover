import { Link } from 'react-router-dom'
import { PageHero, Section } from '../components/ui/Section'
import { contact, site, routes } from '../data/site'
import { usePageMeta, pageMeta } from '../lib/seo'

/**
 * Terms of Use for the website. (Spec §19)
 *
 * Covers use of the website only; client engagements are governed by their own
 * written agreements. Written in plain language and not yet reviewed by a
 * lawyer; a legal review is recommended before relying on it.
 */
const LAST_UPDATED = 'September 2026'

const Terms = () => {
  usePageMeta(pageMeta.terms)

  const sections = [
    {
      title: 'About these terms',
      body: [
        `These terms apply when you use ${site.url.replace('https://', '')} (the "website"), which is operated by ${site.name} ("we", "us"). By using the website you agree to them. If you do not agree, please do not use the website.`,
      ],
    },
    {
      title: 'Using the website',
      body: [
        'You may browse the website, share links to it and contact us through it. You agree not to use it for anything unlawful, not to interfere with its operation or security, not to attempt to access systems or data you are not authorized to reach, and not to use it to send spam or automated inquiries.',
      ],
    },
    {
      title: 'Information on the website',
      body: [
        'The website describes our services and the work we have delivered. It is general information, not advice and not an offer to provide services on particular terms. Case studies describe systems we have built; client names and identifying details are left out unless the client has agreed to be named.',
        'We keep the website accurate and up to date, but we may change or remove content at any time without notice.',
      ],
    },
    {
      title: 'Inquiries and proposals',
      body: [
        'Sending us a project brief or an email does not create a contract. Any engagement is governed by a separate written agreement or proposal that sets out the scope, timeline, fees and terms for that work. Pricing is only ever given in a written proposal.',
        'Please do not send confidential information through the website before we have agreed on how it will be protected. If you need to share something sensitive, email us first and we can put a non-disclosure agreement in place.',
      ],
    },
    {
      title: 'Your submissions',
      body: [
        'When you submit information through the website, you confirm that it is accurate and that you are entitled to share it. We handle personal information as described in our Privacy Notice.',
      ],
      privacyLink: true,
    },
    {
      title: 'Intellectual property',
      body: [
        `The content, design, text, graphics, diagrams, the ${site.name} name and the clover mark on this website belong to ${site.name} or are used with permission. You may view and share pages for your own reference, but you may not copy, republish or reuse them commercially without our written permission.`,
      ],
    },
    {
      title: 'Links to other websites',
      body: [
        'The website links to third-party websites, such as our LinkedIn page. We are not responsible for the content, availability or privacy practices of those websites.',
      ],
    },
    {
      title: 'Availability and liability',
      body: [
        'The website is provided "as is". We aim to keep it available and free of errors, but we do not guarantee that it always will be.',
        'To the extent permitted by law, we are not liable for any loss or damage arising from your use of, or inability to use, the website or from reliance on its content. Nothing in these terms limits any liability that cannot be limited under applicable law.',
      ],
    },
    {
      title: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The version published on this page, with the date below, is the one that applies.',
      ],
    },
    {
      title: 'Governing law',
      body: [
        'These terms are governed by the laws of India, and the courts at Chandigarh have jurisdiction over any dispute arising from them.',
      ],
    },
    {
      title: 'Contact',
      body: [`For any question about these terms, email ${contact.email}.`],
    },
  ]

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use."
        description={`The terms that apply when you use the ${site.name} website.`}
      />

      <Section>
        <div className="max-w-prose space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-silver-100">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed text-silver-400">
                  {paragraph}
                </p>
              ))}
              {section.privacyLink && (
                <p className="mt-4 text-base">
                  <Link to={routes.privacy} className="text-accent-400 hover:text-accent-300">
                    Read the Privacy Notice
                  </Link>
                </p>
              )}
            </section>
          ))}
          <p className="border-t border-ink-800 pt-6 text-sm text-silver-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </Section>
    </>
  )
}

export default Terms
