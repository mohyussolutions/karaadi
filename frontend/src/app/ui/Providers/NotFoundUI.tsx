import Link from "next/link";
import { FaRegFrown } from "react-icons/fa";

export default function NotFoundUI() {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen text-center bg-gray-50">
      <FaRegFrown size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The content you were looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
      >
        Go to Homepage
      </Link>
    </div>
  );
}
