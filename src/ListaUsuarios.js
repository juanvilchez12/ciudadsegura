import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListaUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users'); // Cambia la URL según tu configuración
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la lista de usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Lista de Usuarios</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              width: '200px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={`http://localhost:5000/${user.photo}`} // Cambia la URL base según tu servidor
              alt={user.firstName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
            <h4>{`${user.firstName} ${user.lastName}`}</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.phone}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaUsuarios;
