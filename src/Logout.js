import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem("token");

    // Redirigir a la página de inicio de sesión
    navigate("/");
  }, [navigate]);

  return <p>Cerrando sesión...</p>;
};

export default Logout;
