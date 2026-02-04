import { useState, useEffect, createContext, useContext, ReactNode, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SubscriptionStatus {
  subscribed: boolean;
  hasAccess: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  trialEndDate: string | null;
  productId: string | null;
  subscriptionEnd: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionStatus;
  subscriptionLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, cpf: string, whatsapp: string, endereco: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkSubscription: (currentSession?: Session | null) => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUBSCRIPTION_CACHE_DURATION = 30000; // 30 seconds cache

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    hasAccess: false,
    isInTrial: false,
    trialDaysRemaining: 0,
    trialEndDate: null,
    productId: null,
    subscriptionEnd: null,
  });
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const navigate = useNavigate();
  
  // Refs for debouncing and caching
  const lastCheckRef = useRef<number>(0);
  const checkInProgressRef = useRef<boolean>(false);
  const pendingCheckRef = useRef<Promise<void> | null>(null);

  const checkSubscription = useCallback(async (currentSession?: Session | null) => {
    const now = Date.now();
    
    // If we checked recently, skip (cache for 30 seconds)
    if (now - lastCheckRef.current < SUBSCRIPTION_CACHE_DURATION) {
      console.log('[useAuth] Skipping subscription check - cached');
      return;
    }
    
    // If check is already in progress, wait for it instead of starting a new one
    if (checkInProgressRef.current && pendingCheckRef.current) {
      console.log('[useAuth] Subscription check already in progress, waiting...');
      return pendingCheckRef.current;
    }
    
    // Get session to use - prefer passed session, otherwise get fresh one
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      try {
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        sessionToUse = freshSession;
      } catch (error) {
        console.log('[useAuth] Failed to get session, skipping subscription check');
        return;
      }
    }
    
    // Early exit if no valid session - don't call the edge function at all
    if (!sessionToUse?.access_token) {
      console.log('[useAuth] No valid session for subscription check, skipping');
      return;
    }
    
    checkInProgressRef.current = true;
    setSubscriptionLoading(true);
    
    const checkPromise = (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${sessionToUse!.access_token}`,
          },
        });
        
        if (error) {
          // If it's an auth error, the session might have expired - don't log as error
          if (error.message?.includes('Auth') || error.message?.includes('401')) {
            console.log('[useAuth] Session expired, skipping subscription check');
          } else {
            console.error('Error checking subscription:', error);
          }
          return;
        }

        lastCheckRef.current = Date.now();
        
        setSubscription({
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
        setSubscriptionLoading(false);
        checkInProgressRef.current = false;
        pendingCheckRef.current = null;
      }
    })();
    
    pendingCheckRef.current = checkPromise;
    return checkPromise;
  }, []);

  const createCheckout = useCallback(async () => {
    if (!session?.access_token) {
      console.error('No session available for checkout');
      return;
    }
    
    setSubscriptionLoading(true);
    try {
      console.log('[useAuth] Creating checkout session...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('Error creating checkout:', error);
        setSubscriptionLoading(false);
        return;
      }

      console.log('[useAuth] Checkout response:', data);

      if (data?.url) {
        console.log('[useAuth] Redirecting to checkout URL:', data.url);
        // Use window.location.href for more reliable redirect
        window.location.href = data.url;
      } else {
        console.error('[useAuth] No URL in checkout response');
        setSubscriptionLoading(false);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setSubscriptionLoading(false);
    }
  }, [session]);

  const openCustomerPortal = useCallback(async () => {
    if (!session?.access_token) {
      console.error('No session available for customer portal');
      return;
    }
    
    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error('Error opening customer portal:', error);
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [session]);

  useEffect(() => {
    let mounted = true;
    let initialCheckDone = false;
    
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Only check subscription on specific events, not every change
        if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setTimeout(() => {
            if (mounted) checkSubscription(currentSession);
          }, 100);
        } else if (!currentSession) {
          setSubscription({
            subscribed: false,
            hasAccess: false,
            isInTrial: false,
            trialDaysRemaining: 0,
            trialEndDate: null,
            productId: null,
            subscriptionEnd: null,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!mounted) return;
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setLoading(false);
      
      // Only do initial check if not already done by auth state change
      if (existingSession?.user && !initialCheckDone) {
        initialCheckDone = true;
        setTimeout(() => {
          if (mounted) checkSubscription(existingSession);
        }, 100);
      }
    });

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  // Auto-refresh subscription every 2 minutes (reduced from 1 minute)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, cpf: string, whatsapp: string, endereco: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          cpf: cpf,
          whatsapp: whatsapp,
          endereco: endereco,
        },
      },
    });

    // Send welcome email after successful signup
    if (!error) {
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: { email, name: fullName },
        });
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    try {
      // Clear local state first to ensure UI updates immediately
      setUser(null);
      setSession(null);
      setSubscription({
        subscribed: false,
        hasAccess: false,
        isInTrial: false,
        trialDaysRemaining: 0,
        trialEndDate: null,
        productId: null,
        subscriptionEnd: null,
      });
      
      // Attempt to sign out from Supabase (may fail if session already expired)
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      // Ignore errors - session may already be expired
      console.log('[useAuth] Sign out error (likely session already expired):', error);
    } finally {
      // Always navigate to auth page
      navigate('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      subscription,
      subscriptionLoading,
      signIn, 
      signUp, 
      signOut,
      checkSubscription,
      createCheckout,
      openCustomerPortal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
