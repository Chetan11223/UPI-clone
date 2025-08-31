import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmountInput } from '@/components/AmountInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MockApiService } from '@/services/mockApi';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  QrCode, 
  Camera, 
  Download, 
  Share2,
  Copy,
  CheckCircle
} from 'lucide-react';

export function QRPage() {
  const navigate = useNavigate();
  const { user, vpas } = useStore();
  
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [qrType, setQrType] = useState<'personal' | 'payment'>('personal');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultVPA = vpas.find(v => v.isDefault)?.vpaId || '';

  const handleGenerateQR = async () => {
    if (qrType === 'payment' && (!amount || parseFloat(amount) <= 0)) {
      toast.error('Please enter a valid amount for payment QR');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await MockApiService.generateQRCode({
        type: qrType,
        amount: qrType === 'payment' ? parseFloat(amount) : undefined,
        description: qrType === 'payment' ? description : undefined,
      });

      if (response.success && response.data) {
        setGeneratedQR(response.data.data);
        toast.success('QR code generated successfully!');
      } else {
        toast.error(response.error || 'Failed to generate QR code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyQR = () => {
    navigator.clipboard.writeText(generatedQR);
    setCopied(true);
    toast.success('QR data copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // In a real app, this would download the QR code as an image
    toast.success('QR code download feature will be implemented in the full version');
  };

  const handleShareQR = () => {
    // In a real app, this would share the QR code
    toast.success('QR code sharing feature will be implemented in the full version');
  };

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
              QR Code
            </h1>
            <p className="text-sm text-silver-600 dark:text-silver-400">
              Generate and scan QR codes
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-silver-100 dark:bg-silver-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'generate'
                ? 'bg-white dark:bg-silver-700 text-silver-900 dark:text-silver-100 shadow-sm'
                : 'text-silver-600 dark:text-silver-400 hover:text-silver-900 dark:hover:text-silver-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              Generate
            </div>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-silver-700 text-silver-900 dark:text-silver-100 shadow-sm'
                : 'text-silver-600 dark:text-silver-400 hover:text-silver-900 dark:hover:text-silver-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Scan
            </div>
          </button>
        </div>

        {activeTab === 'generate' ? (
          <div className="space-y-6">
            {/* QR Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'personal' as const, icon: <QrCode className="w-5 h-5" />, label: 'Personal QR', description: 'For receiving payments' },
                    { type: 'payment' as const, icon: <QrCode className="w-5 h-5" />, label: 'Payment QR', description: 'With specific amount' },
                  ].map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setQrType(option.type)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        qrType === option.type
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-silver-200 dark:border-silver-600 hover:border-silver-300 dark:hover:border-silver-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          qrType === option.type
                            ? 'bg-primary-100 dark:bg-primary-900/30'
                            : 'bg-silver-100 dark:bg-silver-800'
                        }`}>
                          {option.icon}
                        </div>
                        <span className="font-medium text-silver-900 dark:text-silver-100">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-silver-600 dark:text-silver-400">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* QR Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                    Your UPI ID
                  </label>
                  <div className="p-3 bg-silver-50 dark:bg-silver-800 rounded-lg">
                    <p className="text-silver-900 dark:text-silver-100 font-medium">
                      {defaultVPA || 'No UPI ID found'}
                    </p>
                  </div>
                </div>

                {qrType === 'payment' && (
                  <>
                    <AmountInput
                      value={amount}
                      onChange={setAmount}
                      label="Amount"
                      placeholder="0.00"
                    />

                    <div>
                      <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this payment for?"
                        className="w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-silver-800/50 backdrop-blur-sm border-silver-200 dark:border-silver-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        maxLength={50}
                      />
                    </div>
                  </>
                )}

                <Button
                  onClick={handleGenerateQR}
                  className="w-full"
                  loading={isGenerating}
                  disabled={!defaultVPA || (qrType === 'payment' && (!amount || parseFloat(amount) <= 0))}
                  leftIcon={<QrCode className="w-4 h-4" />}
                >
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Generated QR Code */}
            {generatedQR && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-white rounded-xl">
                        <QRCodeSVG
                          value={generatedQR}
                          size={200}
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleCopyQR}
                        variant="outline"
                        className="w-full"
                        leftIcon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {copied ? 'Copied!' : 'Copy QR Data'}
                      </Button>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleDownloadQR}
                          variant="outline"
                          leftIcon={<Download className="w-4 h-4" />}
                        >
                          Download
                        </Button>
                        <Button
                          onClick={handleShareQR}
                          variant="outline"
                          leftIcon={<Share2 className="w-4 h-4" />}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-silver-100 dark:bg-silver-800 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-16 h-16 text-silver-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
                Scan QR Code
              </h2>
              <p className="text-silver-600 dark:text-silver-400">
                QR code scanning feature will be implemented in the full version
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setActiveTab('generate')}
              leftIcon={<QrCode className="w-4 h-4" />}
            >
              Generate QR Instead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
