import Link from "next/link";
import AIChatPopup from "../chats/AI/page";

export default function Footer() {
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className="text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-gray-300">
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-blue-600">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:text-blue-600">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-600">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/marketplace" className="hover:text-blue-600">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/real-estate" className="hover:text-blue-600">
                Real Estate
              </Link>
            </li>
            <li>
              <Link href="/cars" className="hover:text-blue-600">
                Cars
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-blue-600">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-blue-600">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
        <AIChatPopup />
      </div>

      <div className="mx-auto w-full max-w-[59rem] px-6 py-8 mt-0 text-center text-sm text-gray-600">
        © 2025–{getCurrentYear()} <strong>Karaadi</strong>. All rights reserved.
      </div>
    </footer>
  );
}
