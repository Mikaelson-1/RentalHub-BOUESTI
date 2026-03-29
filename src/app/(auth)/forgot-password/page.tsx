import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#192F59]">Forgot Password</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Password reset is not available yet. Please contact support to recover your account.
        </p>

        <a href="mailto:support@rentalhub.ng" className="inline-block mt-6 text-[#E67E22] hover:underline">
          support@rentalhub.ng
        </a>

        <div className="mt-8">
          <Link href="/login" className="text-sm text-gray-700 hover:text-[#E67E22]">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
