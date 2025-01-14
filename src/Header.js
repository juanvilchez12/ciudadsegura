import React from "react";
import { Link, useNavigate } from "react-router-dom";
import cdsLogo from "./cds.png"; // Importa el logo desde la misma carpeta

const Header = () => {
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token de almacenamiento local
    navigate("/"); // Redirigir a la página de inicio (http://localhost:3000)
  };

  return (
    <div style={styles.header}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <img src={cdsLogo} alt="Logo" style={styles.logo} />
      </div>

      {/* Navegación */}
      <div style={styles.navContainer}>
        <Link to="/alertas" style={styles.navButton}>
          Alertas
        </Link>
        <Link to="/historial" style={styles.navButton}>
          Historial
        </Link>
        <Link to="/usuarios" style={styles.navButton}>
          Usuarios
        </Link>
        <Link to="/estadisticas" style={styles.navButton}>
          Estadísticas
        </Link>
      </div>

      {/* Botón de Cerrar Sesión */}
      <button onClick={handleLogout} style={styles.logoutButton}>
        Cerrar Sesión
      </button>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f3", // Blanco neomorfista
    color: "#333", // Letras negras
    padding: "10px 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(255, 255, 255, 0.7)",
    borderRadius: "10px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "auto", // Mantener las proporciones originales
    height: "40px", // Altura fija
  },
  navContainer: {
    display: "flex",
    gap: "20px",
  },
  navButton: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  logoutButton: {
    backgroundColor: "#f0f0f3",
    color: "#333",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7)",
    transition: "background-color 0.3s ease",
  },
};

export default Header;
