import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | CarTunez",
  description: "Terms and conditions for shopping at CarTunez.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using CarTunez, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services or website."
    },
    {
      title: "2. Product Information",
      content: "We strive to display our products as accurately as possible. However, colors, textures, and details may appear differently on different screens. CarTunez does not warrant that product descriptions or other content are error-free. Compatibility data is provided based on manufacturer information and should be verified before installation."
    },
    {
      title: "3. Pricing and Payments",
      content: "All prices are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices without notice. Payments must be made via our secure payment gateway at the time of purchase."
    },
    {
      title: "4. Shipping and Returns",
      content: "Shipping times are estimates. We are not responsible for delays caused by logistics partners. Returns are accepted within 7 days of delivery for defective or incorrect items only. Items must be in original, uninstalled condition with all packaging intact."
    },
    {
      title: "5. Installation",
      content: "Professional installation is strongly recommended for all electronic and mechanical accessories. CarTunez is not liable for damages caused by improper installation or misuse of products."
    },
    {
      title: "6. Limitation of Liability",
      content: "CarTunez shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or website."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-12 uppercase tracking-tight text-center">
          Terms <span className="text-primary">&</span> Conditions
        </h1>
        
        <div className="bg-surface/30 border border-border p-8 md:p-12 rounded-3xl shadow-xl space-y-12">
          <div className="text-gray-400 leading-relaxed italic border-b border-border pb-8">
            Last Updated: March 16, 2026
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-widest text-primary italic">
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-border mt-12 text-center text-sm text-gray-500">
            © 2026 CarTunez. All Rights Reserved.
          </div>
        </div>
      </div>
    </main>
  );
}
