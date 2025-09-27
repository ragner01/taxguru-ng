# TaxGuru NG - Nigerian Tax Calculator

A comprehensive Nigerian tax calculation platform built with React, TypeScript, and Tailwind CSS. Provides accurate, FIRS-compliant tax calculations for individuals and businesses.

## 🚀 Features

### Tax Calculators
- **Personal Income Tax Calculator** - Dual-mode calculator for legacy CRA rules and the 2026+ ₦800k tax-free threshold with rent relief and WHT credits
- **Value Added Tax (VAT) Calculator** - 7.5% standard rate with zero-rated/exempt mapping and input VAT credit guidance
- **Company Income Tax Calculator** - Toggle between legacy and reform rules with 4% development levy and 15% ETR guardrails
- **Capital Gains Tax Calculator** - Legacy 10% CGT engine with 2026+ PIT band transition messaging
- **Penalty & Interest Estimator** - Late filing and payment penalties across PIT, CIT, VAT, and WHT (10% + 5% monthly interest)
- **Digital Services Levy Calculator** - 2%–4% levy coverage for non-resident digital, aviation, and shipping operators
- **Agribusiness Holiday Checker** - Eligibility scoring and action list for the reform-era 5-year agribusiness exemption
- **Account Activity Tracking** - Authenticated users can keep their logs and PDFs synced across devices

### Educational Resources
- **Comprehensive Tax Education** - Complete guide to Nigerian tax laws
- **FIRS Regulations** - Official compliance requirements
- **Tax Guide** - Step-by-step calculation methods
- **FAQ Section** - Common questions and answers
- **Contact Information** - Direct support channels

### Key Features
- ✅ **FIRS Compliant** - Updated for the 2025 Tax Reform Acts with legacy mode fallbacks
- ✅ **Real-time Calculations** - Instant results with detailed band-by-band breakdowns
- ✅ **PDF Exports** - Download ready-to-share summaries for every calculator
- ✅ **Secure Accounts** - Email, Google, and Apple sign-in with Supabase-managed sessions
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Educational Content** - Learn about Nigerian taxes with reform highlights
- ✅ **Privacy Focused** - No data storage, calculations done locally

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or bun

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taxguru-ng.git
   cd taxguru-ng
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with credentials from your Supabase project. Leave them blank if you do not want authentication.

4. **(Optional) Prepare Supabase database**
   ```sql
   create table if not exists public.user_events (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users(id) on delete cascade,
     action text not null,
     payload jsonb default '{}'::jsonb,
     occurred_at timestamptz not null default now()
   );
   ```
   Ensure Google and Apple OAuth providers are enabled in Supabase Auth, and allow authenticated inserts on `user_events` when Row Level Security is enabled.

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
taxguru-ng/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── *.tsx           # Feature components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── assets/             # Static assets
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy to GitHub Pages using GitHub Actions or manual upload

### Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 📊 Tax Rates (2026 Reform Acts)

### Personal Income Tax
- ₦0 - ₦800,000: 0%
- ₦800,001 - ₦3,000,000: 15%
- ₦3,000,001 - ₦12,000,000: 18%
- ₦12,000,001 - ₦25,000,000: 21%
- ₦25,000,001 - ₦50,000,000: 23%
- Above ₦50,000,000: 25%
- Rent relief: 20% of annual rent capped at ₦500,000
- Withholding tax credits offset the computed liability

### VAT
- Standard Rate: 7.5%
- Zero-rated items: 0%
- Exempt items: No VAT

### Company Income Tax
- Small Companies (≤ ₦100M turnover & assets ≤ ₦250M): 0% CIT, CGT, and development levy
- Medium Companies (₦100M - < ₦50bn turnover): 30% CIT + 4% development levy
- Large Groups (≥ ₦50bn turnover or €750m+ MNE): Minimum 15% effective tax rate + 4% development levy
- Agribusiness start-ups: 5-year tax holiday once registered

### Capital Gains Tax
- Individuals: Gains absorbed into personal income tax bands from 2026
- Companies: 30% on chargeable gains and indirect offshore transfers (4% development levy still applies)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. While we strive for accuracy, tax laws and rates are subject to change. Always consult the official FIRS website or a qualified tax professional for current information and specific advice.

**TaxGuru NG is not affiliated with the Federal Inland Revenue Service (FIRS).**

## 📞 Contact

- **Email**: hello@taxguru.ng
- **Phone**: +234 800 TAX GURU
- **Website**: [taxguru.ng](https://taxguru.ng)

## 🙏 Acknowledgments

- Federal Inland Revenue Service (FIRS) for tax regulations
- Nigerian tax professionals for guidance
- Open source community for tools and libraries

---

**Made with ❤️ for Nigeria**
