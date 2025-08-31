import { describe, it, expect } from 'vitest';
import {
  validateVPA,
  validatePhoneNumber,
  validateAmount,
  validateAccountNumber,
  validateIFSC,
  validateDescription,
  validateQRData,
  validateEmail,
  validateName
} from '../validators';

describe('Validators', () => {
  describe('validateVPA', () => {
    it('should validate correct VPA formats', () => {
      const validVPAs = [
        'john@okicici',
        'user123@paytm',
        'test@upi',
        'demo@googlepay',
        'user@phonepe'
      ];

      validVPAs.forEach(vpa => {
        const result = validateVPA(vpa);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid VPA formats', () => {
      const invalidVPAs = [
        'john@', // missing provider
        '@okicici', // missing username
        'john.okicici', // wrong separator
        'john@okicici@', // extra @
        '', // empty
        'john@okicici@paytm' // multiple @
      ];

      invalidVPAs.forEach(vpa => {
        const result = validateVPA(vpa);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct Indian phone numbers', () => {
      const validNumbers = [
        '9876543210',
        '8765432109',
        '7654321098',
        '9876543210'
      ];

      validNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '1234567890', // doesn't start with 6-9
        '987654321', // too short
        '98765432101', // too long
        'abcdefghij', // non-numeric
        '', // empty
        '987654321a' // mixed
      ];

      invalidNumbers.forEach(number => {
        const result = validatePhoneNumber(number);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateAmount', () => {
    it('should validate correct amounts', () => {
      const validAmounts = [
        '100',
        '100.50',
        '0.01',
        '999999.99',
        '1'
      ];

      validAmounts.forEach(amount => {
        const result = validateAmount(amount);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid amounts', () => {
      const invalidAmounts = [
        '0', // zero
        '-100', // negative
        '100.999', // too many decimals
        'abc', // non-numeric
        '', // empty
        '1000000', // too large
        '0.001' // too small
      ];

      invalidAmounts.forEach(amount => {
        const result = validateAmount(amount);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateAccountNumber', () => {
    it('should validate correct account numbers', () => {
      const validAccounts = [
        '123456789012',
        '987654321098',
        '111111111111',
        '999999999999'
      ];

      validAccounts.forEach(account => {
        const result = validateAccountNumber(account);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid account numbers', () => {
      const invalidAccounts = [
        '12345678901', // too short
        '1234567890123', // too long
        'abcdefghijkl', // non-numeric
        '', // empty
        '12345678901a' // mixed
      ];

      invalidAccounts.forEach(account => {
        const result = validateAccountNumber(account);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateIFSC', () => {
    it('should validate correct IFSC codes', () => {
      const validIFSCs = [
        'SBIN0001234',
        'HDFC0001234',
        'ICIC0001234',
        'AXIS0001234'
      ];

      validIFSCs.forEach(ifsc => {
        const result = validateIFSC(ifsc);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid IFSC codes', () => {
      const invalidIFSCs = [
        'SBIN001234', // too short
        'SBIN00012345', // too long
        'sbin0001234', // lowercase
        '1234000SBIN', // wrong format
        '', // empty
        'SBIN000123a' // mixed
      ];

      invalidIFSCs.forEach(ifsc => {
        const result = validateIFSC(ifsc);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateDescription', () => {
    it('should validate correct descriptions', () => {
      const validDescriptions = [
        'Payment for lunch',
        'Rent payment',
        'Shopping',
        'A'.repeat(50), // max length
        'Test'
      ];

      validDescriptions.forEach(desc => {
        const result = validateDescription(desc);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid descriptions', () => {
      const invalidDescriptions = [
        '', // empty
        'A'.repeat(51), // too long
        '   ', // only spaces
        'A'.repeat(100) // way too long
      ];

      invalidDescriptions.forEach(desc => {
        const result = validateDescription(desc);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateQRData', () => {
    it('should validate correct QR data', () => {
      const validQRData = [
        'upi://pay?pa=john@okicici&pn=John%20Doe&am=100&tn=Payment',
        'upi://pay?pa=user@paytm&pn=User&am=50.50&tn=Lunch',
        'upi://pay?pa=test@upi&pn=Test&am=1&tn=Test%20Payment'
      ];

      validQRData.forEach(data => {
        const result = validateQRData(data);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid QR data', () => {
      const invalidQRData = [
        '', // empty
        'not-a-upi-url', // wrong format
        'upi://pay', // incomplete
        'http://example.com', // wrong protocol
        'upi://pay?pa=invalid&pn=Test' // missing required params
      ];

      invalidQRData.forEach(data => {
        const result = validateQRData(data);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'john@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '', // empty
        'not-an-email', // no @
        '@example.com', // no local part
        'user@', // no domain
        'user..name@example.com', // consecutive dots
        'user@.com', // no domain name
        'user@example..com' // consecutive dots in domain
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });

  describe('validateName', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John Doe',
        'Mary Jane',
        'O\'Connor',
        'Jean-Pierre',
        'A'.repeat(50), // max length
        'Test'
      ];

      validNames.forEach(name => {
        const result = validateName(name);
        expect(result.isValid).toBe(true);
        expect(result.error).toBe('');
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        '', // empty
        '   ', // only spaces
        'A'.repeat(51), // too long
        '123', // only numbers
        'Test@123', // special characters
        'A'.repeat(100) // way too long
      ];

      invalidNames.forEach(name => {
        const result = validateName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });
});
