import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Truck, Package } from 'lucide-react';

const initiatives = [
  { icon: Leaf, title: 'Eco-Friendly Materials', description: 'We prioritize organic, recycled, and sustainably sourced materials in all our products.' },
  { icon: Recycle, title: 'Zero Waste Goal', description: 'Working towards eliminating waste in our operations through recycling and composting programs.' },
  { icon: Truck, title: 'Carbon Neutral Shipping', description: 'We offset 100% of carbon emissions from shipping through verified environmental projects.' },
  { icon: Package, title: 'Minimal Packaging', description: 'All packaging is recyclable or compostable, using soy-based inks and recycled materials.' },
];

export default function Sustainability() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Sustainability</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe that beautiful products shouldn't come at the cost of our planet. 
            Sustainability isn't just a buzzword for us – it's woven into every decision we make.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {initiatives.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="p-6 border border-border rounded-xl">
              <item.icon className="w-10 h-10 mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground mb-4">
              By 2030, we aim to be completely carbon neutral across our entire supply chain. 
              We're investing in renewable energy, sustainable manufacturing processes, and 
              innovative materials that reduce environmental impact.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full" />50% reduction in carbon footprint by 2025</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full" />100% sustainable packaging by 2024</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full" />Partner only with certified ethical suppliers</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop" alt="Sustainability" className="w-full h-64 object-cover rounded-xl" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Every Purchase Makes a Difference</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            1% of every sale goes to environmental nonprofits working to protect our planet. 
            Together, we've planted over 10,000 trees and removed 50 tons of plastic from our oceans.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
