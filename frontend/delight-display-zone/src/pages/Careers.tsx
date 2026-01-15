import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const openings = [
  { title: 'Senior Frontend Developer', location: 'Remote', type: 'Full-time', department: 'Engineering' },
  { title: 'Product Designer', location: 'New York, NY', type: 'Full-time', department: 'Design' },
  { title: 'Marketing Manager', location: 'Remote', type: 'Full-time', department: 'Marketing' },
  { title: 'Customer Support Specialist', location: 'Remote', type: 'Part-time', department: 'Support' },
];

const benefits = [
  'Competitive salary & equity', 'Remote-first culture', 'Unlimited PTO', 'Health & dental insurance',
  'Learning & development budget', 'Home office stipend', 'Wellness programs', 'Team retreats',
];

export default function Careers() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're building the future of conscious commerce. Join a team of passionate individuals 
            who believe in making a positive impact through thoughtful design and sustainable practices.
          </p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why Work at Royal Mart?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div key={benefit} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * index }} className="p-4 bg-secondary/50 rounded-lg text-center text-sm font-medium">
                {benefit}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <motion.div key={job.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }} className="p-6 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                  </div>
                </div>
                <Button>Apply Now</Button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
          </p>
          <Button variant="outline">Send Open Application</Button>
        </motion.div>
      </div>
    </Layout>
  );
}
