import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  formatCurrency, 
  maskAccountNumber,
  formatPhoneNumber 
} from '@/utils/formatters';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Monitor,
  AtSign,
  Building2,
  CreditCard,
  LogOut,
  Edit,
  Check,
  X,
  Star,
  StarOff,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, accounts, vpas, setTheme: setStoreTheme } = useStore();
  const { theme, setTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddVPA, setShowAddVPA] = useState(false);
  const [newVPA, setNewVPA] = useState('');

  const handleLogout = () => {
    // In a real app, this would clear the store and redirect to login
    toast.success('Logout feature will be implemented in the full version');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setStoreTheme(newTheme);
  };

  const handleAddVPA = () => {
    if (!newVPA) {
      toast.error('Please enter a VPA');
      return;
    }
    // In a real app, this would add the VPA to the store
    toast.success('VPA added successfully!');
    setNewVPA('');
    setShowAddVPA(false);
  };

  const handleSetDefaultVPA = (vpaId: string) => {
    // In a real app, this would update the default VPA
    toast.success('Default VPA updated!');
  };

  const handleSetDefaultAccount = (accountId: string) => {
    // In a real app, this would update the default account
    toast.success('Default account updated!');
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        { label: 'Name', value: user?.name || 'N/A' },
        { label: 'Email', value: user?.email || 'N/A' },
        { label: 'Phone', value: user?.phone ? formatPhoneNumber(user.phone) : 'N/A' },
      ]
    },
    {
      title: 'Preferences',
      icon: <Settings className="w-5 h-5" />,
      items: [
        { label: 'Notifications', value: user?.notifications ? 'Enabled' : 'Disabled' },
        { label: 'Theme', value: theme.charAt(0).toUpperCase() + theme.slice(1) },
      ]
    }
  ];

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
              Profile & Settings
            </h1>
            <p className="text-sm text-silver-600 dark:text-silver-400">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-silver-900 dark:text-silver-100">
                  {user?.name}
                </h2>
                <p className="text-silver-600 dark:text-silver-400">
                  {user?.email}
                </p>
                <p className="text-sm text-silver-500 dark:text-silver-500">
                  {user?.phone ? formatPhoneNumber(user.phone) : ''}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <Card key={section.title} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-silver-600 dark:text-silver-400">
                    {item.label}
                  </span>
                  <span className="font-medium text-silver-900 dark:text-silver-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Theme Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light' as const, icon: <Sun className="w-5 h-5" />, label: 'Light' },
                { value: 'dark' as const, icon: <Moon className="w-5 h-5" />, label: 'Dark' },
                { value: 'system' as const, icon: <Monitor className="w-5 h-5" />, label: 'System' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-silver-200 dark:border-silver-600 hover:border-silver-300 dark:hover:border-silver-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === option.value
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
          </CardContent>
        </Card>

        {/* VPAs */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AtSign className="w-5 h-5" />
                UPI IDs
              </CardTitle>
              <Button
                onClick={() => setShowAddVPA(true)}
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {vpas.map((vpa) => (
              <div key={vpa.id} className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <AtSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-silver-900 dark:text-silver-100">
                      {vpa.vpaId}
                    </p>
                    <div className="flex items-center gap-2">
                      {vpa.isDefault && (
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      <StatusBadge status={vpa.isActive ? 'success' : 'failed'} size="sm" />
                    </div>
                  </div>
                </div>
                {!vpa.isDefault && (
                  <button
                    onClick={() => handleSetDefaultVPA(vpa.id)}
                    className="p-2 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-silver-50 dark:bg-silver-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-silver-900 dark:text-silver-100">
                      {account.bankName}
                    </p>
                    <p className="text-sm text-silver-600 dark:text-silver-400">
                      {maskAccountNumber(account.accountNumber)} • {account.accountType}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {account.isDefault && (
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      <span className="text-sm font-semibold text-silver-900 dark:text-silver-100">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </div>
                </div>
                {!account.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAccount(account.id)}
                    className="p-2 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Two-Factor Authentication</span>
              <span className="text-sm text-silver-500 dark:text-silver-500">Not enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Biometric Login</span>
              <span className="text-sm text-silver-500 dark:text-silver-500">Not available</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-silver-600 dark:text-silver-400">Transaction PIN</span>
              <span className="text-sm text-silver-500 dark:text-silver-500">Not set</span>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Logout
        </Button>

        {/* Add VPA Modal */}
        {showAddVPA && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md animate-fade-in">
              <CardHeader>
                <CardTitle>Add New UPI ID</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="UPI ID"
                  value={newVPA}
                  onChange={(e) => setNewVPA(e.target.value)}
                  placeholder="username@provider"
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddVPA(false);
                      setNewVPA('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVPA}
                    className="flex-1"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
