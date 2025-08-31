import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/Card';
import { IndianRupee, Smartphone, Shield, Zap } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show splash screen
    setIsVisible(true);

    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => {
      if (user) {
        if (user.isSetupComplete) {
          navigate('/home');
        } else {
          navigate('/setup');
        }
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Payments',
      description: 'Send money instantly to anyone, anywhere'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Safe',
      description: 'Bank-grade security for all transactions'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Easy to Use',
      description: 'Simple and intuitive interface'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-teal-500 to-primary-600 p-4">
      <div className="w-full max-w-md">
        <Card className="text-center animate-fade-in">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-white to-silver-100 rounded-2xl flex items-center justify-center shadow-lg">
                <IndianRupee className="w-10 h-10 text-primary-600" />
              </div>
            </div>

            {/* App Name */}
            <h1 className="text-3xl font-bold text-white mb-2">
              UPI Clone
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Fast, Secure, Digital Payments
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 text-white/90 animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator */}
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>

            {/* Disclaimer */}
            <p className="text-white/60 text-xs mt-6">
              This is a frontend-only demo application for educational purposes.
              No real payments are processed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
