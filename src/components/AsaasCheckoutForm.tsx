import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AsaasCheckoutFormProps {
  onSuccess?: () => void;
}

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const AsaasCheckoutForm = ({ onSuccess }: AsaasCheckoutFormProps) => {
  const { user, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);

  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ccv, setCcv] = useState("");

  const [cpf, setCpf] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Você precisa estar logado");
      return;
    }

    const [expMonth, expYearShort] = expiry.split("/");
    if (!expMonth || !expYearShort || expMonth.length !== 2) {
      toast.error("Validade no formato MM/AA");
      return;
    }
    const expYear = expYearShort.length === 2 ? `20${expYearShort}` : expYearShort;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-asaas-subscription", {
        body: {
          creditCard: {
            holderName: holderName.trim(),
            number: onlyDigits(cardNumber),
            expiryMonth: expMonth,
            expiryYear: expYear,
            ccv: onlyDigits(ccv),
          },
          holderInfo: {
            name: holderName.trim(),
            email: user.email,
            cpfCnpj: onlyDigits(cpf),
            postalCode: onlyDigits(postalCode),
            addressNumber: addressNumber.trim(),
            phone: onlyDigits(phone),
          },
        },
      });

      if (error || data?.error) {
        toast.error(data?.error || error?.message || "Erro ao processar pagamento");
        return;
      }

      toast.success("Assinatura criada com sucesso!");
      await checkSubscription(undefined, true);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Assinar Premium — R$ 49,99/mês
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <Lock className="h-3 w-3" />
          Pagamento seguro processado pelo Asaas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holderName">Nome impresso no cartão</Label>
            <Input id="holderName" value={holderName} onChange={(e) => setHolderName(e.target.value)} required placeholder="Como está no cartão" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do cartão</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expiry">Validade (MM/AA)</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => {
                  let v = onlyDigits(e.target.value);
                  if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                  setExpiry(v);
                }}
                required
                maxLength={5}
                placeholder="12/28"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ccv">CVV</Label>
              <Input id="ccv" value={ccv} onChange={(e) => setCcv(e.target.value)} required maxLength={4} placeholder="123" inputMode="numeric" />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <p className="text-sm font-medium">Dados do titular</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required maxLength={14} placeholder="000.000.000-00" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} placeholder="(11) 99999-9999" inputMode="numeric" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="postalCode">CEP</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required maxLength={9} placeholder="00000-000" inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressNumber">Número</Label>
                <Input id="addressNumber" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} required placeholder="123" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? "Processando..." : "Confirmar assinatura"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Cobrança recorrente mensal de R$ 49,99. Cancele quando quiser.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
