import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface BookingProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const BookingProgress = ({ steps, currentStep, className = '' }: BookingProgressProps) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step.id <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    borderColor: step.id <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-background`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : step.id === currentStep ? (
                    <Circle className="w-5 h-5 text-primary-foreground fill-current" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                  <p className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: step.id < currentStep ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  }}
                  className="flex-1 h-0.5 mx-4"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="bg-primary h-2 rounded-full"
          />
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <h3 className="font-semibold text-foreground">
            {steps[currentStep - 1]?.title}
          </h3>
          {steps[currentStep - 1]?.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStep - 1].description}
            </p>
          )}
        </div>

        {/* Mini Step Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={false}
              animate={{
                backgroundColor: step.id <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                scale: step.id === currentStep ? 1.2 : 1,
              }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};