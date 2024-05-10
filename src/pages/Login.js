import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext'; // We will create this context next

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically handle authentication, for now, we'll just simulate
    if (username === 'user' && password === 'password') {
      setAuth(true);
      console.log('Logged in');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
