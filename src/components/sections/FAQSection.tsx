import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment online through our website, by phone, or by visiting our salon in person.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We kindly ask for at least 24 hours notice for cancellations or rescheduling. Late cancellations may be subject to a fee.'
  },
  {
    question: 'Do you offer bridal or group packages?',
    answer: 'Yes! We offer special packages for brides and groups. Please contact us for details and custom quotes.'
  },
  {
    question: 'How far in advance should I book my appointment?',
    answer: 'We recommend booking at least one to two weeks in advance to ensure you get your preferred date, time, and stylist. For weddings or group bookings, please contact us as early as possible.'
  },
  {
    question: 'Can I request a specific stylist?',
    answer: 'Absolutely! You can request your preferred stylist when booking, subject to their availability.'
  },
];

export const FAQSection = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg">
            <AccordionTrigger className="text-lg font-medium px-4 py-3">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection; 