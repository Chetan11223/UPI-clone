import { 
  User, 
  BankAccount, 
  VPA, 
  Contact, 
  Beneficiary, 
  Transaction, 
  PaymentRequest, 
  QRCode,
  ApiResponse 
} from '@/types';
import { 
  generateReferenceId, 
  generateUPIReferenceId 
} from '@/utils/formatters';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (5% failure rate)
const shouldFail = () => Math.random() < 0.05;

// Get random delay between 300-1200ms
const getRandomDelay = () => Math.floor(Math.random() * 900) + 300;

export class MockApiService {
  // Authentication
  static async login(phone: string, otp: string): Promise<ApiResponse<User>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }

    if (otp !== '123456') {
      return {
        success: false,
        error: 'Invalid OTP. Please try again.',
      };
    }

    return {
      success: true,
      data: {
        id: 'user-1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isSetupComplete: false,
        theme: 'system',
        notifications: true,
      },
    };
  }

  static async sendOTP(phone: string): Promise<ApiResponse<{ message: string }>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to send OTP. Please try again.',
      };
    }

    return {
      success: true,
      data: { message: 'OTP sent successfully' },
    };
  }

  // Bank Account Management
  static async linkBankAccount(accountData: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to link bank account. Please try again.',
      };
    }

    const account: BankAccount = {
      id: `acc-${Date.now()}`,
      userId: 'user-1',
      bankName: accountData.bankName || '',
      accountNumber: accountData.accountNumber || '',
      ifscCode: accountData.ifscCode || '',
      accountType: accountData.accountType || 'savings',
      balance: accountData.balance || 0,
      isDefault: accountData.isDefault || false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: account,
    };
  }

  // VPA Management
  static async createVPA(vpaId: string): Promise<ApiResponse<VPA>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to create VPA. Please try again.',
      };
    }

    const vpa: VPA = {
      id: `vpa-${Date.now()}`,
      userId: 'user-1',
      vpaId,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: vpa,
    };
  }

  // Payment Processing
  static async processPayment(paymentData: {
    amount: number;
    recipient: { type: string; value: string; name?: string };
    description?: string;
    senderAccountId: string;
  }): Promise<ApiResponse<Transaction>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Payment failed. Please try again.',
      };
    }

    // Simulate insufficient balance
    if (paymentData.amount > 100000) {
      return {
        success: false,
        error: 'Insufficient balance in your account.',
      };
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      userId: 'user-1',
      type: 'pay',
      status: 'success',
      amount: paymentData.amount,
      currency: 'INR',
      description: paymentData.description,
      referenceId: generateReferenceId(),
      upiReferenceId: generateUPIReferenceId().toString(),
      senderVpa: 'rahul.sharma@hdfc',
      receiverVpa: paymentData.recipient.type === 'vpa' ? paymentData.recipient.value : undefined,
      receiverPhone: paymentData.recipient.type === 'phone' ? paymentData.recipient.value : undefined,
      senderAccountId: paymentData.senderAccountId,
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: transaction,
    };
  }

  // Request Money
  static async requestMoney(requestData: {
    amount: number;
    recipient: { type: string; value: string; name?: string };
    description?: string;
  }): Promise<ApiResponse<PaymentRequest>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to send money request. Please try again.',
      };
    }

    const request: PaymentRequest = {
      id: `req-${Date.now()}`,
      userId: 'user-1',
      requesterId: 'user-1',
      requesterName: 'Rahul Sharma',
      requesterVpa: 'rahul.sharma@hdfc',
      amount: requestData.amount,
      currency: 'INR',
      description: requestData.description,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: request,
    };
  }

  // QR Code Generation
  static async generateQRCode(qrData: {
    type: 'personal' | 'payment';
    amount?: number;
    description?: string;
  }): Promise<ApiResponse<QRCode>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to generate QR code. Please try again.',
      };
    }

    const qrCode: QRCode = {
      id: `qr-${Date.now()}`,
      userId: 'user-1',
      type: qrData.type,
      data: qrData.type === 'personal' 
        ? 'upi://rahul.sharma@hdfc'
        : `upi://rahul.sharma@hdfc?am=${qrData.amount}&tn=${qrData.description}`,
      amount: qrData.amount,
      description: qrData.description,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: qrData.type === 'payment' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        : undefined,
    };

    return {
      success: true,
      data: qrCode,
    };
  }

  // QR Code Parsing
  static async parseQRCode(qrData: string): Promise<ApiResponse<{
    type: 'payment' | 'personal';
    amount?: number;
    description?: string;
    recipient?: string;
  }>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to parse QR code. Please try again.',
      };
    }

    if (!qrData.startsWith('upi://')) {
      return {
        success: false,
        error: 'Invalid QR code format.',
      };
    }

    const url = new URL(qrData);
    const params = new URLSearchParams(url.search);

    return {
      success: true,
      data: {
        type: params.has('am') ? 'payment' : 'personal',
        amount: params.get('am') ? parseFloat(params.get('am')!) : undefined,
        description: params.get('tn') || undefined,
        recipient: url.pathname.slice(1) || undefined,
      },
    };
  }

  // Contact Management
  static async addContact(contactData: Partial<Contact>): Promise<ApiResponse<Contact>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to add contact. Please try again.',
      };
    }

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      userId: 'user-1',
      name: contactData.name || '',
      phone: contactData.phone || '',
      email: contactData.email,
      avatar: contactData.avatar,
      isFavorite: contactData.isFavorite || false,
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: contact,
    };
  }

  // Beneficiary Management
  static async addBeneficiary(beneficiaryData: Partial<Beneficiary>): Promise<ApiResponse<Beneficiary>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to add beneficiary. Please try again.',
      };
    }

    const beneficiary: Beneficiary = {
      id: `ben-${Date.now()}`,
      userId: 'user-1',
      name: beneficiaryData.name || '',
      vpaId: beneficiaryData.vpaId,
      phone: beneficiaryData.phone,
      accountNumber: beneficiaryData.accountNumber,
      ifscCode: beneficiaryData.ifscCode,
      bankName: beneficiaryData.bankName,
      isFavorite: beneficiaryData.isFavorite || false,
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: beneficiary,
    };
  }

  // Payment Request Actions
  static async respondToPaymentRequest(
    requestId: string, 
    action: 'accept' | 'decline'
  ): Promise<ApiResponse<PaymentRequest>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to process request. Please try again.',
      };
    }

    const request: PaymentRequest = {
      id: requestId,
      userId: 'user-1',
      requesterId: 'user-2',
      requesterName: 'Priya Patel',
      requesterVpa: 'priya.patel@paytm',
      amount: 2000,
      currency: 'INR',
      description: 'Weekend trip expenses',
      status: action === 'accept' ? 'accepted' : 'declined',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      respondedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: request,
    };
  }

  // Balance Check
  static async checkBalance(accountId: string): Promise<ApiResponse<{ balance: number }>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to fetch balance. Please try again.',
      };
    }

    return {
      success: true,
      data: { balance: 125000.50 },
    };
  }

  // Transaction History
  static async getTransactionHistory(
    filters?: { 
      type?: string; 
      status?: string; 
      startDate?: string; 
      endDate?: string; 
    }
  ): Promise<ApiResponse<Transaction[]>> {
    await delay(getRandomDelay());
    
    if (shouldFail()) {
      return {
        success: false,
        error: 'Failed to fetch transaction history. Please try again.',
      };
    }

    // Mock transactions - in real app, this would filter based on the filters parameter
    const transactions: Transaction[] = [
      {
        id: 'txn-1',
        userId: 'user-1',
        type: 'pay',
        status: 'success',
        amount: 2500.00,
        currency: 'INR',
        description: 'Lunch payment',
        referenceId: 'TXN123456789',
        upiReferenceId: '123456789012345',
        senderVpa: 'rahul.sharma@hdfc',
        receiverVpa: 'priya.patel@paytm',
        senderAccountId: 'acc-1',
        timestamp: '2024-03-15T12:30:00Z',
        completedAt: '2024-03-15T12:30:45Z',
      },
      // Add more mock transactions as needed
    ];

    return {
      success: true,
      data: transactions,
    };
  }
}
