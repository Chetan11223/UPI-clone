import { useState } from 'react';
import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  formatCurrency, 
  maskAccountNumber 
} from '@/utils/formatters';
import { 
  Building2, 
  CreditCard, 
  ChevronDown, 
  ChevronUp,
  Check
} from 'lucide-react';

interface AccountSelectorProps {
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  className?: string;
}

export function AccountSelector({ 
  selectedAccountId, 
  onAccountSelect, 
  className 
}: AccountSelectorProps) {
  const { accounts } = useStore();
  const [showAccountList, setShowAccountList] = useState(false);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  if (!selectedAccount) return null;

  return (
    <div className={className}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-silver-700 dark:text-silver-300">
          Select Account
        </label>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAccountList(!showAccountList)}
            className="w-full p-4 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 flex items-center justify-between text-left hover:border-silver-300 dark:hover:border-silver-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-medium text-silver-900 dark:text-silver-100">
                  {selectedAccount.bankName}
                </p>
                <p className="text-sm text-silver-600 dark:text-silver-400">
                  {maskAccountNumber(selectedAccount.accountNumber)} • {selectedAccount.accountType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-silver-900 dark:text-silver-100">
                {formatCurrency(selectedAccount.balance)}
              </span>
              {showAccountList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
          
          {showAccountList && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-silver-800 rounded-xl border border-silver-200 dark:border-silver-600 shadow-lg z-10 max-h-64 overflow-y-auto">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    onAccountSelect(account.id);
                    setShowAccountList(false);
                  }}
                  className="w-full p-4 text-left hover:bg-silver-50 dark:hover:bg-silver-700 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-silver-100 dark:border-silver-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-silver-900 dark:text-silver-100">
                            {account.bankName}
                          </p>
                          {account.isDefault && (
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-silver-600 dark:text-silver-400">
                          {maskAccountNumber(account.accountNumber)} • {account.accountType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-silver-900 dark:text-silver-100">
                        {formatCurrency(account.balance)}
                      </span>
                      {selectedAccountId === account.id && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
