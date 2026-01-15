import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Heart, Leaf, Users, Award } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Quality First', description: 'We source only the finest materials and work with skilled artisans to create products that last.' },
  { icon: Leaf, title: 'Sustainable', description: 'Environmental responsibility is at the core of everything we do, from sourcing to packaging.' },
  { icon: Users, title: 'Community', description: 'We believe in fair wages, safe working conditions, and supporting local communities.' },
  { icon: Award, title: 'Excellence', description: 'Every product meets our rigorous standards for design, durability, and functionality.' },
];

export default function About() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Royal Mart</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2020, Royal Mart was born from a simple belief: everyday essentials should be beautiful, 
            sustainable, and built to last. We curate products that bring joy to daily rituals while 
            respecting our planet.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" alt="Our store" className="w-full h-64 object-cover rounded-xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              What started as a small collection of handpicked items has grown into a curated marketplace 
              for conscious consumers. We partner with independent makers and ethical brands who share 
              our commitment to quality and sustainability.
            </p>
            <p className="text-muted-foreground">
              Every product in our collection is chosen with intention, designed to elevate your everyday 
              experience while minimizing environmental impact.
            </p>
          </motion.div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="p-6 bg-secondary/50 rounded-xl text-center">
                <value.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're more than a store – we're a community of people who believe in living intentionally. 
            Follow us on social media and subscribe to our newsletter for inspiration, new arrivals, 
            and exclusive offers.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
