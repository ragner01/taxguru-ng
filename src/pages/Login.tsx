import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const passwordRequirements = [
  { label: "Minimum 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
  { label: "One symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) }
];

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithProvider, loading, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!loading && user) {
    navigate("/");
  }

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validatePassword = (password: string) => passwordRequirements.every((rule) => rule.test(password));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (isSignUp) {
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
        const { error: signUpError } = await signUpWithEmail(form.email, form.password);
        if (signUpError) {
          setError(signUpError);
        } else {
          setInfo("Account created. Check your email for verification if required.");
        }
      } else {
        const { error: signInError } = await signInWithEmail(form.email, form.password);
        if (signInError) {
          setError(signInError);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isSignUp ? <UserPlus className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create your TaxGuru NG account" : "Welcome back to TaxGuru NG"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Track your tax computations securely across devices."
              : "Sign in to access your saved calculations and activity logs."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                className="w-full"
                type="button"
                disabled={submitting}
                onClick={() => handleProviderSignIn("google")}
              >
                <span className="mr-2">🔐</span> Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={submitting}
                onClick={() => handleProviderSignIn("apple")}
              >
                <span className="mr-2">🍎</span> Sign in with Apple
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
  );
};

export default Login;

