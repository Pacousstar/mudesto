/* ============================================================
   MUDESTO - Base de données des membres
   Fichier unique de données : modifiez-le directement,
   ou utilisez la page admin.html pour une édition facile.
   ============================================================ */

window.MUDESTO_DATA = {
  "mutuelle": {
    "nom": "MUDESTO",
    "nomComplet": "Mutuelle pour le Développement et la Solidarité de Toa-Zéo",
    "periodeCarte": "2026 - 2031",
    "devise": "Ensemble, pour le développement et l'entraide de Toa-Zéo",
    "contact": {
      "telephone": "",
      "email": "",
      "adresse": "Toa-Zéo",
      "facebook": "",
      "whatsapp": ""
    }
  },

  "tarifs": {
    "droitAdhesion": {
      "Diaspora": 20000,
      "Fonctionnaire": 10000,
      "Travailleur salarié": 10000,
      "Village": 2000,
      "Étudiant": 2000,
      "Personne âgée": 2000
    },
    "cotisationMensuelle": {
      "Diaspora": 10000,
      "Fonctionnaire": 5000,
      "Travailleur salarié": 5000,
      "Village": 500,
      "Étudiant": 500,
      "Personne âgée": 500
    }
  },

  "annees": ["2026", "2027", "2028", "2029", "2030", "2031"],
  "mois": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],

  /* ----------------------------------------------------------
     BUREAU EXÉCUTIF - cliquez sur la photo : carte de membre
     recto/verso du membre
     ---------------------------------------------------------- */
  "bureau": [
    {
      "id": "b1",
      "nom": "VICTOR",
      "prenoms": "Jean",
      "poste": "Président",
      "contact": "",
      "categorie": "Fonctionnaire",
      "numCarte": "MUD-2026-001",
      "dateAdhesion": "29/07/2020",
      "photo": null
    }
  ],

  /* ----------------------------------------------------------
     MEMBRES À JOUR DU DROIT D'ADHÉSION - cliquez sur la photo :
     carte de cotisation recto du membre
     ---------------------------------------------------------- */
  "adherents": [
    {
      "id": "a1",
      "nom": "EXEMPLE",
      "prenoms": "Membre à remplacer",
      "contact": "",
      "categorie": "Village",
      "numCarte": "MUD-2026-002",
      "dateAdhesion": "01/01/2026",
      "photo": null
    }
  ],

  /* ----------------------------------------------------------
     MEMBRES À JOUR DE COTISATION - cliquez sur la photo :
     tableau des cotisations (case cochée = payé, visée par
     la trésorière)
     ---------------------------------------------------------- */
  "cotisants": [
    {
      "id": "c1",
      "nom": "VICTOR",
      "prenoms": "Jean",
      "contact": "",
      "categorie": "Fonctionnaire",
      "numCarte": "MUD-2026-001",
      "photo": null,
      "cotisations": {
        "2026": { "Janvier": true, "Février": true }
      }
    },
    {
      "id": "c2",
      "nom": "EXEMPLE",
      "prenoms": "Membre à remplacer",
      "contact": "",
      "categorie": "Village",
      "numCarte": "MUD-2026-002",
      "photo": null,
      "cotisations": {
        "2026": { "Janvier": true, "Février": false }
      }
    }
  ]
};


