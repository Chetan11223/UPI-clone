export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return formatDate(dateObj);
  }
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) {
    return accountNumber;
  }
  
  const lastFour = accountNumber.slice(-4);
  const maskedPart = '*'.repeat(accountNumber.length - 4);
  return `${maskedPart}${lastFour}`;
};

export const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 4) {
    return phone;
  }
  
  const lastFour = phone.slice(-4);
  const maskedPart = '*'.repeat(phone.length - 4);
  return `${maskedPart}${lastFour}`;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 98765 43210
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatAccountNumber = (accountNumber: string): string => {
  // Remove all non-digits
  const cleaned = accountNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const formatIFSC = (ifsc: string): string => {
  return ifsc.toUpperCase();
};

export const generateReferenceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${random}`.toUpperCase();
};

export const generateUPIReferenceId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${timestamp}${random}`;
};

export const formatBalance = (balance: number): string => {
  if (balance >= 10000000) {
    return `${(balance / 10000000).toFixed(1)}Cr`;
  } else if (balance >= 100000) {
    return `${(balance / 100000).toFixed(1)}L`;
  } else if (balance >= 1000) {
    return `${(balance / 1000).toFixed(1)}K`;
  }
  return balance.toString();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    pay: 'Payment',
    request: 'Request',
    collect: 'Collection',
  };
  return typeMap[type] || capitalizeFirst(type);
};

export const formatTransactionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    success: 'Successful',
    failed: 'Failed',
    accepted: 'Accepted',
    declined: 'Declined',
    expired: 'Expired',
  };
  return statusMap[status] || capitalizeFirst(status);
};
