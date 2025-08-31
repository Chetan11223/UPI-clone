import { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { validateAmount } from '@/utils/validators';
import { formatAmount } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  onAmountChange?: (amount: number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  currency?: string;
  maxAmount?: number;
}

export function AmountInput({
  value,
  onChange,
  onValidationChange,
  onAmountChange,
  label = 'Amount',
  placeholder = '0.00',
  error,
  disabled,
  className,
  currency = 'INR',
  maxAmount = 100000
}: AmountInputProps) {
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value) {
      const result = validateAmount(value);
      // Override max amount validation if custom max is provided
      if (result.isValid && maxAmount !== 100000) {
        const numAmount = parseFloat(value);
        if (numAmount > maxAmount) {
          result.isValid = false;
          result.error = `Amount cannot exceed ₹${formatAmount(maxAmount)}`;
        }
      }
      setValidationResult(result);
      onValidationChange?.(result.isValid);
      
      if (result.isValid) {
        onAmountChange?.(parseFloat(value));
      }
    } else {
      setValidationResult({ isValid: false });
      onValidationChange?.(false);
      onAmountChange?.(0);
    }
  }, [value, onValidationChange, onAmountChange, maxAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numbers and decimal point
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setDisplayValue(sanitizedValue);
    onChange(sanitizedValue);
  };

  const handleQuickAmount = (amount: number) => {
    const amountStr = amount.toString();
    setDisplayValue(amountStr);
    onChange(amountStr);
  };

  const getRightIcon = () => {
    if (!value) return null;
    
    if (validationResult.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (validationResult.error) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    
    return null;
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className={cn('space-y-4', className)}>
      <Input
        label={label}
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        leftIcon={<IndianRupee className="w-5 h-5" />}
        rightIcon={getRightIcon()}
        error={error || validationResult.error}
        disabled={disabled}
        type="text"
        inputMode="decimal"
        helperText={`Maximum amount: ₹${formatAmount(maxAmount)}`}
      />
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-silver-700 dark:text-silver-300">
          Quick Amounts
        </p>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAmount(amount)}
              className={cn(
                'px-3 py-2 text-sm rounded-lg border-2 transition-all duration-200',
                'bg-silver-50 dark:bg-silver-800 border-silver-200 dark:border-silver-600',
                'hover:bg-silver-100 dark:hover:bg-silver-700',
                'text-silver-700 dark:text-silver-300 font-medium',
                displayValue === amount.toString() && 
                'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
              )}
            >
              ₹{formatAmount(amount)}
            </button>
          ))}
        </div>
      </div>
      
      {validationResult.isValid && value && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Amount: ₹{formatAmount(parseFloat(value))}
          </span>
        </div>
      )}
    </div>
  );
}
