import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import supabase from '../config/supabaseClient';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (user) {
      setAuth(true);
      console.log('User registered:', user);
    } else {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
