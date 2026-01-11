import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

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
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-600"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div>
          <p>
            The content is protected under copyright law. Regular, systematic,
            or continuous collection, storage, indexing, distribution, or any
            other form of data compilation is not allowed without explicit
            written permission from <strong>Karaadi</strong>.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Developed by{" "}
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
