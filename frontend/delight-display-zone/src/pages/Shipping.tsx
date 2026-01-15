import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, Package } from 'lucide-react';

const shippingOptions = [
  { icon: Truck, title: 'Standard Shipping', time: '5-7 business days', price: 'Free over $100, otherwise $10' },
  { icon: Clock, title: 'Express Shipping', time: '2-3 business days', price: '$15' },
  { icon: Package, title: 'Next Day Delivery', time: '1 business day', price: '$25' },
  { icon: Globe, title: 'International', time: '10-14 business days', price: 'Calculated at checkout' },
];

export default function Shipping() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Shipping Information</h1>
          <p className="text-lg text-muted-foreground">
            We offer fast, reliable shipping to get your order to you as quickly as possible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {shippingOptions.map((option, index) => (
            <motion.div key={option.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="p-6 border border-border rounded-xl">
              <option.icon className="w-10 h-10 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-muted-foreground text-sm mb-1">{option.time}</p>
              <p className="font-medium">{option.price}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Processing</h2>
            <p className="text-muted-foreground">
              Orders placed before 2pm EST on business days are processed the same day. 
              Orders placed after 2pm or on weekends will be processed the next business day. 
              You'll receive a confirmation email with tracking information once your order ships.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
            <p className="text-muted-foreground">
              We ship to over 25 countries worldwide. International customers may be responsible 
              for duties and taxes upon delivery. Shipping costs are calculated at checkout based 
              on destination and package weight.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Tracking Your Order</h2>
            <p className="text-muted-foreground">
              Once your order ships, you'll receive an email with tracking information. 
              You can also track your order by logging into your account and viewing your order history.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
