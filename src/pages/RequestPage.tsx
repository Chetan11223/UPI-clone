import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmountInput } from '@/components/AmountInput';
import { VPAInput } from '@/components/VPAInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MockApiService } from '@/services/mockApi';
import { 
  formatCurrency, 
  formatPhoneNumber,
  generateReferenceId 
} from '@/utils/formatters';
import { 
  ArrowLeft, 
  Download, 
  AtSign, 
  Smartphone, 
  CheckCircle, 
  XCircle,
  User
} from 'lucide-react';

type RequestStep = 'amount' | 'recipient' | 'review' | 'processing' | 'result';

export function RequestPage() {
  const navigate = useNavigate();
  const { addPaymentRequest } = useStore();
  
  const [step, setStep] = useState<RequestStep>('amount');
  const [amount, setAmount] = useState('');
  const [recipientType, setRecipientType] = useState<'vpa' | 'phone'>('vpa');
  const [recipientValue, setRecipientValue] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestResult, setRequestResult] = useState<{
    success: boolean;
    request?: any;
    error?: string;
  } | null>(null);

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setStep('recipient');
  };

  const handleRecipientSubmit = () => {
    if (!recipientValue) {
      toast.error('Please enter recipient details');
      return;
    }
    setStep('review');
  };

  const handleReviewSubmit = async () => {
    setIsLoading(true);
    setStep('processing');

    try {
      const response = await MockApiService.requestMoney({
        amount: parseFloat(amount),
        recipient: {
          type: recipientType,
          value: recipientValue,
          name: recipientName,
        },
        description,
      });

      if (response.success && response.data) {
        addPaymentRequest(response.data);
        setRequestResult({
          success: true,
          request: response.data,
        });
        toast.success('Money request sent successfully!');
      } else {
        setRequestResult({
          success: false,
          error: response.error || 'Failed to send request',
        });
        toast.error(response.error || 'Failed to send request');
      }
    } catch (error) {
      setRequestResult({
        success: false,
        error: 'Network error. Please try again.',
      });
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setStep('result');
    }
  };

  const handleBack = () => {
    if (step === 'recipient') {
      setStep('amount');
    } else if (step === 'review') {
      setStep('recipient');
    } else if (step === 'result') {
      navigate('/home');
    }
  };

  const handleNewRequest = () => {
    setAmount('');
    setRecipientValue('');
    setRecipientName('');
    setDescription('');
    setRequestResult(null);
    setStep('amount');
  };

  const getStepProgress = () => {
    switch (step) {
      case 'amount': return 25;
      case 'recipient': return 50;
      case 'review': return 75;
      case 'processing': return 90;
      case 'result': return 100;
      default: return 0;
    }
  };

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
          How much would you like to request?
        </h2>
        <p className="text-silver-600 dark:text-silver-400">
          Enter the amount you want to request
        </p>
      </div>

      <AmountInput
        value={amount}
        onChange={setAmount}
        label="Amount to Request"
        placeholder="0.00"
      />

      <Button
        onClick={handleAmountSubmit}
        className="w-full"
        disabled={!amount || parseFloat(amount) <= 0}
        rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}
      >
        Continue
      </Button>
    </div>
  );

  const renderRecipientStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
          Who would you like to request from?
        </h2>
        <p className="text-silver-600 dark:text-silver-400">
          Choose how you want to request money
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'vpa' as const, icon: <AtSign className="w-5 h-5" />, label: 'UPI ID' },
            { type: 'phone' as const, icon: <Smartphone className="w-5 h-5" />, label: 'Phone' },
          ].map((option) => (
            <button
              key={option.type}
              onClick={() => setRecipientType(option.type)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                recipientType === option.type
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-silver-200 dark:border-silver-600 hover:border-silver-300 dark:hover:border-silver-500'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  recipientType === option.type
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-silver-100 dark:bg-silver-800'
                }`}>
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-silver-900 dark:text-silver-100">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {recipientType === 'vpa' && (
          <VPAInput
            value={recipientValue}
            onChange={setRecipientValue}
            label="Recipient UPI ID"
            placeholder="username@provider"
          />
        )}

        {recipientType === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={recipientValue}
                onChange={(e) => setRecipientValue(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                Recipient Name (Optional)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient name"
                className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this request for?"
            className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
            maxLength={50}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleRecipientSubmit}
          className="flex-1"
          disabled={!recipientValue}
          rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
          Review Request
        </h2>
        <p className="text-silver-600 dark:text-silver-400">
          Please confirm the request details
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-silver-600 dark:text-silver-400">Amount</span>
            <span className="text-2xl font-bold text-silver-900 dark:text-silver-100">
              {formatCurrency(parseFloat(amount))}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-silver-600 dark:text-silver-400">From</span>
            <div className="text-right">
              <p className="font-medium text-silver-900 dark:text-silver-100">
                {recipientName || recipientValue}
              </p>
              <p className="text-sm text-silver-500 dark:text-silver-500">
                {recipientType === 'phone' ? formatPhoneNumber(recipientValue) : recipientValue}
              </p>
            </div>
          </div>

          {description && (
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Description</span>
              <span className="text-silver-900 dark:text-silver-100">{description}</span>
            </div>
          )}

          <div className="border-t border-silver-200 dark:border-silver-600 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Reference ID</span>
              <span className="text-sm font-mono text-silver-500 dark:text-silver-500">
                {generateReferenceId()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <Button
          onClick={handleReviewSubmit}
          className="flex-1"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Send Request
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <LoadingSpinner size="lg" text="Sending Request..." />
      
      <div>
        <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
          Sending Request
        </h2>
        <p className="text-silver-600 dark:text-silver-400">
          Please wait while we send your request...
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl">
          <span className="text-silver-600 dark:text-silver-400">Amount</span>
          <span className="font-semibold text-silver-900 dark:text-silver-100">
            {formatCurrency(parseFloat(amount))}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl">
          <span className="text-silver-600 dark:text-silver-400">Recipient</span>
          <span className="font-semibold text-silver-900 dark:text-silver-100">
            {recipientName || recipientValue}
          </span>
        </div>
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="text-center space-y-6">
      {requestResult?.success ? (
        <>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
              Request Sent!
            </h2>
            <p className="text-silver-600 dark:text-silver-400">
              Your money request has been sent successfully
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-silver-600 dark:text-silver-400">Amount Requested</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-silver-600 dark:text-silver-400">From</span>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {recipientName || recipientValue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-silver-600 dark:text-silver-400">Reference</span>
                <span className="text-sm font-mono text-silver-500 dark:text-silver-500">
                  {requestResult.request?.id}
                </span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
              Request Failed
            </h2>
            <p className="text-silver-600 dark:text-silver-400">
              {requestResult?.error || 'Something went wrong'}
            </p>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
        >
          {requestResult?.success ? 'Done' : 'Try Again'}
        </Button>
        {requestResult?.success && (
          <Button
            onClick={handleNewRequest}
            className="flex-1"
            leftIcon={<Download className="w-4 h-4" />}
          >
            New Request
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="p-2 text-silver-600 dark:text-silver-400 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-silver-900 dark:text-silver-100">
              Request Money
            </h1>
            <p className="text-sm text-silver-600 dark:text-silver-400">
              Step {['amount', 'recipient', 'review', 'processing', 'result'].indexOf(step) + 1} of 5
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-silver-700 dark:text-silver-300">
              Request Progress
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

        {/* Step Content */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            {step === 'amount' && renderAmountStep()}
            {step === 'recipient' && renderRecipientStep()}
            {step === 'review' && renderReviewStep()}
            {step === 'processing' && renderProcessingStep()}
            {step === 'result' && renderResultStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
