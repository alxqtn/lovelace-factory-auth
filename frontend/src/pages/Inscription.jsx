import { useState } from "react";
import { Champ } from "../components/Champ";
import { inscrire } from "../api/auth";
import { useNavigate } from "react-router";

export function Inscription() {
  const [form, setForm] = useState({
    prenom: null,
    email: null,
    motDePasse: null,
  })
  const [erreurs, setErreurs] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
        console.log(form)


    try {
      await inscrire(form)
      navigate("/connexion", { state: { inscrite: true } })
    } catch (err) {
      if (err.status === 422) {
        setErreurs(err.erreurs)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Champ id="prenom" label="Prénom" type="text" placeholder="Alix" value={form.prenom} onChange={handleChange} erreur={erreurs.prenom} />
      <Champ id="email" label="Email" type="text" value={form.email} onChange={handleChange} erreur={erreurs.email} />
      <Champ id="motDePasse" label="Mot de passe" type="password" value={form.motDePasse} onChange={handleChange} erreur={erreurs.motDePasse} />
      <button type="submit">Soumettre</button>
    </form>
  )
}
