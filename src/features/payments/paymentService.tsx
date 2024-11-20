import axios from "axios";
import { PAYMENT_CONFIG } from "../../config/payments";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { APP_CONSTANTS } from "../../utils/constants";
import { createLemonSqueezyCheckout } from "../../api/services/lemonSqueezyService";

export class PaymentService {
  private readonly COLLECTION = "subscriptions";

  async initiateMpesaPayment(
    userId: string,
    amount: number,
    phoneNumber: string,
    plan: string
  ) {
    try {
      const response = await axios.post("/api/mpesa/stkPush", {
        phoneNumber,
        amount,
        tillNumber: PAYMENT_CONFIG.MPESA.TILL_NUMBER,
        accountReference: userId,
        transactionDesc: `SchoolReports ${plan} Plan`,
      });

      return response.data;
    } catch (error) {
      throw new Error("Failed to initiate M-Pesa payment");
    }
  }

  async initiateLemonSqueezyPayment(userId: string, plan: string) {
    try {
      const variantId =
        plan === "premium"
          ? APP_CONSTANTS.LEMON_SQUEEZY_VARIANTS.PREMIUM
          : APP_CONSTANTS.LEMON_SQUEEZY_VARIANTS.BASIC;

      const checkoutUrl = await createLemonSqueezyCheckout(variantId, userId);
      return checkoutUrl;
    } catch (error) {
      throw new Error("Failed to create Lemon Squeezy checkout");
    }
  }

  async verifyPayment(checkoutId: string) {
    try {
      const response = await axios.get(
        `/api/lemon-squeezy/verify/${checkoutId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to verify payment");
    }
  }
}

export const paymentService = new PaymentService();
