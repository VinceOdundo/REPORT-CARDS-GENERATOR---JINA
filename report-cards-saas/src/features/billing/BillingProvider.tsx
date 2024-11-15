import React, { createContext, useState, useEffect } from "react";
import { billingService } from "./billingService";
import { useAuth } from "../auth/useAuth";
import { Subscription } from "../../types/subscription";
import { useAsync } from "../../hooks/useAsync";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";

interface BillingContextType {
  subscription: Subscription | null;
  loading: boolean;
  error: Error | null;
  createSubscription: (plan: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>;
}

export const BillingContext = createContext<BillingContextType>(
  {} as BillingContextType
);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const {
    data: subscription,
    loading,
    error,
    execute,
  } = useAsync<Subscription>();

  useEffect(() => {
    if (user?.id) {
      execute(billingService.getSubscription(user.id));
    }
  }, [user, execute]);

  const value = {
    subscription,
    loading,
    error,
    createSubscription: async (plan: string) => {
      await execute(billingService.createSubscription(user!.id, plan));
    },
    cancelSubscription: billingService.cancelSubscription,
    updatePaymentMethod: billingService.updatePaymentMethod,
  };

  return (
    <ErrorBoundary>
      <BillingContext.Provider value={value}>
        {children}
      </BillingContext.Provider>
    </ErrorBoundary>
  );
};
