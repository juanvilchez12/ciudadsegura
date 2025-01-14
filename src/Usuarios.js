import React, { useEffect, useState } from "react";
import Header from "./Header"; // Asegúrate de que la ruta sea correcta

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener usuarios desde la API
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          "https://7992-200-23-84-2.ngrok-free.app/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autenticación
            },
          }
        );

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Verificar si la respuesta es JSON válida
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("La respuesta no es un JSON válido.");
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error(err); // Mostrar el error en la consola para depuración
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h1>Lista de Usuarios</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          {usuarios.map((usuario) => (
            <div
              key={usuario._id}
              style={{
                width: "250px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={`https://7992-200-23-84-2.ngrok-free.app${usuario.photo}`}
                alt={`${usuario.firstName} ${usuario.lastName}`}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "10px" }}>
                <h3
                  style={{
                    fontSize: "1.2em",
                    margin: "10px 0",
                    textAlign: "center",
                  }}
                >
                  {usuario.firstName} {usuario.lastName}
                </h3>
                <p style={{ fontSize: "0.9em", margin: "5px 0" }}>
                  <strong>Email:</strong> {usuario.email}
                </p>
                <p style={{ fontSize: "0.9em", margin: "5px 0" }}>
                  <strong>Teléfono:</strong> {usuario.phone || "N/A"}
                </p>
                <p style={{ fontSize: "0.9em", margin: "5px 0" }}>
                  <strong>DNI:</strong> {usuario.dni || "N/A"}
                </p>
                <p style={{ fontSize: "0.9em", margin: "5px 0" }}>
                  <strong>Dirección:</strong> {usuario.address}
                </p>
                <p style={{ fontSize: "0.9em", margin: "5px 0" }}>
                  <strong>Rol:</strong> {usuario.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
