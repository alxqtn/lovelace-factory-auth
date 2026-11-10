import { Routes, Route } from 'react-router';
import { TableauDeBord } from './pages/TableauDeBord.jsx';
import { RouteProtegee } from './components/RouteProtegee.jsx';
import { Connexion } from './pages/Connexion.jsx';
import { Inscription } from './pages/Inscription.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />

      {/* ROUTES PROTEGEES */}
      <Route element={<RouteProtegee />}>
        <Route path="/" element={<TableauDeBord />} />
      </Route>
    </Routes>
  );
}
