import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScriptNext, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import Header from "./Header"; // Cambiar la ruta si es necesario

const BACKEND_URL = "https://7992-200-23-84-2.ngrok-free.app"; // URL del backend
const GOOGLE_MAPS_API_KEY = "AIzaSyD_hUuugJzTfQMl4OxFWSvj-ZcNeyFQD2w"; // Reemplaza con tu API key

const Historial = () => {
  const [completedAlerts, setCompletedAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Coordenadas iniciales del mapa (Junín, Argentina)
  const center = {
    lat: -34.5883,
    lng: -60.9576,
  };

  // Fetch de alertas completadas
  useEffect(() => {
    const fetchCompletedAlerts = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtén el token desde el almacenamiento local
        const response = await axios.get(`${BACKEND_URL}/api/alerts/completed`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCompletedAlerts(response.data.alerts || []);
      } catch (error) {
        console.error("Error al obtener el historial de alertas:", error);
      }
    };

    fetchCompletedAlerts();
  }, []);

  return (
    <div>
      <Header />
      {completedAlerts.length === 0 ? (
        <p>No hay alertas completadas en el historial.</p>
      ) : (
        <div style={{ display: "flex", height: "100vh" }}>
          {/* Barra del historial */}
          <div
            style={{
              width: "30%",
              padding: "1em",
              backgroundColor: "#f9f9f9",
              overflowY: "auto",
              borderRight: "1px solid #ddd",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "1em" }}>Historial</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {completedAlerts.map((alerta) => (
                <li
                  key={alerta._id}
                  style={{
                    padding: "1em",
                    border: "1px solid #ddd",
                    marginBottom: "1em",
                    display: "flex",
                    gap: "1em",
                    backgroundColor: "#E3F2FD",
                    borderRadius: "5px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                  onClick={() => setSelectedAlert(alerta)}
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
                      <strong>Tipo:</strong> {alerta.alertType}
                    </p>
                    <p>
                      <strong>Prioridad:</strong> {alerta.priority}
                    </p>
                    <p>
                      <strong>Completado el:</strong>{" "}
                      {new Date(alerta.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa con marcadores */}
          <div style={{ flex: 1 }}>
            <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                center={center}
                zoom={13}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                {completedAlerts.map((alerta) =>
                  alerta.coordinates?.length > 0 ? (
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
                      {selectedAlert.userInfo.photo && (
                        <img
                          src={`${BACKEND_URL}/${selectedAlert.userInfo.photo}`}
                          alt="Foto de usuario"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      <h4>
                        {selectedAlert.userInfo?.firstName || "N/A"}{" "}
                        {selectedAlert.userInfo?.lastName || "N/A"}
                      </h4>
                      <p>
                        <strong>Tipo:</strong> {selectedAlert.alertType || "N/A"}
                      </p>
                      <p>
                        <strong>Prioridad:</strong> {selectedAlert.priority || "N/A"}
                      </p>
                      <p>
                        <strong>Completado el:</strong>{" "}
                        {new Date(selectedAlert.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScriptNext>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historial;
