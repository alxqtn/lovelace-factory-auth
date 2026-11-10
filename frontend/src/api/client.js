export async function appeler(chemin, options = {}) {
  const res = await fetch(`/api${chemin}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const donnees = await res.json().catch(() => ({}));
  if (!res.ok) {
    const erreur = new Error(donnees.message ?? 'Erreur inattendue');
    erreur.status = res.status;
    erreur.erreurs = donnees.erreurs ?? {};
    throw erreur;
  }
  return donnees;
}
