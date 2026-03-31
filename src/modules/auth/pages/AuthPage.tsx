import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Globe, Wallet } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorMessages";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

type AuthMode = "login" | "register" | "forgotPassword" | "resetPassword";

export default function AuthPage() {
  const { t, i18n } = useTranslation();
  const i18nString = (key: string) => t("auth." + key);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Detect password reset token in URL (Supabase redirects with #access_token)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setMode("resetPassword");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, [i18n]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    navigate("/home");
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin + "/auth",
      },
    });
    if (error) throw error;
    toast.success(i18nString("checkEmail"));
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
    });
    if (error) throw error;
    toast.success(i18nString("resetEmailSent"));
    setMode("login");
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error(i18nString("passwordsMismatch"));
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    toast.success(i18nString("passwordUpdated"));
    // Clear hash and go to login
    window.history.replaceState(null, "", window.location.pathname);
    navigate("/home");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") await handleLogin();
      else if (mode === "register") await handleRegister();
      else if (mode === "forgotPassword") await handleForgotPassword();
      else if (mode === "resetPassword") await handleResetPassword();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const titles: Record<AuthMode, string> = {
    login: i18nString("login"),
    register: i18nString("register"),
    forgotPassword: i18nString("forgotPassword"),
    resetPassword: i18nString("resetPassword"),
  };

  const descriptions: Record<AuthMode, string> = {
    login: i18nString("loginDescription"),
    register: i18nString("registerDescription"),
    forgotPassword: i18nString("forgotPasswordDescription"),
    resetPassword: i18nString("resetPasswordDescription"),
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Cambiar idioma">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover text-popover-foreground rounded-md border shadow-md p-1">
            <DropdownMenuItem
              onClick={() => changeLanguage("es")}
              className="cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground outline-none"
            >
              <span className="mr-2">🇪🇸</span> {i18nString("espanish")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage("en")}
              className="cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground outline-none"
            >
              <span className="mr-2">🇬🇧</span> {i18nString("english")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">{titles[mode]}</CardTitle>
          <p className="text-sm text-muted-foreground">{descriptions[mode]}</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name — register only */}
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label>{i18nString("fullName")}</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={i18nString("yourName")}
                  required
                />
              </div>
            )}

            {/* Email — login, register, forgotPassword */}
            {mode !== "resetPassword" && (
              <div className="space-y-1.5">
                <Label>{i18nString("email")}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={i18nString("yourEmail")}
                  required
                />
              </div>
            )}

            {/* Password — login, register, resetPassword */}
            {mode !== "forgotPassword" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>{i18nString("password")}</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgotPassword")}
                      className="text-xs text-primary hover:underline"
                    >
                      {i18nString("forgotPasswordLink")}
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            {/* Confirm password — resetPassword only */}
            {mode === "resetPassword" && (
              <div className="space-y-1.5">
                <Label>{i18nString("confirmPassword")}</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? i18nString("loading") : titles[mode]}
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
            {(mode === "login" || mode === "forgotPassword") && (
              <p>
                {i18nString("noAccount")}{" "}
                <button onClick={() => setMode("register")} className="text-primary hover:underline font-medium">
                  {i18nString("register")}
                </button>
              </p>
            )}
            {mode === "register" && (
              <p>
                {i18nString("alreadyAccount")}{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                  {i18nString("login")}
                </button>
              </p>
            )}
            {mode === "forgotPassword" && (
              <p>
                <button onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
                  {i18nString("backToLogin")}
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
