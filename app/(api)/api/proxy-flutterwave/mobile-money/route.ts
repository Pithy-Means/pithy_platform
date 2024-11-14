import env from "@/env";

const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(
  env.payment.public, env.payment.secret
);

export async function POST(req: Request) {
  const data = await req.json();

  const { amount, currency, tx_ref, email, phone_number, network } = data;

  try {
    const payload = {
      amount, currency, tx_ref, email, phone_number, network
    };

    console.log('Payload data: ', payload);

    const response = await flw.MobileMoney.uganda(payload);

    console.log('Response data: ', response);

    if (response.status === 'success') {
      const redirectLink = response.meta?.authorization?.redirect;

      if ( redirectLink ) {
        return {
          status: 200,
          body: {
            status: 'success',
            message: 'Payment initiated successfully',
            data: {
              redirect: redirectLink
            }
          }
        }
      } else {
        return {
          status: 400,
          body: {
            status: 'error',
            message: 'Payment initiation failed',
            data: response
          }
        }
      }
    }
  } catch (error) {
    console.log('Error: ', error);
    return {
      status: 400,
      body: {
        status: 'error',
        message: 'Payment initiation failed',
        data: error
      }
    }
  }
}