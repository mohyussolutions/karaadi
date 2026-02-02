import React from "react";

function About() {
  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-xl border border-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        Nagu saabsan (About Us)
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center">
        **Goobta ugu fiican ee wax lagu iibiyo lagana iibsado Soomaaliya!**
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Himiladayada (Our Mission)
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Ujeeddadayadu waa inaan fududeyno ganacsiga iyo isgaarsiinta u
          dhaxaysa dadweynaha iyo ganacsatada Soomaaliyeed. Waxaan bixinnaa goob
          suuq ah oo lagu kalsoonaan karo oo aad ka heli karto wax walba laga
          bilaabo guryaha, baabuurta, mootooyinka, ilaa shaqooyinka iyo
          adeegyada.
          <br />
          <br />
          Waxaan ballan qaadeynaa hufnaan, sahlaneyn, iyo ammaanka dhammaan
          macaamilada.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Maxaad Ka Heli Kartaa (What You Can Find)
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 pl-4">
          <li>
            **Guryaha iyo Dhulka (Real Estate):** Iibso, iibi ama kireey guri,
            dhul, ama xafiis.
          </li>
          <li>
            **Baabuurta & Gaadiidka (Vehicles):** Baabuurta, mootooyinka,
            doonyaha, iyo qalabka kale ee gaadiidka.
          </li>
          <li>
            **Suuqa Guud (Marketplace):** Elektaroonig, alaab guri, dharka, iyo
            waxyaabo kale oo badan.
          </li>
          <li>
            **Shaqooyinka (Jobs):** Raadi fursado shaqo oo cusub ama soo
            xayeysii shaqaale aad u baahan tahay.
          </li>
          <li>
            **Adeegyada (Services):** Hel ama bixi adeegyo kala duwan sida
            dhismaha, hagaajinta, iyo la-talinta.
          </li>
        </ul>
      </div>

      {/* --- Contact Section --- */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
          Nala Soo Xiriir (Contact Us)
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Ma qabtaa su'aal, talo, ama wax cabasho ah? Fadlan nala soo xiriir.
          Waxaan had iyo jeer diyaar u nahay inaan ku caawinno.
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-gray-700">
            **E-mail:**{" "}
            <a href="karaadi@" className="text-blue-600 hover:underline">
              info@yourdomain.so
            </a>
          </p>
          <p className="text-gray-700">
            **Taleefan:**{" "}
            <a
              href="tel:+25261xxxxxxx"
              className="text-blue-600 hover:underline"
            >
              +252 61 XXX XXXX
            </a>{" "}
            (Fadlan ku beddel lambarka saxda ah)
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
