/* ============================================================
   MUDESTO - Fusion 3-voies des données (utilisée par admin.html)
   base : version chargée au démarrage de la page
   sess : version actuellement dans la page (avec vos modifications)
   rem  : version la plus récente sur GitHub (MAJ faites ailleurs)
   ============================================================ */
(function (global) {
  "use strict";

  const isObj = (v) => v !== null && typeof v === "object";
  const same = (a, b) => (a === b) || (isObj(a) && isObj(b) && JSON.stringify(a) === JSON.stringify(b));

  /* Fusion récursive champ par champ */
  function merge3(base, sess, rem) {
    if (same(sess, base)) return rem !== undefined ? rem : sess;
    if (!isObj(base) || !isObj(sess)) return sess;
    if (Array.isArray(base) && Array.isArray(sess)) return mergeArray(base, sess, Array.isArray(rem) ? rem : null);
    const keys = new Set([...Object.keys(base), ...Object.keys(sess), ...(isObj(rem) ? Object.keys(rem) : [])]);
    const out = {};
    for (const k of keys) {
      out[k] = merge3(base[k], sess[k], isObj(rem) ? rem[k] : undefined);
    }
    return out;
  }

  /* Fusion des listes de membres (par id) */
  function mergeArray(base, sess, rem) {
    const baseById = new Map(base.map((x) => [x.id, x]));
    const sessById = new Map(sess.map((x) => [x.id, x]));
    const remById = new Map((rem || []).map((x) => [x.id, x]));
    const out = [];
    for (const [id, s] of sessById) {
      const b = baseById.get(id);
      const r = remById.get(id);
      if (!b) out.push(s);                    // ajouté par l'utilisateur → conservé
      else if (r) out.push(merge3(b, s, r));  // présent partout → fusion champ par champ
      else if (!same(b, s)) out.push(s);      // supprimé en ligne mais modifié ici → conservé
    }
    for (const [id, r] of remById) {
      if (!baseById.has(id) && !sessById.has(id)) out.push(r); // ajouté en ligne → conservé
    }
    return out;
  }

  function mergeData(base, sess, rem) {
    if (!base) return sess;
    if (!rem) return sess;
    return {
      mutuelle: merge3(base.mutuelle || {}, sess.mutuelle || {}, rem.mutuelle || {}),
      tarifs: merge3(base.tarifs || {}, sess.tarifs || {}, rem.tarifs || {}),
      annees: rem.annees || sess.annees || [],
      mois: rem.mois || sess.mois || [],
      bureau: mergeArray(base.bureau || [], sess.bureau || [], rem.bureau || []),
      adherents: mergeArray(base.adherents || [], sess.adherents || [], rem.adherents || []),
      cotisants: mergeArray(base.cotisants || [], sess.cotisants || [], rem.cotisants || [])
    };
  }

  global.MUDESTO_MERGE = { merge3, mergeArray, mergeData };
  if (typeof module !== "undefined" && module.exports) module.exports = { merge3, mergeArray, mergeData };
})(typeof window !== "undefined" ? window : globalThis);
