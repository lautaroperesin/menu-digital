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
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
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
