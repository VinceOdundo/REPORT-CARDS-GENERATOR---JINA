
import axios from 'axios';
import { getEnvironmentVariables } from '../../config/environment';

const env = getEnvironmentVariables();

export const initializeMpesa = async ({
  phoneNumber,
  amount,
  accountReference,
  transactionDesc
}: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}) => {
  const auth = Buffer.from(
    `${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const accessToken = await getMpesaAccessToken(auth);

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(
    `${env.MPESA_BUSINESS_SHORT_CODE}${env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: env.MPESA_BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: env.MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${env.API_URL}/api/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return response.data;
};