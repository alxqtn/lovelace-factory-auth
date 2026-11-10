import { ErreurHttp } from "../erreurs.js"
import jwt from "jsonwebtoken"

export function requireAuth(req, res, next) {
  const token = req.cookies.token
  if (!token) {
    throw new ErreurHttp(401, 'Connexion requise')
  }
  try {
    const contenu = jwt.verify(token, process.env.JWT_SECRET)
    req.utilisateur = { id: contenu.sub, role: contenu.role }
    next()
  } catch {
    throw new ErreurHttp(401, "Session expirée ou invalide")
  }
}

export const requireFormateurice = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    throw new ErreurHttp(401, 'Connexion requise')
  }
  try {
    const contenu = jwt.verify(token, process.env.JWT_SECRET)
    req.utilisateur = { id: contenu.sub, role: contenu.role }
  } catch {
    throw new ErreurHttp(401, "Session expirée ou invalide")
  }
  if (req.utilisateur.role !== "formateurice") {
    throw new ErreurHttp(403, "Pas autorisée")
  }
  next()
}
