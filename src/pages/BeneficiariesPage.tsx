import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  formatCurrency, 
  formatRelativeTime,
  formatPhoneNumber 
} from '@/utils/formatters';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Send, 
  Star, 
  StarOff,
  User,
  Phone,
  AtSign,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';

export function BeneficiariesPage() {
  const navigate = useNavigate();
  const { beneficiaries, contacts } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredBeneficiaries = beneficiaries.filter(ben => {
    const matchesSearch = ben.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ben.vpaId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ben.phone?.includes(searchTerm);
    
    if (showFavorites) {
      return matchesSearch && ben.isFavorite;
    }
    
    return matchesSearch;
  });

  const handleQuickPay = (beneficiary: any) => {
    // Navigate to pay page with pre-filled beneficiary details
    navigate('/pay', { 
      state: { 
        recipientType: beneficiary.vpaId ? 'vpa' : 'phone',
        recipientValue: beneficiary.vpaId || beneficiary.phone,
        recipientName: beneficiary.name
      }
    });
  };

  const handleToggleFavorite = (beneficiaryId: string) => {
    // In a real app, this would update the beneficiary in the store
    console.log('Toggle favorite for:', beneficiaryId);
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
                Beneficiaries
              </h1>
              <p className="text-sm text-silver-600 dark:text-silver-400">
                Manage your saved contacts
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-400" />
            <input
              type="text"
              placeholder="Search beneficiaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-silver-800/50 border border-silver-200 dark:border-silver-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={showFavorites ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              leftIcon={<Star className="w-4 h-4" />}
            >
              Favorites
            </Button>
          </div>
        </div>

        {/* Beneficiaries List */}
        <div className="space-y-4">
          {filteredBeneficiaries.length > 0 ? (
            filteredBeneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-silver-900 dark:text-silver-100 truncate">
                            {beneficiary.name}
                          </h3>
                          {beneficiary.isFavorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-silver-600 dark:text-silver-400">
                          {beneficiary.vpaId && (
                            <div className="flex items-center gap-1">
                              <AtSign className="w-3 h-3" />
                              <span className="truncate">{beneficiary.vpaId}</span>
                            </div>
                          )}
                          {beneficiary.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{formatPhoneNumber(beneficiary.phone)}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-silver-500 dark:text-silver-500">
                          Last used: {formatRelativeTime(beneficiary.lastUsed)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleQuickPay(beneficiary)}
                        size="sm"
                        leftIcon={<Send className="w-3 h-3" />}
                      >
                        Pay
                      </Button>
                      <button
                        onClick={() => handleToggleFavorite(beneficiary.id)}
                        className="p-2 text-silver-400 hover:text-silver-600 dark:hover:text-silver-300 hover:bg-silver-100 dark:hover:bg-silver-800 rounded-lg transition-colors"
                      >
                        {beneficiary.isFavorite ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-silver-100 dark:bg-silver-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-silver-400" />
                </div>
                <h3 className="text-lg font-semibold text-silver-900 dark:text-silver-100 mb-2">
                  No beneficiaries found
                </h3>
                <p className="text-silver-600 dark:text-silver-400 mb-4">
                  {searchTerm || showFavorites 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first beneficiary to get started'
                  }
                </p>
                {!searchTerm && !showFavorites && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Beneficiary
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Beneficiary Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md animate-fade-in">
              <CardHeader>
                <CardTitle>Add New Beneficiary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter beneficiary name"
                />
                <Input
                  label="UPI ID (Optional)"
                  placeholder="username@provider"
                />
                <Input
                  label="Phone Number (Optional)"
                  placeholder="98765 43210"
                  type="tel"
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1">
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
