import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. International orders may take 10-14 business days.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unused items in original packaging. Simply initiate a return through your account or contact our support team.' },
  { q: 'Do you ship internationally?', a: 'Yes! We ship to over 25 countries worldwide. Shipping costs and delivery times vary by location and are calculated at checkout.' },
  { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive an email with tracking information. You can also track your order by logging into your account.' },
  { q: 'Are your products sustainable?', a: 'Sustainability is core to our mission. We prioritize eco-friendly materials, ethical manufacturing, and minimal packaging across all products.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact support and we\'ll do our best to help.' },
  { q: 'Do you offer gift wrapping?', a: 'Yes! Gift wrapping is available for $5 per item. You can add this option during checkout along with a personalized message.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via email at support@royalmart.com, through live chat on our website, or by phone at 1-800-ROYAL. We\'re available Mon-Fri, 9am-6pm EST.' },
];

export default function FAQ() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto mt-12 p-6 bg-secondary/50 rounded-xl text-center">
          <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">Our support team is here to help.</p>
          <a href="/contact" className="text-primary font-medium hover:underline">Contact Us →</a>
        </motion.div>
      </div>
    </Layout>
  );
}
