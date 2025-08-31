import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { TransactionList } from '@/components/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export function HistoryPage() {
  const navigate = useNavigate();
  const { transactions } = useStore();

  const totalPayments = transactions.filter(t => t.type === 'pay' && t.status === 'success').length;
  const totalCollections = transactions.filter(t => t.type === 'collect' && t.status === 'success').length;
  const totalAmountPaid = transactions
    .filter(t => t.type === 'pay' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalAmountCollected = transactions
    .filter(t => t.type === 'collect' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting CSV...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 text-silver-600 dark:text-silver-400 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-silver-900 dark:text-silver-100">
                Transaction History
              </h1>
              <p className="text-sm text-silver-600 dark:text-silver-400">
                View all your transactions
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-silver-600 dark:text-silver-400">Paid</p>
                  <p className="font-semibold text-silver-900 dark:text-silver-100">
                    {formatCurrency(totalAmountPaid)}
                  </p>
                  <p className="text-xs text-silver-500 dark:text-silver-500">
                    {totalPayments} transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-silver-600 dark:text-silver-400">Collected</p>
                  <p className="font-semibold text-silver-900 dark:text-silver-100">
                    {formatCurrency(totalAmountCollected)}
                  </p>
                  <p className="text-xs text-silver-500 dark:text-silver-500">
                    {totalCollections} transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <TransactionList 
          transactions={transactions}
          title="All Transactions"
          showFilters={true}
        />
      </div>
    </div>
  );
}
