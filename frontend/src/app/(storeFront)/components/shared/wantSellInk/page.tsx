"use client";

import Link from "next/link";
import React from "react";

function WantSell() {
  return (
    <Link href="/new-ad" className="block w-full">
      <span className="block w-full bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors text-center shadow-md">
        {`Wax miyaad iska gadee?`}
      </span>
    </Link>
  );
}

export default WantSell;
