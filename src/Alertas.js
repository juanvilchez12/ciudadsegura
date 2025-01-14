import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScriptNext, InfoWindow } from "@react-google-maps/api";
import io from "socket.io-client";
import axios from "axios";
import Header from "./Header";

// API Key de Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyD_hUuugJzTfQMl4OxFWSvj-ZcNeyFQD2w";

// URL base de tu backend
const BACKEND_URL = "https://7992-200-23-84-2.ngrok-free.app/";

const AlertaMapa = () => {
  const [alertas, setAlertas] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date()); // Tiempo actual para actualizar el conteo

  // Coordenadas iniciales del mapa (Junín, Argentina)
  const center = {
    lat: -34.5883,
    lng: -60.9576,
  };

  // Actualizar tiempo actual cada segundo para el conteo en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, []);

  // Calcular tiempo restante (40 minutos desde la creación)
  const calculateTimeRemaining = (createdAt) => {
    const alertTime = new Date(createdAt);
    const elapsedTime = Math.floor((currentTime - alertTime) / 1000); // Tiempo en segundos
    const remainingTime = Math.max(40 * 60 - elapsedTime, 0); // 40 minutos en segundos
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return { minutes, seconds, remainingTime };
  };

  useEffect(() => {
    const socket = io(BACKEND_URL);

    // Cargar alertas iniciales desde el backend
    const fetchAlertas = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtén el token desde el almacenamiento local
        const response = await axios.get(`${BACKEND_URL}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAlertas(response.data.alerts || []);
      } catch (error) {
        console.error("Error al obtener las alertas:", error);
      }
    };

    fetchAlertas();

    // Configurar eventos de Socket.IO para actualizaciones en tiempo real
    socket.on("createAlert", (newAlert) => {
      setAlertas((prev) => [newAlert, ...prev]);
    });

    socket.on("alertUpdate", (updatedAlert) => {
      setAlertas((prev) =>
        prev.map((alerta) =>
          alerta._id === updatedAlert._id ? updatedAlert : alerta
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [currentTime]);

  // Función para marcar una alerta como completada
  const completeAlert = async (alertId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_URL}/api/alerts/${alertId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertas((prev) => prev.filter((alerta) => alerta._id !== alertId)); // Eliminar alerta completada
      alert("Alerta marcada como completada y movida al historial");
    } catch (error) {
      console.error("Error al completar la alerta:", error);
      alert("Error al completar la alerta");
    }
  };

  // Función para eliminar una alerta
  const deleteAlert = async (alertId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertas((prev) => prev.filter((alerta) => alerta._id !== alertId)); // Eliminar alerta de la lista
      alert("Alerta eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
      alert("Error al eliminar la alerta");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            width: "30%",
            padding: "1em",
            backgroundColor: "#f9f9f9",
            overflowY: "auto",
            borderRight: "1px solid #ddd",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Alertas Activas</h2>
          {alertas.length === 0 ? (
            <p style={{ textAlign: "center" }}>No hay alertas activas en este momento.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {alertas.map((alerta) => {
                const { minutes, seconds } = calculateTimeRemaining(alerta.createdAt);

                return (
                  <li
                    key={alerta._id}
                    style={{
                      padding: "1em",
                      border: "1px solid #ddd",
                      marginBottom: "1em",
                      display: "flex",
                      flexDirection: "row",
                      gap: "1em",
                      backgroundColor: "#FFEBEE",
                      borderRadius: "5px",
                      color: "#000",
                      alignItems: "center",
                    }}
                  >
                    {alerta.userInfo.photo && (
                      <img
                        src={`${BACKEND_URL}/${alerta.userInfo.photo}`}
                        alt="Foto de usuario"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p>
                        <strong>Usuario:</strong>{" "}
                        {`${alerta.userInfo.firstName} ${alerta.userInfo.lastName}`}
                      </p>
                      <p>
                        <strong>Email:</strong> {alerta.userInfo.email}
                      </p>
                      <p>
                        <strong>Dirección:</strong> {alerta.userInfo.address}
                      </p>
                      <p>
                        <strong>Creado:</strong>{" "}
                        {new Date(alerta.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Tiempo restante:</strong>{" "}
                        {`${minutes}:${seconds.toString().padStart(2, "0")}`}
                      </p>
                      <div style={{ display: "flex", gap: "1em" }}>
                        <button
                          onClick={() => completeAlert(alerta._id)}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "0.5em",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Completar y mover al historial
                        </button>
                        <button
                          onClick={() => deleteAlert(alerta._id)}
                          style={{
                            backgroundColor: "#F44336",
                            color: "white",
                            padding: "0.5em",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap center={center} zoom={13} mapContainerStyle={{ width: "100%", height: "100%" }}>
              {alertas.map((alerta) =>
                Array.isArray(alerta.coordinates) && alerta.coordinates.length > 0 ? (
                  <Marker
                    key={alerta._id}
                    position={{
                      lat: alerta.coordinates[0].latitude,
                      lng: alerta.coordinates[0].longitude,
                    }}
                    onClick={() => setSelectedAlert(alerta)}
                  />
                ) : null
              )}
              {selectedAlert && selectedAlert.coordinates && (
                <InfoWindow
                  position={{
                    lat: selectedAlert.coordinates[0]?.latitude,
                    lng: selectedAlert.coordinates[0]?.longitude,
                  }}
                  onCloseClick={() => setSelectedAlert(null)}
                >
                  <div>
                    {selectedAlert.userInfo?.photo && (
                      <img
                        src={`${BACKEND_URL}/${selectedAlert.userInfo.photo}`}
                        alt="Foto de usuario"
                        style={{ width: "50px", borderRadius: "50%" }}
                      />
                    )}
                    <h4>
                      {selectedAlert.userInfo?.firstName || "N/A"}{" "}
                      {selectedAlert.userInfo?.lastName || "N/A"}
                    </h4>
                    <p>
                      <strong>Tipo:</strong> {selectedAlert.alertType || "N/A"}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScriptNext>
        </div>
      </div>
    </div>
  );
};

export default AlertaMapa;
