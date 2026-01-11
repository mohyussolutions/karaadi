"use client";
import { SUPPORT_LINKS } from "@/app/(links)/supportLinks/supportLinks";
import { useRouter } from "next/navigation";

export default function SupportSidebar() {
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-8 border-r border-gray-200 z-20">
      <div className="text-3xl font-extrabold mb-12 tracking-tight text-gray-900">
        Support Panel
      </div>

      <nav className="flex flex-col gap-6 text-gray-700 text-lg">
        {SUPPORT_LINKS.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition-all text-left font-medium"
          >
            <span className="text-gray-500">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
