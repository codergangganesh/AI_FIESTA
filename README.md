# 🎉 AI Fiesta - Advanced AI Model Comparison Platform

![AI Fiesta](https://img.shields.io/badge/AI%20Fiesta-v1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-green)
![Supabase](https://img.shields.io/badge/Supabase-Connected-green)

A comprehensive, modern web application for comparing AI model responses side-by-side with professional payment integration and advanced features.

## ✨ Features

### 🤖 AI Model Comparison
- **Multi-Model Support**: Compare responses from GPT-4, Claude, Gemini, and more
- **Side-by-Side Interface**: Clean, responsive comparison layout
- **Real-time Analysis**: Instant response comparison and metrics
- **Export Capabilities**: Save results in multiple formats

### 💳 Payment System
- **Stripe Integration**: Secure, PCI-compliant payment processing
- **Subscription Plans**: Pro (₹699/month) and Pro Plus (₹1,299/month)
- **7-Day Free Trial**: Risk-free trial for new users
- **Indian Payment Methods**: UPI, Net Banking, Cards, Wallets

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful, modern interface
- **Dark Mode Support**: Complete dark/light theme system
- **Responsive Layout**: Optimized for all devices
- **Advanced Animations**: Smooth transitions and interactions

### 🔐 Authentication & Security
- **Supabase Auth**: Secure email/password authentication
- **Row Level Security**: Database-level security policies
- **JWT Tokens**: Secure session management
- **Password Reset**: Complete account recovery flow

### 📊 Advanced Features
- **Usage Analytics**: Track API usage and performance
- **Plan Management**: Flexible subscription handling
- **Real-time Notifications**: Toast notifications system
- **Account Settings**: Comprehensive user profile management

## 🧑‍💼 Profile Management

This application ensures that user profiles are always consistent with their email IDs. The profile system:

1. Uses the user's email ID as the primary identifier for profile information
2. Automatically generates Gravatar profile pictures based on email addresses
3. Maintains consistency between profile data and email IDs through:
   - Real-time synchronization in the UI components
   - Database-level consistency checks
   - Automated scripts for validation and correction

### Key Features

- **Email-based Profile Pictures**: Profile pictures are automatically generated using Gravatar service based on the user's email address
- **Fallback System**: If a custom profile picture is not set, the system falls back to:
  1. Custom profile picture from user_settings table
  2. Avatar URL from OAuth provider metadata
  3. Gravatar image generated from email ID
- **Automatic Consistency**: Profile information automatically updates when email changes
- **Validation Scripts**: Automated scripts ensure all profiles remain consistent with email IDs

### Scripts

- `scripts/ensure-user-settings.js` - Ensures all users have proper entries in the user_settings table
- `scripts/test-email-profile-consistency.js` - Tests that all profiles are consistent with their email IDs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codergangganesh/AI_FIESTA.git
   cd AI_FIESTA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # OpenRouter API (for AI models)
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Database Setup**
   Run the SQL schema in your Supabase project:
   ```bash
   # Execute the contents of database/enhanced_schema.sql in Supabase SQL Editor
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to `http://localhost:3000`

## 📋 Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database security

### Payments & Auth
- **Stripe** - Payment processing
- **Supabase Auth** - Authentication system
- **JWT** - Secure tokens

### Development
- **Turbopack** - Fast build tool
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🏗️ Project Structure

```
aifiesta/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── stripe/        # Stripe webhooks & checkout
│   │   ├── auth/              # Authentication pages
│   │   ├── chat/              # AI comparison interface
│   │   ├── payment/           # Payment pages
│   │   └── account-settings/  # User settings
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── PlanContext.tsx   # Subscription management
│   │   └── DarkModeContext.tsx # Theme management
│   └── lib/                  # Utilities
│       ├── supabase/         # Supabase clients
│       └── stripe.ts         # Stripe utilities
├── database/                 # Database schema
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 💰 Pricing Plans

### Free Plan
- 2 AI models access
- 10 comparisons/month
- Basic metrics
- Community support

### Pro Plan - ₹699/month
- 4 AI models access
- 500 comparisons/month
- Advanced analytics
- Export capabilities
- Email support

### Pro Plus Plan - ₹1,299/month
- 6+ AI models access
- Unlimited comparisons
- Advanced features
- Priority support
- Custom models

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/enhanced_schema.sql`
3. Configure Row Level Security policies
4. Add environment variables

### Stripe Setup
1. Create Stripe account
2. Get API keys (test/live)
3. Configure webhooks endpoint
4. Set up products and pricing

### AI Models Setup
1. Get OpenRouter API key
2. Configure model access
3. Set usage limits

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Start production server:
   ```bash
   npm start
   ```

## 📚 Documentation

- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Payment Testing Guide](./PAYMENT_TESTING.md)
- [Database Schema](./database/enhanced_schema.sql)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💼 About

**AI Fiesta** is developed by **Mannam Ganesh Babu**, CEO, providing businesses and individuals with powerful AI model comparison capabilities.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the excellent backend platform
- Stripe for secure payment processing
- OpenRouter for AI model access

## 📞 Support

For support, email support@aifiesta.com or join our community discussions.

---

**🎉 Start comparing AI models like never before with AI Fiesta!**