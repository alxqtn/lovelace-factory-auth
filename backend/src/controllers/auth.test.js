import { validerInscription } from "./auth.js";
import { describe, it, expect } from "vitest"

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
