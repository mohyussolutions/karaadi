import React from "react";

function page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <footer
        style={{
          textAlign: "center",
          color: "#444",
          fontSize: "0.95rem",
          lineHeight: "1.8",
          maxWidth: "700px",
          padding: "2.5rem",
        }}
      >
        <h2 style={{ color: "#222", marginBottom: "1rem", fontSize: "1.2rem" }}>
          Data Protection & Privacy
        </h2>
        <p>
          Your privacy is our priority. This website utilizes cookies and local
          storage to personalize your browsing experience, analyze traffic
          patterns, and provide localized content. We never sell your personal
          data. Our systems are built with end-to-end encryption to ensure that
          every interaction you have with our services remains confidential and
          protected against unauthorized access.
        </p>

        <hr
          style={{
            margin: "2rem auto",
            width: "40%",
            border: "0",
            borderTop: "1px solid #ddd",
          }}
        />

        <h2 style={{ color: "#222", marginBottom: "1rem", fontSize: "1.2rem" }}>
          Ilaalinta Xogta & Sirta
        </h2>
        <p>
          Asturnaantaadu waa muhiimadayada koowaad. Websaydhkani wuxuu
          isticmaalaa cookies iyo kaydinta gudaha si uu u shakhsiyeeyo
          khibradaada, u falanqeeyo booqashooyinka, iyo inuu kuu soo gudbiyo
          macluumaad kugu habboon. Marna kama ganacsano xogtaada gaarka ah.
          Nidaamkayagu wuxuu ku dhisanyahay sir-qarin casri ah si loo xaqiijiyo
          in xogta aad nala wadaagto ay ahaato mid ammaan ah oo laga ilaaliyo
          cid kasta oo aan oggolaansho u lahayn.
        </p>
      </footer>
    </div>
  );
}

export default page;
