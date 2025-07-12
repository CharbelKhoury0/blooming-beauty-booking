import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// CMS-ready testimonial data structure
export interface Testimonial {
  id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
  image?: string;
  location?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    service: 'Hair Styling & Color',
    rating: 5,
    text: 'Absolutely amazing experience! The stylists at Bloom Beauty truly understand their craft. My hair has never looked better, and the salon atmosphere is so relaxing.',
    location: 'Downtown Client',
  },
  {
    id: '2',
    name: 'Emily Chen',
    service: 'Bridal Package',
    rating: 5,
    text: 'Perfect for my wedding day! The team made me feel like a princess. Every detail was flawless, and I received so many compliments. Highly recommend!',
    location: 'Bridal Client',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    service: 'Facial Treatment',
    rating: 5,
    text: 'The facial treatments here are incredible. My skin feels rejuvenated and glowing. The staff is professional and the products they use are top quality.',
    location: 'Spa Client',
  },
  {
    id: '4',
    name: 'Jessica Park',
    service: 'Hair Color Correction',
    rating: 5,
    text: 'They fixed a color disaster from another salon perfectly! The colorist was so skilled and patient. I\'m now a client for life.',
    location: 'Color Client',
  },
  {
    id: '5',
    name: 'Amanda Wilson',
    service: 'Full Service Package',
    rating: 5,
    text: 'Bloom Beauty is my go-to salon for everything. The quality is consistent, staff is friendly, and the results always exceed my expectations.',
    location: 'Regular Client',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Client Love</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            What Our Clients Say
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our valued clients 
            have to say about their experience at Bloom Beauty.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="card-luxury p-8 md:p-12 text-center"
              >
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Client Info */}
                <div className="space-y-2">
                  <div className="font-heading text-xl font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-primary font-medium">
                    {testimonials[currentIndex].service}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].location}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { title: 'Google Reviews', value: '4.9/5', subtitle: '200+ Reviews' },
            { title: 'Client Retention', value: '95%', subtitle: 'Return Rate' },
            { title: 'Years in Business', value: '10+', subtitle: 'Serving the Community' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
                {item.value}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {item.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};