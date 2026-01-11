"use client";

import React from "react";
import Link from "next/link";

function XiriirradaTalooyinka() {
  return (
    <Link
      prefetch={false}
      href="/components/Recommendations"
      className="block text-indigo-600 hover:text-indigo-800 font-semibold mb-4 transition duration-150"
    >
      <div className="p-2 mr-6 border-b border-indigo-100">
        Xiriirrada Talooyinka (Riix si aad ugu gudubto)
      </div>
    </Link>
  );
}

export default XiriirradaTalooyinka;
