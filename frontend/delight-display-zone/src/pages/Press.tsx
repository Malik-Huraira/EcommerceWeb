import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pressFeatures = [
  { publication: 'Vogue', title: 'The Rise of Conscious Consumerism', date: 'December 2024' },
  { publication: 'Forbes', title: '30 Under 30: Retail Innovators', date: 'November 2024' },
  { publication: 'Fast Company', title: 'Most Innovative Companies in Retail', date: 'October 2024' },
  { publication: 'The New York Times', title: 'Sustainable Shopping Goes Mainstream', date: 'September 2024' },
];

export default function Press() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Press & Media</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Royal Mart has been featured in leading publications worldwide. For press inquiries, 
            please contact our media relations team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6 border border-border rounded-xl">
            <h2 className="text-xl font-bold mb-4">Press Kit</h2>
            <p className="text-muted-foreground mb-4">
              Download our press kit containing logos, brand guidelines, product images, and company information.
            </p>
            <Button className="gap-2"><Download className="w-4 h-4" />Download Press Kit</Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-6 border border-border rounded-xl">
            <h2 className="text-xl font-bold mb-4">Media Contact</h2>
            <p className="text-muted-foreground mb-4">
              For press inquiries, interviews, or media requests, please reach out to our PR team.
            </p>
            <Button variant="outline" className="gap-2"><Mail className="w-4 h-4" />press@royalmart.com</Button>
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured In</h2>
          <div className="space-y-4">
            {pressFeatures.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="p-6 bg-secondary/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-medium text-primary">{item.publication}</span>
                  <h3 className="font-semibold mt-1">{item.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
          <h2 className="text-2xl font-bold mb-4">Company Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[{ label: 'Founded', value: '2020' }, { label: 'Customers', value: '50K+' }, { label: 'Products', value: '500+' }, { label: 'Countries', value: '25+' }].map((stat) => (
              <div key={stat.label} className="p-4">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
