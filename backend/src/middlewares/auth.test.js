import { describe, it, expect } from "vitest";
import request from "supertest"
import { app } from "../app";
import { requireFormateurice } from "./auth";
import { gestionErreurs } from "./erreurs";
import jwt from "jsonwebtoken"

// Tous les cas d'usage
// connectée en tant qu'utilisateur apprenant (403)
// connectée en tant que formateurice
// pas connecté (401)
// - pas de cookie token
// - token invalide
// - token expiré

app.get("/auth/require-formateurice", requireFormateurice, (req, res) => {
  res.send({ ok: true })
})
app.use(gestionErreurs)

describe("requireFormateurice", () => {
  it("refuse les utilisateurs sans token", async () => {
    const res = await request(app)
      .get("/auth/require-formateurice")
      .expect(401)

    expect(res.body.message).toBe("Connexion requise")
  })

  it("refuse les utilisateurs avec token invalide", async () => {
    const res = await request(app)
      .get("/auth/require-formateurice")
      .set("Cookie", "token=fskgwfc")
      .expect(401)

    expect(res.body.message).toBe("Session expirée ou invalide")
  })

  it("refuse les utilisateurs avec role apprenante", async () => {
    const token = jwt.sign({ sub: 1, role: "apprenante" }, process.env.JWT_SECRET)
    const res = await request(app)
      .get("/auth/require-formateurice")
      .set("Cookie", `token=${token}`)
      .expect(403)

    expect(res.body.message).toBe("Pas autorisée")
  })

  it("autorise les utilisateurs avec role formateurice", async () => {
    const token = jwt.sign({ sub: 1, role: "formateurice" }, process.env.JWT_SECRET)
    const res = await request(app)
      .get("/auth/require-formateurice")
      .set("Cookie", `token=${token}`)
      .expect(200)

    expect(res.body).toEqual({ ok: true })
  })
})
