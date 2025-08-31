import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  formatCurrency, 
  formatDateTime, 
  formatTransactionType,
  formatTransactionStatus 
} from '@/utils/formatters';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Send, 
  Download as CollectIcon,
  Calendar,
  Hash,
  User,
  Building2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useStore();
  const [copied, setCopied] = useState(false);

  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-silver-900 dark:text-silver-100 mb-2">
              Transaction Not Found
            </h1>
            <p className="text-silver-600 dark:text-silver-400 mb-4">
              The transaction you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/history')}>
              Back to History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyReference = () => {
    navigator.clipboard.writeText(transaction.referenceId);
    setCopied(true);
    toast.success('Reference ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a receipt
    toast.success('Receipt download feature will be implemented in the full version');
  };

  const handleShareTransaction = () => {
    // In a real app, this would share transaction details
    toast.success('Share feature will be implemented in the full version');
  };

  const getTransactionIcon = () => {
    return transaction.type === 'pay' ? (
      <Send className="w-6 h-6 text-red-600 dark:text-red-400" />
    ) : (
      <CollectIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
    );
  };

  const getTransactionColor = () => {
    return transaction.type === 'pay' 
      ? 'bg-red-100 dark:bg-red-900/30' 
      : 'bg-green-100 dark:bg-green-900/30';
  };

  const getAmountColor = () => {
    return transaction.type === 'pay' 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/history')}
            className="p-2 text-silver-600 dark:text-silver-400 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-silver-900 dark:text-silver-100">
              Transaction Details
            </h1>
            <p className="text-sm text-silver-600 dark:text-silver-400">
              {formatTransactionType(transaction.type)}
            </p>
          </div>
        </div>

        {/* Transaction Status Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 ${getTransactionColor()} rounded-full flex items-center justify-center mx-auto`}>
                {getTransactionIcon()}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100 mb-2">
                  {formatCurrency(transaction.amount)}
                </h2>
                <p className="text-silver-600 dark:text-silver-400 mb-3">
                  {transaction.description || formatTransactionType(transaction.type)}
                </p>
                <StatusBadge status={transaction.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Type</span>
              <span className="font-medium text-silver-900 dark:text-silver-100">
                {formatTransactionType(transaction.type)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Status</span>
              <span className="font-medium text-silver-900 dark:text-silver-100">
                {formatTransactionStatus(transaction.status)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Date & Time</span>
              <span className="font-medium text-silver-900 dark:text-silver-100">
                {formatDateTime(transaction.timestamp)}
              </span>
            </div>

            {transaction.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-silver-600 dark:text-silver-400">Completed</span>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {formatDateTime(transaction.completedAt)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Reference ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-silver-900 dark:text-silver-100">
                  {transaction.referenceId}
                </span>
                <button
                  onClick={handleCopyReference}
                  className="p-1 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">UPI Reference</span>
              <span className="font-mono text-sm text-silver-900 dark:text-silver-100">
                {transaction.upiReferenceId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Parties Involved */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Parties Involved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transaction.senderVpa && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-silver-400" />
                  <span className="text-silver-600 dark:text-silver-400">From</span>
                </div>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {transaction.senderVpa}
                </span>
              </div>
            )}

            {transaction.receiverVpa && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-silver-400" />
                  <span className="text-silver-600 dark:text-silver-400">To</span>
                </div>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {transaction.receiverVpa}
                </span>
              </div>
            )}

            {transaction.senderPhone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-silver-400" />
                  <span className="text-silver-600 dark:text-silver-400">From Phone</span>
                </div>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {transaction.senderPhone}
                </span>
              </div>
            )}

            {transaction.receiverPhone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-silver-400" />
                  <span className="text-silver-600 dark:text-silver-400">To Phone</span>
                </div>
                <span className="font-medium text-silver-900 dark:text-silver-100">
                  {transaction.receiverPhone}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Failure Reason */}
        {transaction.failureReason && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-red-600 dark:text-red-400">Failure Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400">
                {transaction.failureReason}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadReceipt}
            className="flex-1"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Receipt
          </Button>
          <Button
            variant="outline"
            onClick={handleShareTransaction}
            className="flex-1"
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
