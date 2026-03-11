import { useState, useEffect } from "react";
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
          <Button onClick={handleSave} disabled={saving}>{saving ? i18nString('saving') : i18nString('saveChanges')}</Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">{i18nString('account')}</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>{i18nString('logIn')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
