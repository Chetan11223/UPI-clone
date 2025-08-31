import { cn } from '@/utils/cn';
import { formatTransactionStatus } from '@/utils/formatters';

interface StatusBadgeProps {
  status: 'pending' | 'success' | 'failed' | 'accepted' | 'declined' | 'expired';
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const statusClasses = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    declined: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    expired: 'bg-silver-100 dark:bg-silver-800 text-silver-700 dark:text-silver-400',
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    >
      {formatTransactionStatus(status)}
    </span>
  );
}
