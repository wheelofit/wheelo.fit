import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
  RefundRequest,
} from "@phonepe-pg/pg-sdk-node";

const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_CLIENT_VERSION = parseInt(
  process.env.PHONEPE_CLIENT_VERSION || "1",
  10,
);
const IS_PROD = process.env.PHONEPE_ENV?.trim() === "PROD";

export const phonepeEnv = IS_PROD ? Env.PRODUCTION : Env.SANDBOX;

// Singleton client
let _client: StandardCheckoutClient | null = null;
export function getPhonePeClient(): StandardCheckoutClient {
  if (!_client) {
    _client = StandardCheckoutClient.getInstance(
      PHONEPE_CLIENT_ID,
      PHONEPE_CLIENT_SECRET,
      PHONEPE_CLIENT_VERSION,
      phonepeEnv,
    );
  }
  return _client;
}

/**
 * Initiates a PhonePe Standard Checkout payment.
 * @returns redirectUrl - the PhonePe hosted payment page URL
 */
export async function initiatePhonePePayment(
  merchantOrderId: string,
  amountInPaise: number,
  redirectUrl: string,
): Promise<{ redirectUrl: string }> {
  const client = getPhonePeClient();

  const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(merchantOrderId)
    .amount(amountInPaise)
    .redirectUrl(redirectUrl)
    .build();

  const response = await client.pay(request);

  if (!response.redirectUrl) {
    throw new Error("PhonePe did not return a redirect URL");
  }

  return { redirectUrl: response.redirectUrl };
}

/**
 * Verifies payment status server-side using the PhonePe SDK.
 * Always verify via SDK — never trust client-side callback codes alone.
 */
export async function verifyPhonePePayment(merchantOrderId: string): Promise<{
  success: boolean;
  state: string;
  amount: number;
}> {
  const client = getPhonePeClient();
  const response = await client.getOrderStatus(merchantOrderId);

  return {
    success: response.state === "COMPLETED",
    state: response.state,
    amount: response.amount,
  };
}

/**
 * Initiates a refund for a previously successful PhonePe payment.
 */
export async function refundPhonePePayment(
  merchantOrderId: string,
  amountInPaise: number,
): Promise<{ success: boolean; state?: string; error?: string }> {
  try {
    const client = getPhonePeClient();

    // We must generate a unique merchantRefundId for this refund request
    const refundOrderId = `RFND_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Note: In PhonePe Node SDK V2, originalMerchantOrderId refers to our original transactionId.
    const request = RefundRequest.builder()
      .merchantRefundId(refundOrderId)
      .originalMerchantOrderId(merchantOrderId)
      .amount(amountInPaise)
      .build();

    const response = await client.refund(request);

    return {
      success: response.state === "COMPLETED" || response.state === "PENDING", // PENDING is fine as refunds can take time
      state: response.state,
    };
  } catch (error: unknown) {
    console.error("PhonePe Refund Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Refund failed";
    return { success: false, error: errorMessage };
  }
}
