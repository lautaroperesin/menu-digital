import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Iniciar sesión con correo y contraseña en Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtiene el usuario autenticado
      const user = userCredential.user;

      // Obtiene el token de acceso
      const idToken = await user.getIdToken();
      
      // Enviar el token al servidor para crear la cookie de sesión
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      // Cambia el estado de la autenticacion a verdadero
      onLoginSuccess();
    } catch (error) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="form-login">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-login">
          Iniciar Sesión
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  </div>
  );
};

export default Login;
