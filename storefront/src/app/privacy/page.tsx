import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CarTunez",
  description: "Privacy policy for CarTunez customers.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-12 uppercase tracking-tight text-center">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        
        <div className="bg-surface/30 border border-border p-8 md:p-12 rounded-3xl shadow-xl space-y-8">
          <div className="text-gray-400 italic border-b border-border pb-6">
            Last Updated: March 16, 2026
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes your name, email, phone number, shipping address, and vehicle details (to ensure part compatibility).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use your information to process orders, provide customer support, and personalize your experience (such as showing products specific to your vehicle). We may also send you updates about your order or our latest collections.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">3. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal data. Payment information is processed through secure, encrypted gateways and is never stored on our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">4. Sharing with Partners</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell your personal data. We only share information with third-party service providers (like shipping companies and payment processors) as strictly necessary to fulfill your orders.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">5. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.
            </p>
          </section>

          <div className="pt-10 border-t border-border mt-10 text-center text-sm text-gray-500">
            If you have questions about this policy, please contact us at <span className="text-white font-bold">privacy@cartunez.in</span>
          </div>
        </div>
      </div>
    </main>
  );
}
