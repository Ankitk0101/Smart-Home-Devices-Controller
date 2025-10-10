import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createHousehold } from '../../firebase/firestore';
import '../../App.css'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Change the handleSubmit function
async function handleSubmit(e) {
  e.preventDefault();
  try {
    await register(email, password, name, householdName);
    navigate('/dashboard');
  } catch (err) {
    setError(err.message || 'Failed to register');
  }
}

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Household Name"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}