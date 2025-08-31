import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatAmount,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  maskAccountNumber,
  maskPhoneNumber,
  formatPhoneNumber,
  formatAccountNumber,
  formatIFSC,
  generateReferenceId,
  generateUPIReferenceId,
  formatBalance,
  formatFileSize,
  capitalizeFirst,
  truncateText,
  formatTransactionType,
  formatTransactionStatus
} from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('₹100.00');
      expect(formatCurrency(100.5)).toBe('₹100.50');
      expect(formatCurrency(100.55)).toBe('₹100.55');
      expect(formatCurrency(0)).toBe('₹0.00');
      expect(formatCurrency(1234567.89)).toBe('₹12,34,567.89');
    });

    it('should handle edge cases', () => {
      expect(formatCurrency(0.01)).toBe('₹0.01');
      expect(formatCurrency(999999.99)).toBe('₹9,99,999.99');
      expect(formatCurrency(1000000)).toBe('₹10,00,000.00');
    });
  });

  describe('formatAmount', () => {
    it('should format amounts correctly', () => {
      expect(formatAmount(100)).toBe('100.00');
      expect(formatAmount(100.5)).toBe('100.50');
      expect(formatAmount(100.55)).toBe('100.55');
      expect(formatAmount(0)).toBe('0.00');
      expect(formatAmount(1234567.89)).toBe('12,34,567.89');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15 Jan 2024');
      
      const date2 = new Date('2024-12-25');
      expect(formatDate(date2)).toBe('25 Dec 2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatDateTime(date)).toBe('15 Jan 2024, 2:30 PM');
      
      const date2 = new Date('2024-12-25T09:15:00');
      expect(formatDateTime(date2)).toBe('25 Dec 2024, 9:15 AM');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(formatTime(date)).toBe('2:30 PM');
      
      const date2 = new Date('2024-12-25T09:15:00');
      expect(formatTime(date2)).toBe('9:15 AM');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
      expect(formatRelativeTime(oneDayAgo)).toBe('1 day ago');
      expect(formatRelativeTime(oneWeekAgo)).toBe('1 week ago');
    });

    it('should handle future dates', () => {
      const now = new Date();
      const oneMinuteLater = new Date(now.getTime() + 60 * 1000);
      expect(formatRelativeTime(oneMinuteLater)).toBe('in 1 minute');
    });
  });

  describe('maskAccountNumber', () => {
    it('should mask account numbers correctly', () => {
      expect(maskAccountNumber('123456789012')).toBe('**** **** 9012');
      expect(maskAccountNumber('987654321098')).toBe('**** **** 1098');
      expect(maskAccountNumber('111111111111')).toBe('**** **** 1111');
    });

    it('should handle different length account numbers', () => {
      expect(maskAccountNumber('1234567890')).toBe('**** **** 7890');
      expect(maskAccountNumber('123456789012345')).toBe('**** **** 2345');
    });
  });

  describe('maskPhoneNumber', () => {
    it('should mask phone numbers correctly', () => {
      expect(maskPhoneNumber('9876543210')).toBe('*******210');
      expect(maskPhoneNumber('8765432109')).toBe('*******109');
    });

    it('should handle different length phone numbers', () => {
      expect(maskPhoneNumber('987654321')).toBe('******321');
      expect(maskPhoneNumber('98765432101')).toBe('********101');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('8765432109')).toBe('+91 87654 32109');
    });
  });

  describe('formatAccountNumber', () => {
    it('should format account numbers correctly', () => {
      expect(formatAccountNumber('123456789012')).toBe('1234 5678 9012');
      expect(formatAccountNumber('987654321098')).toBe('9876 5432 1098');
    });
  });

  describe('formatIFSC', () => {
    it('should format IFSC codes correctly', () => {
      expect(formatIFSC('SBIN0001234')).toBe('SBIN 0001 234');
      expect(formatIFSC('HDFC0001234')).toBe('HDFC 0001 234');
    });
  });

  describe('generateReferenceId', () => {
    it('should generate reference IDs with correct format', () => {
      const refId = generateReferenceId();
      expect(refId).toMatch(/^[A-Z0-9]{12}$/);
    });

    it('should generate unique reference IDs', () => {
      const refId1 = generateReferenceId();
      const refId2 = generateReferenceId();
      expect(refId1).not.toBe(refId2);
    });
  });

  describe('generateUPIReferenceId', () => {
    it('should generate UPI reference IDs with correct format', () => {
      const refId = generateUPIReferenceId();
      expect(refId).toMatch(/^UPI[0-9]{12}$/);
    });

    it('should generate unique UPI reference IDs', () => {
      const refId1 = generateUPIReferenceId();
      const refId2 = generateUPIReferenceId();
      expect(refId1).not.toBe(refId2);
    });
  });

  describe('formatBalance', () => {
    it('should format balance correctly', () => {
      expect(formatBalance(100)).toBe('₹100');
      expect(formatBalance(100.5)).toBe('₹100.50');
      expect(formatBalance(1234567)).toBe('₹12.35L');
      expect(formatBalance(12345678)).toBe('₹1.23Cr');
    });

    it('should handle edge cases', () => {
      expect(formatBalance(0)).toBe('₹0');
      expect(formatBalance(999999)).toBe('₹10.00L');
      expect(formatBalance(9999999)).toBe('₹1.00Cr');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should handle decimal file sizes', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter correctly', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
      expect(capitalizeFirst('')).toBe('');
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('', 5)).toBe('');
    });

    it('should handle edge cases', () => {
      expect(truncateText('Hello', 0)).toBe('...');
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Hello World', 3)).toBe('Hel...');
    });
  });

  describe('formatTransactionType', () => {
    it('should format transaction types correctly', () => {
      expect(formatTransactionType('payment')).toBe('Payment');
      expect(formatTransactionType('request')).toBe('Request');
      expect(formatTransactionType('refund')).toBe('Refund');
      expect(formatTransactionType('transfer')).toBe('Transfer');
    });
  });

  describe('formatTransactionStatus', () => {
    it('should format transaction status correctly', () => {
      expect(formatTransactionStatus('success')).toBe('Success');
      expect(formatTransactionStatus('pending')).toBe('Pending');
      expect(formatTransactionStatus('failed')).toBe('Failed');
      expect(formatTransactionStatus('cancelled')).toBe('Cancelled');
    });
  });
});
