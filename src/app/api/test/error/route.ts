/**
 * Test Error Endpoint
 * Used to test Sentry error tracking
 *
 * DELETE THIS FILE after testing Sentry
 */

export async function GET() {
  // Throw an intentional error to test Sentry capture
  throw new Error("Test error from RentalHub - Sentry is working!");
}
