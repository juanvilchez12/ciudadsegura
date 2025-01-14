import React from 'react';

const RegisterScreen = () => {
  return (
    <div style={{ textAlign: 'center', padding: '1em' }}>
      <h2>Registrar Usuario</h2>
      <form>
        <div>
          <label>Nombre:</label>
          <input type="text" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" required />
        </div>
        <button type="submit" style={{ marginTop: '1em' }}>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterScreen;
