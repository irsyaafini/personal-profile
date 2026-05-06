import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/ui/Card'
import { ContactForm } from '@/features/messages/ContactForm'

const CONTACT_INFO_ITEMS = [
  { icon: '🤝', title: 'Collaboration', desc: 'Open to joint research projects in epidemiology and public health.' },
  { icon: '🎓', title: 'Consulting', desc: 'Available for consulting on disease surveillance and outbreak investigations.' },
  { icon: '📢', title: 'Speaking', desc: 'Interested in conference presentations and academic talks.' },
]

/**
 * Contact page — info cards + ContactForm feature component
 */
export default function ContactPage() {
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-section">
          <SectionHeader
            label="Contact"
            title="Get in Touch"
            subtitle="Have a research question or interested in collaboration? I'd love to hear from you."
          />

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info cards */}
            <div className="lg:col-span-2 space-y-5">
              {CONTACT_INFO_ITEMS.map((item, i) => (
                <motion.div key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="flex gap-4 items-start">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <ContactForm />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
