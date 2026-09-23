import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { useAuth } from "@/shared/auth/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ButtonSpinner } from "@/shared/components/ui/loader";

const APP_SHARE_URL = "https://personal-finances-app-navy.vercel.app/auth";

export const Settings = () => {
  const { t } = useTranslation();
  const i18nString = (key: string) => t('settings.' + key);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? "");
  const [baseCurrency, setBaseCurrency] = useState("COP");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setFullName(data.full_name ?? "");
        setBaseCurrency(data.base_currency);
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, base_currency: baseCurrency }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Perfil actualizado");
  };

  const handleSignOut = async () => { await signOut(); navigate("/auth"); };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(APP_SHARE_URL);
    toast.success(i18nString('linkCopied'));
  };

  const initials = fullName ? fullName.split(" ").map((n: string[]) => n[0]).join("").toUpperCase().slice(0, 2) : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{i18nString('setting')}</h1>
        <p className="text-sm text-muted-foreground">{i18nString('description')}</p>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">{i18nString('profile')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-bold">{initials}</div>
            <div>
              <p className="font-medium">{fullName || i18nString('user')}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{i18nString('fullName')}</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <ButtonSpinner />}
            {saving ? i18nString('saving') : i18nString('saveChanges')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">{i18nString('account')}</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>{i18nString('logIn')}</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">{i18nString('shareApp')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{i18nString('shareAppDescription')}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="rounded-lg bg-white p-3 shrink-0">
              <QRCodeSVG value={APP_SHARE_URL} size={140} />
            </div>
            <div className="flex w-full flex-col gap-2 sm:max-w-xs">
              <Input value={APP_SHARE_URL} readOnly onFocus={(e) => e.target.select()} className="text-xs" />
              <Button variant="outline" onClick={handleCopyLink} className="gap-2">
                <Copy className="h-4 w-4" />
                {i18nString('copyLink')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
