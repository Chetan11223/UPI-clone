export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isSetupComplete: boolean;
  defaultAccountId?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  balance: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface VPA {
  id: string;
  userId: string;
  vpaId: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  vpaId?: string;
  phone?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  isFavorite: boolean;
  lastUsed: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'pay' | 'request' | 'collect';
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
  description?: string;
  referenceId: string;
  upiReferenceId: string;
  senderVpa?: string;
  receiverVpa?: string;
  senderPhone?: string;
  receiverPhone?: string;
  senderAccountId?: string;
  receiverAccountId?: string;
  fee?: number;
  timestamp: string;
  completedAt?: string;
  failureReason?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  requesterId: string;
  requesterName: string;
  requesterVpa: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
  respondedAt?: string;
}

export interface QRCode {
  id: string;
  userId: string;
  type: 'personal' | 'payment';
  data: string;
  amount?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface PaymentFlow {
  step: 'amount' | 'recipient' | 'review' | 'processing' | 'result';
  amount?: number;
  recipient?: {
    type: 'vpa' | 'phone' | 'qr';
    value: string;
    name?: string;
  };
  description?: string;
  selectedAccountId?: string;
}

export interface RequestFlow {
  step: 'amount' | 'recipient' | 'review' | 'processing' | 'result';
  amount?: number;
  recipient?: {
    type: 'vpa' | 'phone';
    value: string;
    name?: string;
  };
  description?: string;
}

export interface AppState {
  user: User | null;
  accounts: BankAccount[];
  vpas: VPA[];
  contacts: Contact[];
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  paymentRequests: PaymentRequest[];
  qrCodes: QRCode[];
  paymentFlow: PaymentFlow;
  requestFlow: RequestFlow;
  isLoading: boolean;
  error: string | null;
}

export interface MockBank {
  id: string;
  name: string;
  ifscPrefix: string;
  logo?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type TransactionStatus = 'pending' | 'success' | 'failed';
export type TransactionType = 'pay' | 'request' | 'collect';
export type PaymentMethod = 'vpa' | 'phone' | 'qr';
export type Theme = 'light' | 'dark' | 'system';
