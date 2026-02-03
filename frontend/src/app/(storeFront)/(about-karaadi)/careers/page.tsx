import React from "react";

function Careers() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Ku biir Kooxda Karaadi</h1>
        <p className="text-gray-600 mb-6">
          Kaalmee dhisa suuqa internetka ee ugu sareeya Soomaaliya. Waxaan
          raadinaynaa dadka karti leh ee xiiseeya technology-ga iyo inay
          saameeyaan dhaqaalaha Soomaaliya.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          Maxaad ka helaysaa Karaadi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Saamayn",
              desc: "Ka qayb qaado horumarinta digital-ka iyo dhaqaalaha Soomaaliya.",
            },
            {
              title: "Kobcitaan",
              desc: "Fursado badan oo kor u kaca shaqada ee koritaanka badan.",
            },
            {
              title: "Dhaqan",
              desc: "Hawl-wadaag, is-dhex-galka, iyo qiimayn creativity-ga iyo iskaashiga.",
            },
            {
              title: "Ujeeddo",
              desc: "Hawlo muhiim ah oo ku xidha iibiyeyaasha iyo iibsadayaasha Soomaaliya.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 border rounded">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { title: "Software Engineer", location: "Muqdisho" },
          { title: "Taageero Macaamiisha", location: "Hargeysa" },
          { title: "Maareeye Suuq-geynta", location: "Muqdisho" },
          { title: "Gudoomiye Iibka", location: "Magaalooyin" },
        ].map((job, i) => (
          <div key={i} className="bg-white p-4 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Careers;
