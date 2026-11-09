import { Router } from 'express';
import { connexion, inscription, moi, deconnexion } from '../controllers/auth.js';
import { requireAuth } from '../middlewares/auth.js';

// Les routes d'authentification arrivent au chapitre 10
export const authRouter = Router();

authRouter.post("/inscription", inscription)
authRouter.post("/connexion", connexion)
authRouter.get("/moi", requireAuth, moi)
authRouter.post("/deconnexion", requireAuth, deconnexion)
