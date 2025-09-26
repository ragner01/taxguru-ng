import { Calculator, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Tax Calculators",
      links: [
        { name: "Personal Income Tax", href: "/#calculators" },
        { name: "Company Income Tax", href: "/#calculators" },
        { name: "Value Added Tax", href: "/#calculators" },
        { name: "Capital Gains Tax", href: "/#calculators" },
        { name: "Penalty Estimator", href: "/#calculators" },
        { name: "Digital Services Levy", href: "/#calculators" },
        { name: "Agribusiness Holiday", href: "/#calculators" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Tax Guide", href: "/tax-guide" },
        { name: "FIRS Regulations", href: "/firs-regulations" },
        { name: "Tax Education", href: "/tax-education" },
        { name: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "About",
      links: [
        { name: "About TaxGuru NG", href: "/contact" },
        { name: "Tax Laws", href: "/firs-regulations" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy-policy" }
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">TaxGuru NG</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted companion for Nigerian tax calculations. 
              Accurate, FIRS-compliant, and easy to use.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@taxguru.ng</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 800 TAX GURU</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TaxGuru NG. All rights reserved. Not affiliated with FIRS.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
