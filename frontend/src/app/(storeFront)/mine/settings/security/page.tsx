"use client";
import React, { useState } from "react";

const Security: React.FC = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    authApp: false,
    sms: false,
  });

  const handleToggle = (type: "authApp" | "sms") => {
    setTwoFactorAuth((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Amniga</h1>
      <p className="mb-6">
        Ma ogtahay inaad ka sii adkeyn karto akoonkaaga? Boggan waxaad ka heli
        doontaa tallaabooyinka amniga ee kaa caawinaya inaad ku raaxaysato FINN
        si aamin ah.
      </p>

      {/* Two-step Authentication */}
      <section className="mb-8 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Laba-Tallaabo Hubin</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-1">App-ka Hubinta</h3>
          <p>Waxaad ka heli doontaa koodh ka yimaada app-ka amnigaaga</p>
          <p>
            Status:{" "}
            {twoFactorAuth.authApp ? "La hawlgaliyay" : "Lama hawlgalin"}
          </p>
          <button
            onClick={() => handleToggle("authApp")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition mt-1"
          >
            {twoFactorAuth.authApp ? "Demi" : "Hawlgali"}
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Koodh SMS</h3>
          <p>Waxaan u diraynaa koodh lambarkaaga telefoonka</p>
          <p>
            Status: {twoFactorAuth.sms ? "La hawlgaliyay" : "Lama hawlgalin"}
          </p>
          <button
            onClick={() => handleToggle("sms")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition mt-1"
          >
            {twoFactorAuth.sms ? "Demi" : "Hawlgali"}
          </button>
        </div>
      </section>

      {/* Devices */}
      <section className="mb-8 border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Qalabka aad ku gashay</h2>
        <ul className="space-y-4">
          <li>
            <strong>Mac OS 10.15.7</strong> - Chrome - Hadda firfircoon{" "}
            <button className="text-red-600 underline ml-2">Ka bax</button>
          </li>
          <li>
            <strong>iOS 18.5</strong> - Mobile Safari - 12.09.2025{" "}
            <button className="text-red-600 underline ml-2">Ka bax</button>
          </li>
          <li>
            <strong>iOS</strong> - App - 09.09.2025{" "}
            <button className="text-red-600 underline ml-2">Ka bax</button>
          </li>
        </ul>
      </section>

      {/* Footer / Information */}
      <section className="text-sm text-gray-500">
        <p>Suuqa Fursadaha, Ganacsi, Noqo Macaamiil...</p>
        <p>
          © 1996–2025 FINN.no AS. FINN.no waa qayb ka mid ah Vend. Vend ayaa
          mas'uul ka ah xogtaada boggan. Akhri wax badan.
        </p>
      </section>
    </div>
  );
};

export default Security;
