# Razorpay Integration Setup

This application includes Razorpay payment integration for the subscription plans. Currently, it's running in **development mode** with simulated payments.

## Development Mode (Current)

The application is currently configured with placeholder credentials and will simulate payment flows:
- Order creation is mocked
- Payment verification is bypassed
- A confirmation dialog will appear instead of the real Razorpay checkout

## Production Setup

To enable real payments, you need to:

1. **Get Razorpay Credentials:**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Get your Test/Live API keys from the dashboard

2. **Update Environment Variables:**
   Replace the placeholder values in `.env.local`:
   ```env
   # Replace these with your actual Razorpay credentials
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
   RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_razorpay_secret_key
   ```

3. **Test Mode vs Live Mode:**
   - Test keys start with `rzp_test_`
   - Live keys start with `rzp_live_`
   - Always test thoroughly with test keys before switching to live

4. **Restart the Server:**
   After updating credentials, restart the development server to apply changes.

## Features Included

- ✅ Order creation
- ✅ Payment verification with signature validation
- ✅ Plan upgrade functionality
- ✅ Error handling and user feedback
- ✅ Development mode simulation
- ✅ INR pricing with proper formatting

## Security Notes

- Never commit real API keys to version control
- Keep your secret key secure and never expose it to the frontend
- The application includes proper signature verification for payment security