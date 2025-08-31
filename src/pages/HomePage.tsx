import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TransactionList } from '@/components/TransactionList';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  formatCurrency, 
  formatBalance, 
  maskAccountNumber,
  formatRelativeTime 
} from '@/utils/formatters';
import { 
  IndianRupee, 
  Send, 
  Download, 
  QrCode, 
  History, 
  Users, 
  Eye, 
  EyeOff,
  Plus,
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { user, accounts, transactions, paymentRequests } = useStore();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAccount = accounts.find(acc => acc.isDefault) || accounts[0];
  const recentTransactions = transactions.slice(0, 5);
  const pendingRequests = paymentRequests.filter(req => req.status === 'pending');

  const quickActions = [
    {
      icon: <Send className="w-6 h-6" />,
      title: 'Pay',
      description: 'Send money',
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/pay'),
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Request',
      description: 'Ask for money',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/request'),
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'Scan QR',
      description: 'Pay via QR',
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/qr'),
    },
    {
      icon: <History className="w-6 h-6" />,
      title: 'History',
      description: 'View transactions',
      color: 'from-orange-500 to-red-500',
      onClick: () => navigate('/history'),
    },
  ];

  const handleRefreshBalance = async () => {
    setIsLoading(true);
    // Simulate balance refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-teal-500 p-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">UPI Clone</h1>
                <p className="text-white/80 text-sm">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-silver-600 dark:text-silver-400 text-sm font-medium">
                    Available Balance
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-silver-900 dark:text-silver-100">
                      {showBalance ? formatCurrency(defaultAccount?.balance || 0) : '₹****'}
                    </h2>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 transition-colors"
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isLoading}
                  className="p-2 bg-silver-100 dark:bg-silver-800 rounded-lg hover:bg-silver-200 dark:hover:bg-silver-700 transition-colors disabled:opacity-50"
                >
                  <LoadingSpinner size="sm" text="" />
                </button>
              </div>

              {defaultAccount && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-silver-600 dark:text-silver-400">
                      {defaultAccount.bankName}
                    </span>
                    <span className="text-silver-500 dark:text-silver-500">
                      • {maskAccountNumber(defaultAccount.accountNumber)}
                    </span>
                  </div>
                  <span className="text-silver-600 dark:text-silver-400">
                    {defaultAccount.accountType}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="p-4 rounded-xl border-2 border-silver-200 dark:border-silver-600 hover:border-silver-300 dark:hover:border-silver-500 transition-all duration-200 hover:scale-105 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-silver-900 dark:text-silver-100 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-silver-600 dark:text-silver-400">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Requests */}
        {pendingRequests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-silver-900 dark:text-silver-100">
                          {request.requesterName}
                        </p>
                        <p className="text-sm text-silver-600 dark:text-silver-400">
                          {formatCurrency(request.amount)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                ))}
                {pendingRequests.length > 3 && (
                  <button
                    onClick={() => navigate('/request')}
                    className="w-full p-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                  >
                    View all {pendingRequests.length} requests
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <span className="text-sm">View all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                    className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl cursor-pointer hover:bg-silver-100 dark:hover:bg-silver-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'pay' 
                          ? 'bg-red-100 dark:bg-red-900/30' 
                          : 'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        {transaction.type === 'pay' ? (
                          <Send className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-silver-900 dark:text-silver-100">
                          {transaction.description || 'Payment'}
                        </p>
                        <p className="text-sm text-silver-600 dark:text-silver-400">
                          {formatRelativeTime(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'pay' 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {transaction.type === 'pay' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-silver-100 dark:bg-silver-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-silver-400" />
                </div>
                <p className="text-silver-600 dark:text-silver-400">
                  No transactions yet
                </p>
                <p className="text-sm text-silver-500 dark:text-silver-500">
                  Start by making your first payment
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/beneficiaries')}
                className="w-full flex items-center justify-between p-4 bg-silver-50 dark:bg-silver-800 rounded-xl hover:bg-silver-100 dark:hover:bg-silver-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-silver-900 dark:text-silver-100">
                      Beneficiaries
                    </p>
                    <p className="text-sm text-silver-600 dark:text-silver-400">
                      Manage saved contacts
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-silver-400" />
              </button>

              <button
                onClick={() => navigate('/qr')}
                className="w-full flex items-center justify-between p-4 bg-silver-50 dark:bg-silver-800 rounded-xl hover:bg-silver-100 dark:hover:bg-silver-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-silver-900 dark:text-silver-100">
                      My QR Code
                    </p>
                    <p className="text-sm text-silver-600 dark:text-silver-400">
                      Generate payment QR
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-silver-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
