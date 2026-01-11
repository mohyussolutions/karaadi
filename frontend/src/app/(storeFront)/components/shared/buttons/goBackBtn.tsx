import React from "react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

function GoBackBtn() {
  return (
    <Link
      href="/"
      className="inline-flex items-center bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
    >
      <IoIosArrowBack className="mr-2 w-5 h-5" />
      Tilbake
    </Link>
  );
}

export default GoBackBtn;
