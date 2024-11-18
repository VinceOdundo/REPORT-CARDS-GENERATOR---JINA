import axios from "axios";
import { PAYMENT_CONFIG } from "../../config/payments";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

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

  async initiateLemonSqueezyPayment(userId: string, planVariantId: string) {
    try {
      const response = await axios.post("/api/lemon-squeezy/create-checkout", {
        variantId: planVariantId,
        userId,
        custom_data: {
          userId,
        },
      });

      return response.data.checkoutUrl;
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
