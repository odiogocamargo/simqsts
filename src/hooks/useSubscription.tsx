import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionStatus {
  subscribed: boolean;
  hasAccess: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  trialEndDate: string | null;
  productId: string | null;
  subscriptionEnd: string | null;
}

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    hasAccess: false,
    isInTrial: false,
    trialDaysRemaining: 0,
    trialEndDate: null,
    productId: null,
    subscriptionEnd: null,
  });
  const [loading, setLoading] = useState(false);

  const checkSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscriptionStatus({
        subscribed: data?.subscribed ?? false,
        hasAccess: data?.has_access ?? false,
        isInTrial: data?.is_in_trial ?? false,
        trialDaysRemaining: data?.trial_days_remaining ?? 0,
        trialEndDate: data?.trial_end_date ?? null,
        productId: data?.product_id ?? null,
        subscriptionEnd: data?.subscription_end ?? null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        console.error('Error creating checkout:', error);
        toast.error('Erro ao iniciar checkout. Tente novamente.');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Erro ao iniciar checkout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const openCustomerPortal = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        toast.error('Erro ao abrir portal de gerenciamento. Tente novamente.');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Erro ao abrir portal de gerenciamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subscriptionStatus,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
