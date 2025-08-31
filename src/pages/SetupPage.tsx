import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VPAInput } from '@/components/VPAInput';
import { MockApiService } from '@/services/mockApi';
import { mockBanks } from '@/utils/mockData';
import { validateAccountNumber, validateIFSC, validateName } from '@/utils/validators';
import { 
  Building2, 
  CreditCard, 
  AtSign, 
  CheckCircle, 
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type SetupStep = 'bank' | 'vpa' | 'complete';

export function SetupPage() {
  const navigate = useNavigate();
  const { user, updateUser, addAccount, addVPA } = useStore();
  
  const [step, setStep] = useState<SetupStep>('bank');
  const [isLoading, setIsLoading] = useState(false);
  
  // Bank form state
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankList, setShowBankList] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');
  
  // VPA form state
  const [vpaId, setVpaId] = useState('');
  const [isVpaValid, setIsVpaValid] = useState(false);

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBank || !accountNumber || !ifscCode) {
      toast.error('Please fill in all fields');
      return;
    }

    const accountValidation = validateAccountNumber(accountNumber);
    const ifscValidation = validateIFSC(ifscCode);
    
    if (!accountValidation.isValid) {
      toast.error(accountValidation.error || 'Invalid account number');
      return;
    }
    
    if (!ifscValidation.isValid) {
      toast.error(ifscValidation.error || 'Invalid IFSC code');
      return;
    }

    setIsLoading(true);
    try {
      const bank = mockBanks.find(b => b.id === selectedBank);
      const response = await MockApiService.linkBankAccount({
        bankName: bank?.name || '',
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        accountType,
        balance: Math.random() * 100000 + 10000, // Random balance between 10k-110k
        isDefault: true,
      });
      
      if (response.success && response.data) {
        addAccount(response.data);
        toast.success('Bank account linked successfully!');
        setStep('vpa');
      } else {
        toast.error(response.error || 'Failed to link bank account');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVPASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVpaValid) {
      toast.error('Please enter a valid VPA');
      return;
    }

    setIsLoading(true);
    try {
      const response = await MockApiService.createVPA(vpaId);
      
      if (response.success && response.data) {
        addVPA(response.data);
        toast.success('VPA created successfully!');
        setStep('complete');
      } else {
        toast.error(response.error || 'Failed to create VPA');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSetup = () => {
    if (user) {
      updateUser({ isSetupComplete: true });
      toast.success('Setup completed! Welcome to UPI Clone');
      navigate('/home');
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'bank': return 33;
      case 'vpa': return 66;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-silver-700 dark:text-silver-300">
              Setup Progress
            </span>
            <span className="text-sm text-silver-600 dark:text-silver-400">
              {getStepProgress()}%
            </span>
          </div>
          <div className="w-full bg-silver-200 dark:bg-silver-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {step === 'bank' && 'Link Your Bank Account'}
              {step === 'vpa' && 'Create Your UPI ID'}
              {step === 'complete' && 'Setup Complete!'}
            </CardTitle>
            <p className="text-silver-600 dark:text-silver-400">
              {step === 'bank' && 'Connect your bank account to start making payments'}
              {step === 'vpa' && 'Create a unique UPI ID for receiving payments'}
              {step === 'complete' && 'You\'re all set to use UPI Clone'}
            </p>
          </CardHeader>

          <CardContent>
            {step === 'bank' && (
              <form onSubmit={handleBankSubmit} className="space-y-6">
                {/* Bank Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-silver-700 dark:text-silver-300">
                    Select Bank
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBankList(!showBankList)}
                      className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-silver-400" />
                        <span className={selectedBank ? 'text-silver-900 dark:text-silver-100' : 'text-silver-400'}>
                          {selectedBank ? mockBanks.find(b => b.id === selectedBank)?.name : 'Choose your bank'}
                        </span>
                      </div>
                      {showBankList ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {showBankList && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-silver-800 rounded-xl border border-silver-200 dark:border-silver-600 shadow-lg z-10 max-h-48 overflow-y-auto">
                        {mockBanks.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => {
                              setSelectedBank(bank.id);
                              setShowBankList(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-silver-50 dark:hover:bg-silver-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                          >
                            <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-silver-400" />
                              <span className="text-silver-900 dark:text-silver-100">{bank.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Number */}
                <Input
                  label="Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789012"
                  leftIcon={<CreditCard className="w-5 h-5" />}
                  type="text"
                  inputMode="numeric"
                  maxLength={18}
                  required
                />

                {/* IFSC Code */}
                <Input
                  label="IFSC Code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="HDFC0001234"
                  leftIcon={<Building2 className="w-5 h-5" />}
                  type="text"
                  maxLength={11}
                  required
                />

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-silver-700 dark:text-silver-300">
                    Account Type
                  </label>
                  <div className="flex gap-2">
                    {(['savings', 'current'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccountType(type)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          accountType === type
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'bg-silver-50 dark:bg-silver-800 border-silver-200 dark:border-silver-600 text-silver-700 dark:text-silver-300'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Link Account
                </Button>
              </form>
            )}

            {step === 'vpa' && (
              <form onSubmit={handleVPASubmit} className="space-y-6">
                <VPAInput
                  value={vpaId}
                  onChange={setVpaId}
                  onValidationChange={setIsVpaValid}
                  label="Create UPI ID"
                  placeholder="rahul.sharma@hdfc"
                  helperText="Choose a unique UPI ID for receiving payments"
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={!isVpaValid}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create UPI ID
                </Button>
              </form>
            )}

            {step === 'complete' && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-silver-900 dark:text-silver-100 mb-2">
                    Setup Complete!
                  </h3>
                  <p className="text-silver-600 dark:text-silver-400">
                    Your bank account is linked and UPI ID is ready. You can now start making and receiving payments.
                  </p>
                </div>

                <Button
                  onClick={handleCompleteSetup}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
