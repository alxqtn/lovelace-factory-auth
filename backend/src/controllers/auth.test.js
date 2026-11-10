import { validerInscription } from "./auth.js";
import { describe, it, expect, vi } from "vitest"
import request from "supertest"
import jwt from "jsonwebtoken"
import { app } from "../app.js"
import { db } from "../db.js"

describe("validerInscription", () => {
  it("a besoin d'un prénom, nom et email", () => {
    expect(() => validerInscription()).toThrow(TypeError)
  })

  it("a besoin d'un prénom, nom et email", () => {
    // Arrange + Act
    const erreurs = validerInscription({})

    // Assert
    expect(erreurs.prenom).toBeDefined()
    expect(erreurs.email).toBeDefined()
    expect(erreurs.motDePasse).toBeDefined()
  })

  it("accepte des données valides", () => {
    // Arrange
    const formData = { prenom: "Alix", email: "alix@gmail.com", motDePasse: "abcdef123" }

    // Act
    const erreurs = validerInscription(formData)

    // Assert
    expect(erreurs).toEqual({})
  })

    it("accepte des données valides", () => {
      // Given
      const formData = { prenom: "Alix", email: "alixgmail.com", motDePasse: "abcdef123" }

      // When
      const erreurs = validerInscription(formData)

      // Then
      expect(erreurs).toEqual({
        email: "L'email n'a pas un format valide"
      })
  })
})

describe("/moi", () => {
  it("refuse une requête sans cookie", async () => {
    const res = await request(app).get("/api/auth/moi")

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Connexion requise")
  })

  it("refuse un token invalide", async () => {
    const res = await request(app)
      .get("/api/auth/moi")
      .set("Cookie", "token=nimportequoi")

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Session expirée ou invalide")
  })

  it("renvoie l'utilisatrice connectée, sans son mot de passe", async () => {
    // Arrange : l'agent garde le cookie entre les requêtes
    const agent = request.agent(app)
    await agent
      .post("/api/auth/inscription")
      .send({ prenom: "Alix", email: "alix@gmail.com", motDePasse: "abcdef123" })
      .expect(201)
    await agent
      .post("/api/auth/connexion")
      .send({ email: "alix@gmail.com", motDePasse: "abcdef123" })
      .expect(200)

    // Act
    const res = await agent.get("/api/auth/moi")

    // Assert
    expect(res.status).toBe(200)
    expect(res.body.utilisateur).toMatchObject({
      prenom: "Alix",
      email: "alix@gmail.com",
      role: "apprenante",
    })
    expect(res.body.utilisateur).not.toHaveProperty("mot_de_passe_hash")
  })

  it("renvoie l'utilisatrice avec une base de données mockée", async () => {
    // Arrange : on remplace db.query par un faux qui renvoie une ligne prête à l'emploi.
    // Aucune requête n'atteint Postgres.
    const fausseUtilisatrice = {
      id: 42,
      prenom: "Grace",
      email: "grace@gmail.com",
      role: "formateurice",
      date_inscription: "2026-11-09",
    }
    const query = vi.spyOn(db, "query").mockResolvedValue({ rows: [fausseUtilisatrice] })
    const token = jwt.sign({ sub: 42, role: "formateurice" }, process.env.JWT_SECRET)

    // Act
    const res = await request(app)
      .get("/api/auth/moi")
      .set("Cookie", `token=${token}`)

    // Assert : la réponse, et la requête envoyée à la base
    expect(res.status).toBe(200)
    expect(res.body.utilisateur).toEqual(fausseUtilisatrice)
    expect(query).toHaveBeenCalledOnce()
    expect(query).toHaveBeenCalledWith(expect.stringContaining("WHERE id = $1"), [42])
  })

  it("refuse un token valide dont l'utilisatrice n'existe plus", async () => {
    const token = jwt.sign({ sub: 999, role: "apprenante" }, process.env.JWT_SECRET)

    const res = await request(app)
      .get("/api/auth/moi")
      .set("Cookie", `token=${token}`)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Session Invalide")
  })
})
