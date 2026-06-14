'use client'

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h1 className="mb-6 text-2xl font-bold text-white">Privacy Policy</h1>

        <section className="mb-6 space-y-4 text-gray-300">
          <h2 className="text-lg font-semibold text-white">Information Collection</h2>
          <p>
            OranAnaliz collects minimal personal information necessary to provide our services. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account information (username, email address)</li>
            <li>Usage data (pages visited, features used)</li>
            <li>Payment information (processed securely through Stripe)</li>
          </ul>
        </section>

        <section className="mb-6 space-y-4 text-gray-300">
          <h2 className="text-lg font-semibold text-white">Data Usage</h2>
          <p>
            Your data is used exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Providing and improving our match analysis services</li>
            <li>Personalizing your experience</li>
            <li>Processing payments and subscriptions</li>
            <li>Sending service-related notifications</li>
          </ul>
        </section>

        <section className="mb-6 space-y-4 text-gray-300">
          <h2 className="text-lg font-semibold text-white">Data Protection</h2>
          <p>
            We implement industry-standard security measures including encryption, secure servers, 
            and regular security audits to protect your personal information.
          </p>
        </section>

        <section className="mb-6 space-y-4 text-gray-300">
          <h2 className="text-lg font-semibold text-white">Third-Party Services</h2>
          <p>
            We use Stripe for payment processing. Your payment details are handled entirely by Stripe 
            and are never stored on our servers.
          </p>
        </section>

        <section className="space-y-4 text-gray-300">
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <p>
            For privacy-related inquiries, please contact us at support@orananaliz.com.
          </p>
        </section>
      </div>
    </div>
  )
}
