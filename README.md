# UPI Clone - Frontend-Only Payment App

A responsive, frontend-only UPI (Unified Payments Interface) clone that simulates real UPI user journeys without any backend or actual payments. Built with modern React technologies and a polished fintech design.

## ⚠️ Disclaimer

This is a **frontend-only demonstration** project. No real payments are processed, and all data is stored locally in your browser. This app is for educational and demonstration purposes only.

## 🚀 Features

### Core Functionality
- **Onboarding Flow**: Splash screen, mock OTP login, bank linking, VPA creation
- **Dashboard**: Masked balance display, recent transactions, quick actions
- **Payment Flows**: Complete payment journeys via UPI ID, mobile number, or QR codes
- **Request Money**: Create and manage payment requests
- **QR Code Management**: Generate personal QR codes and scan payment QR codes
- **Transaction History**: Detailed history with filtering and export options
- **Beneficiaries**: Manage saved contacts with quick pay functionality
- **Profile & Settings**: Account management, theme toggle, security settings

### Technical Features
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Theme**: System-aware theme switching with smooth transitions
- **Offline-First**: All data persisted in localStorage
- **Mock API**: Realistic network delays and error simulation
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Error Handling**: Graceful error boundaries and user feedback

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **State Management**: Zustand with persistence
- **UI Components**: Custom component library with Lucide React icons
- **QR Codes**: qrcode.react for generation
- **Notifications**: react-hot-toast
- **Testing**: Vitest with React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd upi-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card)
│   ├── AuthGuard.tsx   # Route protection
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── ...
├── pages/              # Page components
│   ├── SplashScreen.tsx
│   ├── LoginPage.tsx
│   ├── SetupPage.tsx
│   ├── HomePage.tsx
│   ├── PayPage.tsx
│   ├── RequestPage.tsx
│   ├── QRPage.tsx
│   ├── HistoryPage.tsx
│   ├── BeneficiariesPage.tsx
│   ├── TransactionDetailPage.tsx
│   └── ProfilePage.tsx
├── store/              # Zustand state management
│   └── index.ts
├── services/           # Mock API services
│   └── mockApi.ts
├── utils/              # Utility functions
│   ├── validators.ts   # Input validation
│   ├── formatters.ts   # Data formatting
│   ├── mockData.ts     # Seeded demo data
│   └── cn.ts          # Class name utilities
├── types/              # TypeScript type definitions
│   └── index.ts
└── test/              # Test setup
    └── setup.ts
```

## 🎯 User Journey

### 1. Onboarding
- **Splash Screen**: App branding and feature overview
- **Login**: Mock OTP verification with seeded phone numbers
- **Bank Linking**: Select from mock bank list
- **VPA Creation**: Create UPI ID with validation
- **Account Selection**: Choose default payment account

### 2. Main App
- **Dashboard**: Overview of balance, recent activity, quick actions
- **Pay Money**: Multi-step payment flow with recipient selection
- **Request Money**: Create payment requests for others
- **QR Codes**: Generate personal QR or scan payment QR
- **History**: View and filter transaction history
- **Beneficiaries**: Manage saved contacts and quick pay
- **Profile**: Account settings, theme, security options

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#3B82F6` to `#0EA5E9`)
- **Teal**: Accent color (`#14B8A6`)
- **Silver**: Neutral tones for backgrounds and text
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Components
- **Glass Cards**: Frosted glass effect with backdrop blur
- **Gradient Buttons**: Primary actions with blue-teal gradients
- **Status Badges**: Color-coded transaction and request status
- **Input Fields**: Consistent styling with validation states
- **Loading States**: Skeleton screens and spinners

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI
```

## 🧪 Testing

The project includes unit tests for utility functions:

```bash
npm run test
```

Tests cover:
- Input validation functions
- Data formatting utilities
- Currency and date formatting
- UPI ID validation patterns

## 📱 Mock Data

The app comes with seeded demo data including:
- **Demo User**: John Doe with mock credentials
- **Bank Accounts**: 3 linked accounts with different balances
- **UPI IDs**: Multiple VPAs for different providers
- **Contacts**: Saved beneficiaries for quick pay
- **Transactions**: Mixed-status transaction history
- **Payment Requests**: Pending and completed requests

## 🔒 Security Features (Mock)

- **OTP Verification**: Simulated SMS-based authentication
- **Transaction PIN**: Placeholder for PIN-based transactions
- **Biometric Auth**: Placeholder for fingerprint/face unlock
- **2FA**: Placeholder for two-factor authentication

## 🚧 Limitations

### Current Limitations
- **No Real Payments**: All transactions are simulated
- **Local Storage Only**: Data is not synced across devices
- **No Backend**: No server-side validation or processing
- **Limited QR Scanning**: QR scanning is placeholder functionality
- **No Push Notifications**: Real-time updates not implemented

### Future Enhancements
- **Real Backend Integration**: Connect to actual payment APIs
- **NPCI Sandbox**: Integrate with UPI sandbox environment
- **Push Notifications**: Real-time transaction updates
- **Biometric Authentication**: Actual fingerprint/face unlock
- **Offline Support**: Service worker for offline functionality
- **Multi-language Support**: Internationalization
- **Analytics**: User behavior tracking and insights

## 🎯 Performance Targets

- **Lighthouse Performance**: ≥90
- **Accessibility**: ≥95
- **Best Practices**: ≥95
- **SEO**: ≥90

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UPI**: Unified Payments Interface by NPCI
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide React**: For the beautiful icons
- **Zustand**: For the lightweight state management

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Note**: This is a demonstration project. For production use, ensure compliance with local financial regulations and implement proper security measures.
