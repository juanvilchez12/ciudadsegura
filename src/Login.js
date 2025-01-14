import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://7992-200-23-84-2.ngrok-free.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      const { token, role, userId } = data;

      // Almacenar datos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      // Redirigir según el rol
      if (role === "admin") {
        navigate("/alertas");
      } else {
        setError("Acceso denegado: No eres administrador.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Email o contraseña incorrectos.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Imagen de la parte superior */}
      <img
        src="https://via.placeholder.com/150" // Cambia la URL por la imagen que desees
        alt="Logo Superior"
        style={styles.topImage}
      />

      <div style={styles.formContainer}>
        <h2 style={styles.header}>Iniciar Sesión</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Imagen de la parte inferior */}
      <img
        src="https://via.placeholder.com/150" // Cambia la URL por la imagen que desees
        alt="Logo Inferior"
        style={styles.bottomImage}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#e0e5ec",
  },
  topImage: {
    width: "150px", // Tamaño de la imagen superior
    marginBottom: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "300px",
    padding: "30px",
    backgroundColor: "#f0f0f3",
    borderRadius: "20px",
    boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.1), -8px -8px 15px rgba(255, 255, 255, 0.7)",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  input: {
    padding: "15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.8)",
  },
  button: {
    padding: "15px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    cursor: "pointer",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2), -4px -4px 10px rgba(255, 255, 255, 0.8)",
  },
  error: {
    color: "#D32F2F",
    marginTop: "10px",
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomImage: {
    width: "150px", // Tamaño de la imagen inferior
    marginTop: "20px",
  },
};

export default Login;
