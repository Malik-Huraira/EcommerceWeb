import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { step: 1, title: 'Initiate Return', description: 'Log into your account and select the item(s) you wish to return.' },
  { step: 2, title: 'Print Label', description: 'Download and print your prepaid return shipping label.' },
  { step: 3, title: 'Ship Item', description: 'Pack the item securely and drop it off at any carrier location.' },
  { step: 4, title: 'Get Refund', description: 'Refund processed within 5-7 business days of receiving your return.' },
];

export default function Returns() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Returns & Exchanges</h1>
          <p className="text-lg text-muted-foreground">
            Not completely satisfied? We offer hassle-free returns within 30 days of purchase.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Eligible for Return</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unused items in original packaging</li>
                <li>• Items with tags still attached</li>
                <li>• Items returned within 30 days</li>
                <li>• Defective or damaged items</li>
              </ul>
            </div>
            <div className="p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 rounded-xl">
              <XCircle className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-semibold mb-2">Not Eligible</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Used or worn items</li>
                <li>• Items without original packaging</li>
                <li>• Final sale items</li>
                <li>• Personalized or custom items</li>
              </ul>
            </div>
          </div>

          <div className="p-6 bg-secondary/50 rounded-xl">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Refund Timeline</h3>
                <p className="text-muted-foreground text-sm">
                  Once we receive your return, please allow 5-7 business days for inspection and processing. 
                  Refunds will be credited to your original payment method. You'll receive an email confirmation 
                  once your refund has been processed.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="gap-2"><RotateCcw className="w-4 h-4" />Start a Return</Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
