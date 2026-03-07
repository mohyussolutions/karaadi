import { FaFacebookF, FaTiktok, FaLinkedinIn } from "react-icons/fa";

export default function SubFooter() {
  return (
    <div className="text-gray-700 text-sm border-t border-b border-gray-300 bg-white">
      <div className="mx-auto w-full max-w-[59rem] px-6 py-8 mt-0 text-center space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center space-x-6 text-xl text-gray-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-black"
            >
              <FaTiktok />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-700"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Waxaa idinka codsanaa ilaalinaya xuquuqda daabacaadda. Lama qaybin
            karo ogolaansho la'aan <strong>Karaadi</strong>.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Waxaa horumariyay{" "}
            <a
              href="https://www.mohyus.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Mohyus
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
