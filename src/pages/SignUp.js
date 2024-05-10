import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate user registration logic
    console.log('User registered:', username, email);
    setAuth(true); // Assume registration logs the user in
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
