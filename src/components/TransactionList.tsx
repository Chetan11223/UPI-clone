import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  formatCurrency, 
  formatRelativeTime, 
  formatTransactionType 
} from '@/utils/formatters';
import { 
  Send, 
  Download, 
  Filter, 
  ChevronRight,
  Calendar,
  Search
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  showFilters?: boolean;
  maxItems?: number;
  className?: string;
}

export function TransactionList({ 
  transactions, 
  title = 'Transactions',
  showFilters = true,
  maxItems,
  className 
}: TransactionListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.senderVpa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.receiverVpa?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(txn => txn.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(txn => txn.type === typeFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit items if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [transactions, searchTerm, statusFilter, typeFilter, maxItems]);

  const getTransactionIcon = (type: string) => {
    return type === 'pay' ? (
      <Send className="w-5 h-5 text-red-600 dark:text-red-400" />
    ) : (
      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'pay' 
      ? 'bg-red-100 dark:bg-red-900/30' 
      : 'bg-green-100 dark:bg-green-900/30';
  };

  const getAmountColor = (type: string) => {
    return type === 'pay' 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-green-600 dark:text-green-400';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-silver-50 dark:bg-silver-800 border border-silver-200 dark:border-silver-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && showFiltersPanel && (
          <div className="space-y-4 pt-4 border-t border-silver-200 dark:border-silver-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-silver-50 dark:bg-silver-800 border border-silver-200 dark:border-silver-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 dark:text-silver-300 mb-2">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-silver-50 dark:bg-silver-800 border border-silver-200 dark:border-silver-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">All Types</option>
                  <option value="pay">Pay</option>
                  <option value="collect">Collect</option>
                  <option value="request">Request</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => navigate(`/transactions/${transaction.id}`)}
                className="flex items-center justify-between p-4 bg-silver-50 dark:bg-silver-800 rounded-xl cursor-pointer hover:bg-silver-100 dark:hover:bg-silver-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-silver-900 dark:text-silver-100 truncate">
                      {transaction.description || formatTransactionType(transaction.type)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-silver-600 dark:text-silver-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatRelativeTime(transaction.timestamp)}</span>
                    </div>
                    <p className="text-xs text-silver-500 dark:text-silver-500 truncate">
                      Ref: {transaction.referenceId}
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 'pay' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <StatusBadge status={transaction.status} size="sm" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-silver-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-silver-100 dark:bg-silver-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-silver-400" />
            </div>
            <p className="text-silver-600 dark:text-silver-400 mb-2">
              {hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
