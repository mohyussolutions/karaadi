import React from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaComment,
  FaPhone,
  FaQuestionCircle,
  FaShoppingCart,
  FaDollarSign,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

function Help() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="text-center mb-12 sm:mb-20">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Caawimaad Karaadi
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Noo soo dir fariin, waxaan halkanoo joognaa 24/7 si aan ku caawino
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
        <div className="bg-white p-6 sm:p-8 border-2 border-blue-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <FaEnvelope className="text-xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                Email
              </h2>
              <p className="text-gray-600 text-sm">Noo soo dir email</p>
            </div>
          </div>
          <a
            href="mailto:help@karaadi.so"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaEnvelope className="mr-2" />
            help@karaadi.so
          </a>
        </div>

        <div className="bg-white p-6 sm:p-8 border-2 border-green-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <FaComment className="text-xl text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                Fariin Toos ah
              </h2>
              <p className="text-gray-600 text-sm">
                Noo soo dir fariin toos ah
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaComment className="mr-2" />
            Dir Fariin Toos ah
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-8 border-2 border-green-100 rounded-2xl shadow-xl">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <FaWhatsapp className="text-xl text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                WhatsApp
              </h2>
              <p className="text-gray-600 text-sm">Nala hadal WhatsApp</p>
            </div>
          </div>
          <a
            href="https://wa.me/252611234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-medium text-base w-full text-center shadow-md"
          >
            <FaWhatsapp className="mr-2" />
            Nala hadal WhatsApp
          </a>
        </div>
      </div>

      <div className="mb-16 sm:mb-24">
        <h2 className="text-2xl sm:text-3xl font-medium mb-8 sm:mb-12 text-center text-gray-800">
          Su'aalaha Badanaa La Is Weydiiyo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaShoppingCart className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                Sidee baan ku iibiyaa alaabta?
              </h3>
            </div>
            <p className="text-gray-600">
              Diiwaan gal akoon cusub ama geli akoonkaaga, guji 'Ku iibiy' oo
              raac tilmaamaha.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaQuestionCircle className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                Sidee baan soo dejin karaa alaab?
              </h3>
            </div>
            <p className="text-gray-600">
              Login garee akoonkaaga, guji 'Soo deji alaab' oo buuxi
              macluumaadka alaabta.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaDollarSign className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                Muxuu yahay qiimaha isticmaalka?
              </h3>
            </div>
            <p className="text-gray-600">
              Soo dejinta alaabta waa bilaash, kaliya waxaa jira kirayso yar
              marka alaabta lagu iibiyo.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <FaTruck className="text-xl text-blue-500 mr-3" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                Sidee baan helaa alaabtayda?
              </h3>
            </div>
            <p className="text-gray-600">
              Alaabta aad iibisay waxaa laguu keeni doonaa goobta aad dooratay
              ama aad noo sheegtay.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-8 sm:p-12 text-white">
        <div className="text-center">
          <div className="inline-block bg-white p-4 rounded-full mb-5 shadow-lg">
            <FaPhone className="text-3xl text-blue-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium mb-4">
            Caawimaad Degdeg ah
          </h2>
          <p className="text-lg mb-5 opacity-90">
            Haddii aad u baahan tahay caawimaad degdeg ah ama aad heshay
            dhibaato
          </p>
          <div className="inline-flex items-center bg-white text-blue-500 px-6 py-3 rounded-xl mb-4">
            <FaPhone className="mr-2 text-xl" />
            <span className="text-2xl sm:text-3xl font-medium">
              +252 61 123 4567
            </span>
          </div>
          <p className="text-gray-200">9:00 AM - 12:00 AM, Maalinta kasta</p>
        </div>
      </div>

      <div className="mt-12 sm:mt-20 text-center">
        <p className="text-gray-500">
          Karaadi SmartSuuq - Suuqa internetka ee ugu horreeya ee Soomaaliya
        </p>
      </div>
    </div>
  );
}

export default Help;
