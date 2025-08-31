import { ValidationResult } from '@/types';

export const validateVPA = (vpa: string): ValidationResult => {
  if (!vpa) {
    return { isValid: false, error: 'VPA is required' };
  }

  // VPA format: username@provider
  const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  
  if (!vpaRegex.test(vpa)) {
    return { isValid: false, error: 'Invalid VPA format. Use format: username@provider' };
  }

  const [username, provider] = vpa.split('@');
  
  if (username.length < 3 || username.length > 50) {
    return { isValid: false, error: 'Username must be between 3 and 50 characters' };
  }

  if (provider.length < 2 || provider.length > 20) {
    return { isValid: false, error: 'Provider must be between 2 and 20 characters' };
  }

  // Check for common UPI providers
  const validProviders = [
    'okicici', 'paytm', 'phonepe', 'gpay', 'amazonpay', 'bhim',
    'axis', 'hdfc', 'sbi', 'icici', 'kotak', 'yesbank', 'pnb',
    'unionbank', 'canara', 'bankofbaroda', 'idfc', 'federal'
  ];

  if (!validProviders.includes(provider.toLowerCase())) {
    return { isValid: false, error: 'Invalid UPI provider' };
  }

  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid Indian mobile number
  const phoneRegex = /^[6-9]\d{9}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number' };
  }

  return { isValid: true };
};

export const validateAmount = (amount: string): ValidationResult => {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount > 100000) {
    return { isValid: false, error: 'Amount cannot exceed ₹1,00,000' };
  }

  // Check for decimal places (max 2)
  const decimalPlaces = amount.split('.')[1]?.length || 0;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Amount can have maximum 2 decimal places' };
  }

  return { isValid: true };
};

export const validateAccountNumber = (accountNumber: string): ValidationResult => {
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }

  // Remove spaces and dashes
  const cleanAccountNumber = accountNumber.replace(/[\s\-]/g, '');
  
  // Account number should be 9-18 digits
  const accountRegex = /^\d{9,18}$/;
  
  if (!accountRegex.test(cleanAccountNumber)) {
    return { isValid: false, error: 'Account number must be 9-18 digits' };
  }

  return { isValid: true };
};

export const validateIFSC = (ifsc: string): ValidationResult => {
  if (!ifsc) {
    return { isValid: false, error: 'IFSC code is required' };
  }

  // IFSC format: 4 letters + 7 digits
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return { isValid: false, error: 'Invalid IFSC code format' };
  }

  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (!description) {
    return { isValid: true }; // Description is optional
  }

  if (description.length > 50) {
    return { isValid: false, error: 'Description cannot exceed 50 characters' };
  }

  // Check for special characters that might cause issues
  const invalidChars = /[<>{}]/;
  if (invalidChars.test(description)) {
    return { isValid: false, error: 'Description contains invalid characters' };
  }

  return { isValid: true };
};

export const validateQRData = (data: string): ValidationResult => {
  if (!data) {
    return { isValid: false, error: 'QR data is required' };
  }

  // Basic UPI QR format validation
  if (!data.startsWith('upi://')) {
    return { isValid: false, error: 'Invalid UPI QR code format' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Name cannot exceed 50 characters' };
  }

  // Check for valid characters (letters, spaces, dots, hyphens)
  const nameRegex = /^[a-zA-Z\s\.\-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, dots, and hyphens' };
  }

  return { isValid: true };
};
