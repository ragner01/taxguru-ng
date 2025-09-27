import { Calculator, LogOut, Menu, UserCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { username, user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const scrollToCalculators = () => {
    const calculatorsSection = document.getElementById("calculators");
    if (calculatorsSection) {
      calculatorsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#calculators";
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Calculators", href: "#calculators" },
    { name: "Tax History", href: "#tax-history" },
    { name: "Tax Calendar", href: "#tax-calendar" },
    { name: "Tax Savings", href: "#tax-savings" },
    { name: "Tax Rates", href: "#tax-rates" }
  ];

  const friendlyName = username || user?.email?.split("@")[0] || "there";

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">TaxGuru NG</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              <UserCircle2 className="h-4 w-4 text-primary" />
              <span>Welcome, <span className="font-semibold text-foreground">{friendlyName}</span></span>
            </div>
            <Button
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
              onClick={scrollToCalculators}
            >
              Start Calculating
            </Button>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" /> {loggingOut ? "Signing out" : "Logout"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-card rounded-lg border border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Hello, {friendlyName}</p>
                <p className="mt-1 text-xs">
                  Signed in as <span className="text-foreground/80">{user?.email}</span>
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary-glow text-primary-foreground mt-2"
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToCalculators();
                }}
              >
                Start Calculating
              </Button>
              <Button
                variant="outline"
                className="border-destructive/40 text-destructive"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                disabled={loggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
