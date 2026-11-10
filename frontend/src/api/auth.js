import { appeler } from "./client.js"

export const inscrire = (infos) =>
  appeler('/auth/inscription', { method: 'POST', body: JSON.stringify(infos) });

export const connecter = (identifiants) =>
  appeler('/auth/connexion', { method: 'POST', body: JSON.stringify(identifiants) });

export const deconnecter = () => appeler('/auth/deconnexion', { method: 'POST' });

export const recupererMoi = () => appeler('/auth/moi');
