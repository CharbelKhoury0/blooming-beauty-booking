import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookingMobileLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const BookingMobileLayout = ({ children, title, subtitle }: BookingMobileLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 space-y-4"
        >
          {children}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

// Mobile-optimized card component
export const MobileCard = ({ children, className = '', ...props }: { children: ReactNode; className?: string; [key: string]: unknown }) => (
  <Card 
    className={`p-4 shadow-sm border-border/50 bg-card/80 backdrop-blur-sm ${className}`} 
    {...props}
  >
    {children}
  </Card>
);

// Mobile-optimized button grid
export const MobileButtonGrid = ({ children, columns = 2 }: { children: ReactNode; columns?: number }) => (
  <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : `grid-cols-${columns}`}`}>
    {children}
  </div>
);