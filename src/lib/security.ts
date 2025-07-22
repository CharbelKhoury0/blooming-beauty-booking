// Security utilities for input validation and sanitization

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// HTML sanitization - basic protection against XSS
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

// Phone number validation (basic)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
}

// Name validation
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.length > 100) {
    errors.push('Name must be 100 characters or less');
  } else if (!/^[a-zA-Z\s-'.]+$/.test(name)) {
    errors.push('Name contains invalid characters');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Contact form validation
export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Name validation
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  // Email validation
  if (!data.email) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  } else if (data.email.length > 255) {
    errors.push('Email must be 255 characters or less');
  }
  
  // Subject validation
  if (!data.subject || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  } else if (data.subject.length > 200) {
    errors.push('Subject must be 200 characters or less');
  }
  
  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > 2000) {
    errors.push('Message must be 2000 characters or less');
  }
  
  // Phone validation (optional)
  if (data.phone && data.phone.trim() !== '' && !validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Testimonial validation
export function validateTestimonial(data: {
  authorName: string;
  text: string;
  rating: number;
}): ValidationResult {
  const errors: string[] = [];
  
  // Author name validation
  const nameValidation = validateName(data.authorName);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  // Text validation
  if (!data.text || data.text.trim().length === 0) {
    errors.push('Review text is required');
  } else if (data.text.length > 1000) {
    errors.push('Review text must be 1000 characters or less');
  }
  
  // Rating validation
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Booking validation
export function validateBookingData(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  totalPrice: number;
}): ValidationResult {
  const errors: string[] = [];
  
  // Customer name validation
  const nameValidation = validateName(data.customerName);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  // Email validation
  if (!data.customerEmail) {
    errors.push('Email is required');
  } else if (!validateEmail(data.customerEmail)) {
    errors.push('Please enter a valid email address');
  } else if (data.customerEmail.length > 255) {
    errors.push('Email must be 255 characters or less');
  }
  
  // Phone validation
  if (!data.customerPhone) {
    errors.push('Phone number is required');
  } else if (!validatePhone(data.customerPhone)) {
    errors.push('Please enter a valid phone number');
  } else if (data.customerPhone.length > 20) {
    errors.push('Phone number must be 20 characters or less');
  }
  
  // Date validation
  if (!data.bookingDate) {
    errors.push('Booking date is required');
  } else {
    const bookingDate = new Date(data.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      errors.push('Booking date cannot be in the past');
    }
  }
  
  // Price validation
  if (!data.totalPrice || data.totalPrice <= 0) {
    errors.push('Total price must be greater than 0');
  }
  
  return { isValid: errors.length === 0, errors };
}