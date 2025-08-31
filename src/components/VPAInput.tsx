import { useState, useEffect } from 'react';
import { AtSign, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { validateVPA } from '@/utils/validators';
import { cn } from '@/utils/cn';

interface VPAInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const UPI_PROVIDERS = [
  'okicici', 'paytm', 'phonepe', 'gpay', 'amazonpay', 'bhim',
  'axis', 'hdfc', 'sbi', 'icici', 'kotak', 'yesbank', 'pnb',
  'unionbank', 'canara', 'bankofbaroda', 'idfc', 'federal'
];

export function VPAInput({
  value,
  onChange,
  onValidationChange,
  label = 'UPI ID',
  placeholder = 'username@provider',
  error,
  disabled,
  className
}: VPAInputProps) {
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      const result = validateVPA(value);
      setValidationResult(result);
      onValidationChange?.(result.isValid);
    } else {
      setValidationResult({ isValid: false });
      onValidationChange?.(false);
    }
  }, [value, onValidationChange]);

  useEffect(() => {
    if (value && !value.includes('@')) {
      const username = value.toLowerCase();
      const filteredProviders = UPI_PROVIDERS.filter(provider => 
        provider.startsWith(username) || provider.includes(username)
      ).slice(0, 5);
      setSuggestions(filteredProviders.map(provider => `${value}@${provider}`));
      setShowSuggestions(filteredProviders.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase();
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
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

  return (
    <div className={cn('relative', className)}>
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        leftIcon={<AtSign className="w-5 h-5" />}
        rightIcon={getRightIcon()}
        error={error || validationResult.error}
        disabled={disabled}
        helperText="Enter your UPI ID in format: username@provider"
      />
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-silver-800 rounded-xl border border-silver-200 dark:border-silver-600 shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-silver-50 dark:hover:bg-silver-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-2">
                <AtSign className="w-4 h-4 text-silver-400" />
                <span className="text-silver-900 dark:text-silver-100">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {validationResult.isValid && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ Valid UPI ID
        </p>
      )}
    </div>
  );
}
