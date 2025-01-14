import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Alertas from "./Alertas";
import Historial from "./Historial";
import Usuarios from "./Usuarios";
import Estadisticas from "./Estadisticas";
import PrivateRoute from "./PrivateRoute";
import Logout from "./Logout"; // Importar el componente Logout

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de inicio de sesión */}
        <Route path="/" element={<Login />} />

        {/* Ruta para las alertas */}
        <Route
          path="/alertas"
          element={
            <PrivateRoute>
              <Alertas />
            </PrivateRoute>
          }
        />

        {/* Ruta para el historial */}
        <Route
          path="/historial"
          element={
            <PrivateRoute>
              <Historial />
            </PrivateRoute>
          }
        />

        {/* Ruta para la gestión de usuarios */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          }
        />

        {/* Ruta para estadísticas */}
        <Route
          path="/estadisticas"
          element={
            <PrivateRoute>
              <Estadisticas />
            </PrivateRoute>
          }
        />

        {/* Ruta para el cierre de sesión */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
