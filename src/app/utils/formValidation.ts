/**
 * Form Validation Utility
 * Provides validation functions for email, URL, date, time, phone, and other common formats
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation - RFC 5322 simplified
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format. Use: example@domain.com' };
  }
  return { isValid: true };
};

// URL/Link validation
export const validateUrl = (url: string, label: string = 'URL'): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: `${label} is required` };
  }
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: `Invalid ${label} format. Use: https://example.com` };
  }
};

// GitHub URL validation
export const validateGithubUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: 'GitHub URL is required' };
  }
  const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/?$/i;
  if (!githubRegex.test(url)) {
    return { isValid: false, error: 'Invalid GitHub URL. Use: https://github.com/username' };
  }
  return { isValid: true };
};

// LinkedIn URL validation
export const validateLinkedInUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: 'LinkedIn URL is required' };
  }
  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i;
  if (!linkedinRegex.test(url)) {
    return { isValid: false, error: 'Invalid LinkedIn URL. Use: https://linkedin.com/in/username' };
  }
  return { isValid: true };
};

// Date validation (YYYY-MM-DD or Month Day, Year formats)
export const validateDate = (dateStr: string, label: string = 'Date'): ValidationResult => {
  if (!dateStr.trim()) {
    return { isValid: false, error: `${label} is required` };
  }

  // Try parsing YYYY-MM-DD format
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoRegex.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return { isValid: true };
    }
  }

  // Try parsing "Month Day, Year" or "Month Day-Day, Year" format (for event dates)
  const monthDayYearRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:-(\d{1,2}))?,\s+(\d{4})$/i;
  if (monthDayYearRegex.test(dateStr)) {
    return { isValid: true };
  }

  // Try parsing MM/DD/YYYY format
  const slashDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (slashDateRegex.test(dateStr)) {
    const [month, day, year] = dateStr.split('/').map(Number);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { isValid: true };
    }
  }

  return {
    isValid: false,
    error: `Invalid ${label} format. Use: YYYY-MM-DD, MM/DD/YYYY, or Month Day, Year (e.g., April 15, 2026)`,
  };
};

// DateTime range validation (for event dates like "March 15-17, 2026")
export const validateDateRange = (dateRangeStr: string): ValidationResult => {
  if (!dateRangeStr.trim()) {
    return { isValid: false, error: 'Date range is required' };
  }

  // Validate format: "Month Day-Day, Year" or "Month Day, Year - Month Day, Year"
  const singleMonthRangeRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})-(\d{1,2}),\s+(\d{4})$/i;
  const multiMonthRangeRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\s*-\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})$/i;

  if (singleMonthRangeRegex.test(dateRangeStr) || multiMonthRangeRegex.test(dateRangeStr)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Invalid date range format. Use: Month Day-Day, Year (e.g., April 15-17, 2026) or Month Day, Year - Month Day, Year',
  };
};

// Time validation (HH:MM:SS or HH:MM in 24-hour format)
export const validateTime = (timeStr: string, label: string = 'Time'): ValidationResult => {
  if (!timeStr.trim()) {
    return { isValid: false, error: `${label} is required` };
  }

  // HH:MM:SS format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
  if (timeRegex.test(timeStr)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Invalid ${label} format. Use: HH:MM or HH:MM:SS (e.g., 14:30 or 14:30:00)`,
  };
};

// Phone number validation (international format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Allow +, spaces, dashes, and numbers. Must be 10-15 digits
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'Invalid phone number format. Use: +1-234-567-8900 or similar' };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

// Text field validation (non-empty, minimum length)
export const validateTextField = (
  text: string,
  label: string = 'Field',
  minLength: number = 1,
  maxLength?: number
): ValidationResult => {
  if (!text.trim()) {
    return { isValid: false, error: `${label} is required` };
  }
  if (text.length < minLength) {
    return { isValid: false, error: `${label} must be at least ${minLength} characters long` };
  }
  if (maxLength && text.length > maxLength) {
    return { isValid: false, error: `${label} must not exceed ${maxLength} characters` };
  }
  return { isValid: true };
};

// Number validation
export const validateNumber = (
  value: string | number,
  label: string = 'Number',
  minValue?: number,
  maxValue?: number
): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: `${label} must be a valid number` };
  }

  if (minValue !== undefined && num < minValue) {
    return { isValid: false, error: `${label} must be at least ${minValue}` };
  }

  if (maxValue !== undefined && num > maxValue) {
    return { isValid: false, error: `${label} must not exceed ${maxValue}` };
  }

  return { isValid: true };
};

// File validation
export const validateFile = (
  file: File | null,
  allowedTypes: string[] = [],
  maxSizeMB: number = 10,
  label: string = 'File'
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: `${label} is required` };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: `${label} must be one of: ${allowedTypes.join(', ')}` };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { isValid: false, error: `${label} must be less than ${maxSizeMB}MB` };
  }

  return { isValid: true };
};

// Validate all form fields against provided schema
export interface FieldSchema {
  type: 'email' | 'url' | 'github' | 'linkedin' | 'date' | 'dateRange' | 'time' | 'phone' | 'password' | 'text' | 'number' | 'file';
  value: string | number | File | null;
  label?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export const validateFormFields = (fields: Record<string, FieldSchema>): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [fieldName, fieldSchema] of Object.entries(fields)) {
    const { type, value, label = fieldName, required = true } = fieldSchema;

    // Skip optional empty fields
    if (!required && !value) {
      continue;
    }

    let result: ValidationResult;

    switch (type) {
      case 'email':
        result = validateEmail(String(value || ''));
        break;
      case 'url':
        result = validateUrl(String(value || ''), label);
        break;
      case 'github':
        result = validateGithubUrl(String(value || ''));
        break;
      case 'linkedin':
        result = validateLinkedInUrl(String(value || ''));
        break;
      case 'date':
        result = validateDate(String(value || ''), label);
        break;
      case 'dateRange':
        result = validateDateRange(String(value || ''));
        break;
      case 'time':
        result = validateTime(String(value || ''), label);
        break;
      case 'phone':
        result = validatePhoneNumber(String(value || ''));
        break;
      case 'password':
        result = validatePassword(String(value || ''));
        break;
      case 'text':
        result = validateTextField(
          String(value || ''),
          label,
          fieldSchema.minLength,
          fieldSchema.maxLength
        );
        break;
      case 'number':
        result = validateNumber(value as string | number, label, fieldSchema.minValue, fieldSchema.maxValue);
        break;
      case 'file':
        result = validateFile(
          value as File | null,
          fieldSchema.allowedFileTypes,
          fieldSchema.maxFileSizeMB,
          label
        );
        break;
      default:
        continue;
    }

    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  }

  return errors;
};
