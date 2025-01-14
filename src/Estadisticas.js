import React, { useEffect, useState } from "react";
import Header from "./Header";

const Estadisticas = () => {
  const [newestUser, setNewestUser] = useState(null);
  const [oldestUser, setOldestUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [buttonStats, setButtonStats] = useState([]);
  const [period, setPeriod] = useState("week"); // Período: 'week' o 'month'
  const [selectedDate, setSelectedDate] = useState(new Date()); // Fecha seleccionada
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const formatWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lunes
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

    return `${startOfWeek.getDate()}-${endOfWeek.getDate()} de ${startOfWeek.toLocaleString(
      "es-ES",
      { month: "long" }
    )} de ${startOfWeek.getFullYear()}`;
  };

  const formatMonth = (date) => {
    return `${date.toLocaleString("es-ES", { month: "long" })} ${date.getFullYear()}`;
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [newestResponse, oldestResponse, countResponse] = await Promise.all([
        fetch("http://localhost:5000/api/auth/newest-user", { headers }),
        fetch("http://localhost:5000/api/auth/oldest-user", { headers }),
        fetch("http://localhost:5000/api/auth/user-count", { headers }),
      ]);

      if (!newestResponse.ok || !oldestResponse.ok || !countResponse.ok) {
        throw new Error("Error al obtener las estadísticas de usuarios");
      }

      setNewestUser(await newestResponse.json());
      setOldestUser(await oldestResponse.json());
      setUserCount((await countResponse.json()).count);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchButtonStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await fetch(
        `http://localhost:5000/api/stats/button-stats?period=${period}&date=${formatDate(
          selectedDate
        )}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las estadísticas de botones");
      }

      const data = await response.json();
      setButtonStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (direction) => {
    const newDate = new Date(selectedDate);
    if (period === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (period === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  useEffect(() => {
    fetchButtonStats();
  }, [period, selectedDate]);

  if (loading) {
    return <p>Cargando estadísticas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "20px" }}>
        <h1>Estadísticas de Usuarios</h1>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          {/* Usuario más nuevo */}
          {newestUser && (
            <div
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              <img
                src={`http://localhost:5000/${newestUser.photo}`}
                alt={`${newestUser.firstName} ${newestUser.lastName}`}
                style={{ width: "100%", height: "120px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "1em", textAlign: "center" }}>Usuario Más Nuevo</h3>
                <p style={{ fontSize: "0.9em" }}>
                  <strong>Nombre:</strong> {newestUser.firstName} {newestUser.lastName}
                </p>
                <p style={{ fontSize: "0.9em" }}>
                  <strong>Email:</strong> {newestUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Usuario más antiguo */}
          {oldestUser && (
            <div
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              <img
                src={`http://localhost:5000/${oldestUser.photo}`}
                alt={`${oldestUser.firstName} ${oldestUser.lastName}`}
                style={{ width: "100%", height: "120px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "1em", textAlign: "center" }}>Usuario Más Viejo</h3>
                <p style={{ fontSize: "0.9em" }}>
                  <strong>Nombre:</strong> {oldestUser.firstName} {oldestUser.lastName}
                </p>
                <p style={{ fontSize: "0.9em" }}>
                  <strong>Email:</strong> {oldestUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Total de usuarios */}
          <div
            style={{
              width: "200px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "1.2em", marginBottom: "10px" }}>Total Usuarios</h3>
            <p style={{ fontSize: "2em", fontWeight: "bold" }}>{userCount}</p>
          </div>
        </div>

        {/* Estadísticas de botones */}
        <h1>Estadísticas de Botones</h1>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="period">Seleccionar Período: </label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: "5px", margin: "0 10px" }}
          >
            <option value="week">Semanal</option>
            <option value="month">Mensual</option>
          </select>
          <button onClick={() => handleNavigation("prev")} style={{ margin: "0 10px" }}>
            Anterior
          </button>
          <button onClick={() => handleNavigation("next")}>Siguiente</button>
        </div>

        <h2 style={{ marginBottom: "20px" }}>
          {period === "week"
            ? `Semana: ${formatWeekRange(selectedDate)}`
            : `Mes: ${formatMonth(selectedDate)}`}
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          {buttonStats.map((stat, index) => (
            <div
              key={index}
              style={{
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                backgroundColor: "#fff",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <h3 style={{ fontSize: "1em" }}>{stat._id}</h3>
              <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>{stat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
