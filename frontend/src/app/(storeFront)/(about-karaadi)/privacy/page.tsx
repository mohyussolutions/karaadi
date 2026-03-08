import React from "react";

function Privacy() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#444",
          fontSize: "1rem",
          lineHeight: "1.8",
          maxWidth: "800px",
        }}
      >
        <h1 style={{ color: "#222", marginBottom: "1.5rem" }}>
          Nidaamka Sirta iyo Ilaalinta Xogta ee Karaadi
        </h1>

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>Ururinta Xogta</h2>
          <p>
            Karaadi waxay u ururisaa macluumaadka si ay u bixiso adeegyo tayo
            leh oo ku habboon dhammaan isticmaalayaashayada. Tan waxaa ku jira
            macluumaadka aad na siiso si toos ah, sida magacaaga, taleefankaaga,
            iyo ciwaanka iimaylka, iyo sidoo kale xogta si otomaatig ah loogu
            ururiyo marka aad isticmaalayso boggayaga. Waxaan isticmaalnaa habab
            ammaan oo aad u sarreeya si aan u hubinno in xogtaada marna si
            khaldan aan loo isticmaalin.
          </p>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
            Sida aan u Isticmaalno Xogta
          </h2>
          <p>
            Macluumaadka aan ururinno waxaa loo isticmaalaa in lagu horumariyo
            adeegyada Karaadi, in lagula soo xiriiro marka ay lagama maarmaan
            tahay, iyo in lagu xaqiijiyo ammaanka akoonkaaga. Marna kama
            ganacsano xogtaada gaarka ah, lamana wadaagno dhinacyo saddexaad oo
            aan oggolaansho u lahayn, marka laga reebo xaaladaha sharcigu
            dalbanayo si loo ilaaliyo badqabka bulshada.
          </p>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>
            Xuquuqdaada iyo Sirtaada
          </h2>
          <p>
            Waxaad xaq u leedahay inaad gasho, cusboonaysiiso, ama tirtirto
            macluumaadkaaga gaarka ah wakhti kasta oo aad rabto. Karaadi waxay
            ka go'an tahay hufnaan buuxda oo ku saabsan sida xogtaada loo
            tacaalo. Haddii aad qabto wax su'aalo ah oo ku saabsan xuquuqdaada
            ama habka aan u maarayno sirtaada, fadlan si degdeg ah ula xiriir
            kooxdayada adeegga macaamiisha.
          </p>
        </section>

        <hr
          style={{
            margin: "2rem auto",
            width: "30%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <section>
          <h2 style={{ color: "#333", fontSize: "1.3rem" }}>Ammaanka Xogta</h2>
          <p>
            Nidaamka Karaadi wuxuu ku dhisanyahay tignoolajiyad casri ah oo
            loogu talagalay in looga hortago jabsiga iyo gelitaanka aan la
            oggolayn. Waxaan si joogto ah u cusboonaysiinaa nidaamkayaga
            ammaanka si aan u ilaalino kalsoonida aad nagu qabto iyo xogta aad
            noo dhiibatay.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
