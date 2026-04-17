"use client";
export const dynamic = "force-dynamic";
import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dejinta Asturnaanta</h1>

      <p className="mb-4">
        Xeerarka cusub ee asturnaanta waxay ku siinayaan xakameyn fiican oo ku
        saabsan xogtaada internetka iyo sida Karaadi iyo adeegyo kale u
        isticmaali karaan.
      </p>

      <section className="mb-6 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Dejinta Karaadi</h2>
        <p>
          Xogta aan ka aruurinay adiga waxaa loo isticmaalaa in lagu habeeyo
          khibradaada Karaadi ee bogga iyo app-ka. Dejintan waxay khusaysaa
          macluumaadka akoonkaaga.
        </p>
      </section>

      <section className="mb-6 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">
          Fariimaha iyo Cusboonaysiinta
        </h2>
        <p>
          Karaadi waxay kuu soo diri doontaa wargeysyo, talooyin safar, tartamo
          iyo xog kale oo ku saabsan adeegyada iyo alaabta aad xiisaynayso.
        </p>
      </section>

      <section className="mb-6 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">
          Macluumaadkaaga Gaarka ah
        </h2>
        <p>
          Xogtaada waxaa loo isticmaalaa in lagu tuso waxyaabaha aad
          xiisaynayso, laguugu soo bandhigo xayaysiisyo ku habboon, iyo inaad
          hesho macluumaad muhiim ah oo ku saabsan adeegyada Karaadi.
        </p>
      </section>

      <section className="mb-6 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">
          Xayeysiiska iyo Koontaroolka
        </h2>
        <p>
          Xogtaada waxaa loo isticmaalaa in lagu habeeyo xayeysiiska aad aragto.
          Waxaad dooran kartaa in xayeysiiska lagu habeeyo da&apos;da, jinsiga,
          danaha ama goobta aad ku sugan tahay.
        </p>
      </section>

      <section className="text-sm text-gray-500 mt-8">
        <p>
          © 1996–2025 Karaadi AS. Karaadi waa qayb ka mid ah Vend. Vend ayaa
          mas&rsquo;uul ka ah xogtaada boggan. Akhri wax badan.
        </p>
        <p>
          Suuqa Fursadaha, Ganacsi, Noqo Macaamiil, Macluumaad iyo dhiirrigelin,
          Adeegyada Karaadi, Hel caawinaad, Xeerarka isticmaalka.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
