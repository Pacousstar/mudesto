/* ============================================================
   MUDESTO - Logique de la page publique
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.MUDESTO_DATA;
  const $ = (sel) => document.querySelector(sel);

  const MOIS = DATA.mois;
  const ANNEES = DATA.annees;
  const QR_SRC = "qrcode/mudesto-qr.png";

  /* ---------- Utilitaires ---------- */

  const initials = (m) => {
    const prenoms = (m.prenoms || "").split(/\s+/)[0] || "";
    return ((m.nom || "?").charAt(0) + prenoms.charAt(0)).toUpperCase();
  };

  const formatFCFA = (n) => n.toLocaleString("fr-FR") + " F";

  function avatar(m, cls) {
    if (m.photo) {
      return `<img src="${m.photo}" alt="${m.nom}" class="${cls}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${cls}',textContent:'${initials(m)}'}))">`;
    }
    return `<div class="${cls}">${initials(m)}</div>`;
  }

  const monthShort = (m) => m.slice(0, 3).toLowerCase();

  /* ---------- Rendu des listes ---------- */

  function memberGrid(list, kind) {
    const hints = {
      bureau: "Voir la carte de membre",
      adherents: "Voir la carte de cotisation",
      cotisants: "Voir les cotisations"
    };
    return list.map((m) => `
      <div class="member-card" data-id="${m.id}" data-kind="${kind}">
        ${avatar(m, "member-photo")}
        <div class="member-name">${m.nom} ${m.prenoms ? m.prenoms : ""}</div>
        ${kind === "bureau" ? `<div class="member-role">${m.poste}</div>` : `<div class="member-role">${m.categorie}</div>`}
        <div class="member-meta">${m.numCarte ? m.numCarte : ""}</div>
        <div class="member-hint">${hints[kind]}</div>
      </div>
    `).join("");
  }

  /* ---------- Cartes numériques ---------- */

  function carteMembreRecto(m) {
    if (m.carteMembreRecto) {
      return `<img src="${m.carteMembreRecto}" alt="Carte de membre recto" class="digital-card">`;
    }
    return `
    <div class="digital-card card-membre-recto">
      <div class="cm-head">
        <img src="assets/images/logo.png" class="cm-logo" alt="Logo MUDESTO">
        <span class="cm-type">CARTE DE MEMBRE</span>
      </div>
      <div class="cm-title">MUDESTO</div>
      <div class="cm-body">
        ${avatar(m, "cm-photo")}
        <div class="cm-info">
          <b>${m.nom} ${m.prenoms || ""}</b>
          <div>N° ${m.numCarte || "—"}</div>
          <div>Catégorie : ${m.categorie || "—"}</div>
        </div>
      </div>
      <div class="cm-foot">
        <span>Adhésion : ${m.dateAdhesion || "—"}</span>
        <span>${DATA.mutuelle.periodeCarte}</span>
      </div>
    </div>`;
  }

  function carteMembreVerso(m) {
    if (m.carteMembreVerso) {
      return `<img src="${m.carteMembreVerso}" alt="Carte de membre verso" class="digital-card">`;
    }
    return `
    <div class="digital-card card-membre-verso">
      <div>
        <div class="cv-row"><span>Nom et prénoms</span><b>${m.nom} ${m.prenoms || ""}</b></div>
        <div class="cv-row"><span>Numéro de carte</span><b>${m.numCarte || "—"}</b></div>
        <div class="cv-row"><span>Catégorie</span><b>${m.categorie || "—"}</b></div>
        <div class="cv-row"><span>Date d'adhésion</span><b>${m.dateAdhesion || "—"}</b></div>
        <div class="cv-row"><span>Contact</span><b>${m.contact || "—"}</b></div>
      </div>
      <div class="cv-qr">
        <img src="${QR_SRC}" alt="QR code MUDESTO">
        <span>Scannez pour plus d'informations</span>
      </div>
    </div>`;
  }

  function carteCotisationRecto(m) {
    if (m.carteCotisationRecto) {
      return `<img src="${m.carteCotisationRecto}" alt="Carte de cotisation recto" class="digital-card">`;
    }
    const montant = DATA.tarifs.cotisationMensuelle[m.categorie];
    return `
    <div class="digital-card card-cot-recto">
      <div class="cc-head">
        <h4>MUTUELLE POUR LE DÉVELOPPEMENT ET LA SOLIDARITÉ DE TOA-ZÉO</h4>
        <h3>CARTE DE COTISATION ${DATA.mutuelle.periodeCarte}</h3>
        <small>${DATA.mutuelle.nom}</small>
      </div>
      <div class="cc-body">
        ${avatar(m, "cc-photo")}
        <div class="cc-fields">
          <label>Nom : <b>${m.nom}</b></label>
          <label>Prénoms : <b>${m.prenoms || ""}</b></label>
          <label>Contact : <b>${m.contact || ""}</b></label>
          <label>Numéro de la carte : <b>${m.numCarte || ""}</b></label>
        </div>
      </div>
      <div class="cc-foot">
        <span>Catégorie : <b>${m.categorie || "—"}</b> (${montant ? formatFCFA(montant) + "/mois" : ""})</span>
        <span class="sign">Le Président</span>
      </div>
    </div>`;
  }

  function carteCotisationVerso(m) {
    if (m.carteCotisationVerso) {
      return `<img src="${m.carteCotisationVerso}" alt="Carte de cotisation verso" class="digital-card">`;
    }
    const cot = m.cotisations || {};
    const rows = MOIS.map((mois) => {
      const cells = ANNEES.map((annee) => {
        const paye = !!(cot[annee] && cot[annee][mois]);
        return paye ? '<td class="cv2-check">&#10003;</td>' : '<td class="cv2-empty">&middot;</td>';
      }).join("");
      return `<tr><td>${mois}</td>${cells}</tr>`;
    }).join("");
    const cols = ANNEES.map((a) => `<th>${a}</th>`).join("");
    const aJour = Object.values(cot).flatMap((y) => Object.values(y)).filter(Boolean).length;
    const montant = DATA.tarifs.cotisationMensuelle[m.categorie] || 0;
    const total = aJour * montant;
    const totalPrevu = montant * ANNEES.length * 12;
    const ABBR = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    const yearsRows = ANNEES.map((a) => {
      const payes = cot[a] ? Object.values(cot[a]).filter(Boolean).length : 0;
      const aJourAnnee = payes === 12;
      const moisPayes = cot[a] ? MOIS.filter((mois) => cot[a][mois]) : [];
      const moisTxt = moisPayes.length === 0 ? "—"
        : moisPayes.length === 12 ? "Janv → Déc"
        : moisPayes.map((mois) => ABBR[MOIS.indexOf(mois)] || mois).join(", ");
      return `
        <div class="cv2-year-cell${aJourAnnee ? " ok" : ""}">
          <div class="cv2-year">
            <span>${a}</span>
            <b>${payes}/12 mois</b>
            <span class="cv2-year-montant">${montant ? formatFCFA(payes * montant) : "—"}</span>
          </div>
          <div class="cv2-mois-payes">Mois payés : ${moisTxt}</div>
        </div>`;
    }).join("");
    return `
    <div class="digital-card card-cot-verso">
      <div class="cv2-head">COTISATION MENSUELLE &middot; ${m.nom} ${m.prenoms || ""} &middot; N° ${m.numCarte || "—"}</div>
      <div class="cv2-summary">
        <div>Catégorie : <b>${m.categorie || "—"}</b> &middot; Cotisation mensuelle : <b>${montant ? formatFCFA(montant) + "/mois" : "—"}</b></div>
        <div class="cv2-years">${yearsRows}</div>
        <div class="cv2-total-row">
          Total cotisé : <b class="cv2-total">${montant ? formatFCFA(total) : "—"}</b>
          ${montant ? `<span class="cv2-restant">Reste &agrave; cotiser : ${formatFCFA(Math.max(0, totalPrevu - total))}</span>` : ""}
        </div>
      </div>
      <table class="cv2-table">
        <tr><th>Mois</th>${cols}</tr>
        ${rows}
      </table>
      <div style="text-align:center;margin-top:6px;">
        <span class="cv2-stamp">Vu par la trésorière &middot; ${aJour} mois payé${aJour > 1 ? "s" : ""}</span>
      </div>
    </div>`;
  }

  /* ---------- Identité complète (fiche membre) ---------- */

  function identitePanel(m) {
    const rows = [
      ["Date de naissance", m.dateNaissance],
      ["Lieu de naissance", m.lieuNaissance],
      ["Profession", m.profession],
      ["Nom du père", m.pere],
      ["Nom de la mère", m.mere],
      ["Quartier", m.quartier],
      ["Résidence / domicile", m.residence],
      ["Contact", m.contact],
      ["Catégorie", m.categorie]
    ].filter(([, v]) => v);
    if (!rows.length) return "";
    return `
    <div class="identity-panel">
      <h4>Informations personnelles</h4>
      ${rows.map(([label, v]) => `<div class="id-row"><span>${label}</span><b>${v}</b></div>`).join("")}
    </div>`;
  }

  /* ---------- Modale ---------- */

  function openModal(html, title, wide) {
    $("#modal-content").innerHTML = `
      <h3 class="modal-title">${title}</h3>
      <div class="cards-stack">${html}</div>
      <p class="card-flip-hint">↑ Carte(s) officielle(s) du membre ↑</p>
    `;
    document.querySelector(".modal-box").classList.toggle("modal-wide", !!wide);
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
  }

  const renderers = {
    bureau: (m) => {
      openModal(
        carteMembreRecto(m) + carteMembreVerso(m) + identitePanel(m),
        `${m.poste} &mdash; ${m.nom} ${m.prenoms || ""}`
      );
    },
    adherents: (m) => {
      openModal(carteCotisationRecto(m) + identitePanel(m), `Carte de cotisation &mdash; ${m.nom} ${m.prenoms || ""}`);
    },
    cotisants: (m) => {
      openModal(carteCotisationVerso(m) + identitePanel(m), `Cotisations &mdash; ${m.nom} ${m.prenoms || ""}`, true);
    }
  };

  /* ---------- Initialisation ---------- */

  function init() {
    $("#header-periode").textContent = DATA.mutuelle.periodeCarte;
    $("#hero-devise").textContent = `« ${DATA.mutuelle.devise} »`;

    const c = DATA.mutuelle.contact || {};
    const contactItems = [
      c.adresse ? `<span class="contact-item">${c.adresse}</span>` : "",
      c.telephone ? `<span class="contact-item">T&eacute;l : ${c.telephone}</span>` : "",
      c.email ? `<span class="contact-item">Email : ${c.email}</span>` : "",
      c.facebook ? `<span class="contact-item">Facebook : ${c.facebook}</span>` : "",
      c.whatsapp ? `<span class="contact-item">WhatsApp : ${c.whatsapp}</span>` : ""
    ].filter(Boolean);
    $("#footer-contact").innerHTML = contactItems.join('<span class="contact-sep">&middot;</span>') || "Toa-Z&eacute;o";

    $("#grid-bureau").innerHTML = memberGrid(DATA.bureau, "bureau");
    $("#grid-adherents").innerHTML = memberGrid(DATA.adherents, "adherents");
    $("#grid-cotisants").innerHTML = memberGrid(DATA.cotisants, "cotisants");

    document.querySelectorAll(".member-card").forEach((card) => {
      card.addEventListener("click", () => {
        const kind = card.dataset.kind;
        const list = kind === "bureau" ? DATA.bureau : kind === "adherents" ? DATA.adherents : DATA.cotisants;
        const member = list.find((m) => m.id === card.dataset.id);
        if (member) renderers[kind](member);
      });
    });

    $("#modal-close").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => {
      if (e.target.id === "modal") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    /* Bouton remonter en haut : visible après 400px de scroll */
    const backToTop = $("#back-to-top");
    const onScroll = () => {
      backToTop.hidden = window.scrollY < 400;
    };
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
