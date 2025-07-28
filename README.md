# TaxGuru NG - Nigerian Tax Calculator

A comprehensive Nigerian tax calculation platform built with React, TypeScript, and Tailwind CSS. Provides accurate, FIRS-compliant tax calculations for individuals and businesses.

## 🚀 Features

### Tax Calculators
- **Personal Income Tax Calculator** - Progressive tax rates (7%-24%)
- **Value Added Tax (VAT) Calculator** - 7.5% standard rate with exemptions
- **Company Income Tax Calculator** - SME and large company rates
- **Capital Gains Tax Calculator** - 10% standard rate
- **Withholding Tax Calculator** - Various payment types
- **Stamp Duty Calculator** - Document-based calculations

### Educational Resources
- **Comprehensive Tax Education** - Complete guide to Nigerian tax laws
- **FIRS Regulations** - Official compliance requirements
- **Tax Guide** - Step-by-step calculation methods
- **FAQ Section** - Common questions and answers
- **Contact Information** - Direct support channels

### Key Features
- ✅ **FIRS Compliant** - Based on current Nigerian tax laws
- ✅ **Real-time Calculations** - Instant results with detailed breakdowns
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Modern UI/UX** - Beautiful, intuitive interface
- ✅ **Educational Content** - Learn about Nigerian taxes
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

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser**
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

## 📊 Tax Rates (2024)

### Personal Income Tax
- First ₦300,000: 7%
- ₦300,001 - ₦600,000: 11%
- ₦600,001 - ₦1,100,000: 15%
- ₦1,100,001 - ₦1,600,000: 19%
- ₦1,600,001 - ₦3,200,000: 21%
- Above ₦3,200,000: 24%

### VAT
- Standard Rate: 7.5%
- Zero-rated items: 0%
- Exempt items: No VAT

### Company Income Tax
- Small Companies (≤₦25M): 0%
- Medium Companies (₦25M-₦100M): 20%
- Large Companies (>₦100M): 30%

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
