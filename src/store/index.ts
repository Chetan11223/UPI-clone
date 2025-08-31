import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, 
  User, 
  BankAccount, 
  VPA, 
  Contact, 
  Beneficiary, 
  Transaction, 
  PaymentRequest, 
  QRCode,
  PaymentFlow,
  RequestFlow,
  Theme
} from '@/types';
import { 
  mockUser, 
  mockAccounts, 
  mockVPAs, 
  mockContacts, 
  mockBeneficiaries, 
  mockTransactions, 
  mockPaymentRequests, 
  mockQRCodes 
} from '@/utils/mockData';

interface Store extends AppState {
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setAccounts: (accounts: BankAccount[]) => void;
  addAccount: (account: BankAccount) => void;
  updateAccount: (id: string, updates: Partial<BankAccount>) => void;
  setVPAs: (vpas: VPA[]) => void;
  addVPA: (vpa: VPA) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  addBeneficiary: (beneficiary: Beneficiary) => void;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setPaymentRequests: (requests: PaymentRequest[]) => void;
  addPaymentRequest: (request: PaymentRequest) => void;
  updatePaymentRequest: (id: string, updates: Partial<PaymentRequest>) => void;
  setQRCodes: (qrCodes: QRCode[]) => void;
  addQRCode: (qrCode: QRCode) => void;
  setPaymentFlow: (flow: PaymentFlow) => void;
  resetPaymentFlow: () => void;
  setRequestFlow: (flow: RequestFlow) => void;
  resetRequestFlow: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setTheme: (theme: Theme) => void;
  resetStore: () => void;
}

const initialState: AppState = {
  user: null,
  accounts: [],
  vpas: [],
  contacts: [],
  beneficiaries: [],
  transactions: [],
  paymentRequests: [],
  qrCodes: [],
  paymentFlow: { step: 'amount' },
  requestFlow: { step: 'amount' },
  isLoading: false,
  error: null,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      setAccounts: (accounts) => set({ accounts }),
      
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, account]
      })),
      
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map(acc => 
          acc.id === id ? { ...acc, ...updates } : acc
        )
      })),

      setVPAs: (vpas) => set({ vpas }),
      
      addVPA: (vpa) => set((state) => ({
        vpas: [...state.vpas, vpa]
      })),

      setContacts: (contacts) => set({ contacts }),
      
      addContact: (contact) => set((state) => ({
        contacts: [...state.contacts, contact]
      })),
      
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map(contact => 
          contact.id === id ? { ...contact, ...updates } : contact
        )
      })),

      setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
      
      addBeneficiary: (beneficiary) => set((state) => ({
        beneficiaries: [...state.beneficiaries, beneficiary]
      })),
      
      updateBeneficiary: (id, updates) => set((state) => ({
        beneficiaries: state.beneficiaries.map(ben => 
          ben.id === id ? { ...ben, ...updates } : ben
        )
      })),

      setTransactions: (transactions) => set({ transactions }),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(txn => 
          txn.id === id ? { ...txn, ...updates } : txn
        )
      })),

      setPaymentRequests: (requests) => set({ paymentRequests: requests }),
      
      addPaymentRequest: (request) => set((state) => ({
        paymentRequests: [request, ...state.paymentRequests]
      })),
      
      updatePaymentRequest: (id, updates) => set((state) => ({
        paymentRequests: state.paymentRequests.map(req => 
          req.id === id ? { ...req, ...updates } : req
        )
      })),

      setQRCodes: (qrCodes) => set({ qrCodes }),
      
      addQRCode: (qrCode) => set((state) => ({
        qrCodes: [...state.qrCodes, qrCode]
      })),

      setPaymentFlow: (flow) => set({ paymentFlow: flow }),
      
      resetPaymentFlow: () => set({ 
        paymentFlow: { step: 'amount' } 
      }),

      setRequestFlow: (flow) => set({ requestFlow: flow }),
      
      resetRequestFlow: () => set({ 
        requestFlow: { step: 'amount' } 
      }),

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      setTheme: (theme) => set((state) => ({
        user: state.user ? { ...state.user, theme } : null
      })),

      resetStore: () => set(initialState),
    }),
    {
      name: 'upi-clone-storage',
      partialize: (state) => ({
        user: state.user,
        accounts: state.accounts,
        vpas: state.vpas,
        contacts: state.contacts,
        beneficiaries: state.beneficiaries,
        transactions: state.transactions,
        paymentRequests: state.paymentRequests,
        qrCodes: state.qrCodes,
      }),
    }
  )
);

// Initialize store with mock data if empty
export const initializeStore = () => {
  const state = useStore.getState();
  
  if (!state.user) {
    useStore.getState().setUser(mockUser);
  }
  
  if (state.accounts.length === 0) {
    useStore.getState().setAccounts(mockAccounts);
  }
  
  if (state.vpas.length === 0) {
    useStore.getState().setVPAs(mockVPAs);
  }
  
  if (state.contacts.length === 0) {
    useStore.getState().setContacts(mockContacts);
  }
  
  if (state.beneficiaries.length === 0) {
    useStore.getState().setBeneficiaries(mockBeneficiaries);
  }
  
  if (state.transactions.length === 0) {
    useStore.getState().setTransactions(mockTransactions);
  }
  
  if (state.paymentRequests.length === 0) {
    useStore.getState().setPaymentRequests(mockPaymentRequests);
  }
  
  if (state.qrCodes.length === 0) {
    useStore.getState().setQRCodes(mockQRCodes);
  }
};
