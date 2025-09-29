import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const passwordRequirements = [
  { label: "Minimum 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) }
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithEmail, signUpWithEmail, signInWithProvider, loading, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/";
  }, [location.state]);

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectPath, { replace: true });
    }
  }, [loading, user, navigate, redirectPath]);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validatePassword = (password: string) => passwordRequirements.every((rule) => rule.test(password));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (isSignUp) {
      if (!form.username.trim()) {
        setError("Please choose a username.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!validatePassword(form.password)) {
        setError("Password does not meet the required complexity.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUpWithEmail(form.email, form.password, form.username.trim());
        if (signUpError) {
          setError(signUpError);
        } else {
          setInfo("Account created. Check your email for verification if required.");
        }
      } else {
        const { error: signInError } = await signInWithEmail(form.email, form.password);
        if (signInError) {
          setError(signInError);
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleProviderSignIn = async (provider: "google" | "apple") => {
    setError(null);
    setSubmitting(true);
    const { error: providerError } = await signInWithProvider(provider);
    if (providerError) {
      setError(providerError);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="absolute inset-0 hero-gradient opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />

      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="hidden w-full max-w-xl flex-col justify-between border-b border-r border-border bg-background/80 px-10 py-12 backdrop-blur lg:flex">
          <div className="space-y-6">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              Trusted Nigerian Tax Companion
            </Badge>
            <h1 className="text-3xl font-bold leading-tight">All your Nigerian tax tools, secure and personalised.</h1>
            <p className="text-muted-foreground">
              Sign in once to sync Personal Income Tax, VAT, and corporate levy scenarios, generate polished PDF summaries, and maintain a tidy audit log for compliance.
            </p>
          </div>
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-border">
            <img src={heroImage} alt="Tax planning dashboard" className="h-64 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Stay organised across filings:</p>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed">
                <li>• Save PIT, VAT, and company tax computations for later</li>
                <li>• Export elegant PDF reports for PAYE or board reviews</li>
                <li>• Log important events (due dates, submissions, reconciliations)</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">OAuth via Google & Apple supported. Email verification included via Supabase Auth.</p>
        </aside>

        <div className="flex w-full flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <Card className="w-full max-w-lg border-border/70 bg-background/95 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isSignUp ? <UserPlus className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Create your TaxGuru NG account" : "Welcome back to TaxGuru NG"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Unlock synced calculators, compliance-ready logs, and polished PDFs."
                : "Continue planning your Nigerian tax strategy with your saved scenarios."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSupabaseConfigured && (
              <Alert variant="destructive">
                <AlertDescription>
                  Authentication is not configured. Add your Supabase credentials to `.env` to enable sign-in.
                </AlertDescription>
              </Alert>
            )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="taxguru_pro"
                    value={form.username}
                    onChange={handleChange("username")}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={form.password}
                onChange={handleChange("password")}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                  />
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-1">
                  <div className="flex items-center gap-2 font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Password requirements
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {passwordRequirements.map((rule) => (
                      <li key={rule.label}>
                        <span
                          className={rule.test(form.password) ? "text-primary" : "text-muted-foreground"}
                        >
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                </>
              ) : isSignUp ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </Button>
            </form>

            <div className="space-y-3">
              <Separator label="or continue with" labelPosition="center" />
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-border text-foreground hover:bg-secondary/40"
                  type="button"
                  disabled={submitting}
                  onClick={() => handleProviderSignIn("google")}
                >
                  <span className="text-lg">🔐</span> Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 border-border text-foreground hover:bg-secondary/40"
                  type="button"
                  disabled={submitting}
                  onClick={() => handleProviderSignIn("apple")}
                >
                  <span className="text-lg">🍎</span> Continue with Apple
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp((prev) => !prev);
                  setError(null);
                  setInfo(null);
                }}
                className="text-primary hover:underline"
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              By continuing you agree to our <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
            </p>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
