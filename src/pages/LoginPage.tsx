import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MockApiService } from '@/services/mockApi';
import { validatePhoneNumber } from '@/utils/validators';
import { formatPhoneNumber } from '@/utils/formatters';
import { 
  Smartphone, 
  ArrowLeft, 
  Send, 
  Lock, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useStore();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await MockApiService.sendOTP(phone);
      
      if (response.success) {
        setOtpSent(true);
        setCountdown(30);
        toast.success('OTP sent successfully!');
        setStep('otp');
      } else {
        toast.error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    
    try {
      const response = await MockApiService.login(phone, otp);
      
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Login successful!');
        
        if (response.data.isSetupComplete) {
          navigate('/home');
        } else {
          navigate('/setup');
        }
      } else {
        toast.error(response.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const response = await MockApiService.sendOTP(phone);
      
      if (response.success) {
        setCountdown(30);
        toast.success('OTP resent successfully!');
      } else {
        toast.error(response.error || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-teal-500 to-primary-600 p-4">
      <div className="w-full max-w-md">
        <Card className="animate-fade-in">
          <CardHeader className="text-center pb-4">
            {step === 'otp' && (
              <button
                onClick={() => setStep('phone')}
                className="absolute left-4 top-4 p-2 text-silver-600 dark:text-silver-400 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-silver-900 dark:text-silver-100">
              {step === 'phone' ? 'Welcome to UPI Clone' : 'Enter OTP'}
            </CardTitle>
            
            <p className="text-silver-600 dark:text-silver-400">
              {step === 'phone' 
                ? 'Enter your mobile number to continue' 
                : `OTP sent to ${formatPhoneNumber(phone)}`
              }
            </p>
          </CardHeader>

          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <Input
                  label="Mobile Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="98765 43210"
                  leftIcon={<Smartphone className="w-5 h-5" />}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  helperText="Enter your 10-digit mobile number"
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="123456"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowOtp(!showOtp)}
                        className="text-silver-400 hover:text-silver-600 dark:hover:text-silver-300"
                      >
                        {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    type={showOtp ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={6}
                    required
                    helperText="Enter the 6-digit OTP sent to your mobile"
                  />
                  
                  <div className="text-center">
                    <p className="text-sm text-silver-600 dark:text-silver-400">
                      Didn't receive OTP?{' '}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || isLoading}
                        className="text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                      </button>
                    </p>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                >
                  Verify & Continue
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-silver-500 dark:text-silver-400">
                    Demo OTP: <span className="font-mono bg-silver-100 dark:bg-silver-800 px-2 py-1 rounded">123456</span>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
