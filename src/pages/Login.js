import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import supabase from '../config/supabaseClient';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { user, error } = await supabase.auth.signIn({
      email: username,
      password: password,
    });

    if (user) {
      setAuth(true);
      console.log('Logged in:', user);
    } else {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input type="email" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
