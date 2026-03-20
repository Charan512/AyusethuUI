import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login(email, password);
      // Explicitly block Farmer logins on the Web Portal
      if (userData?.role === 'FARMER') {
        setError('Farmers must use the AyuSethu Mobile App to login.');
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err?.response?.data?.error || 'Login Failed');
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl ring-1 ring-white/40 w-full max-w-md border border-white/60 relative">
        <h2 className="text-3xl font-extrabold text-forest-dark text-center mb-3 tracking-tight">AyuSethu</h2>
        <p className="text-center text-base text-gray-500 mb-8 font-medium">Network Partner Portal</p>
        
        {error && (
           <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 font-semibold border border-red-100 text-center">
             {error}
           </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Email Address</label>
            <input 
              type="email"
              className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
               value={email} onChange={e => setEmail(e.target.value)} 
               required
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Password</label>
             <input type="password"
               className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
               value={password} onChange={e => setPassword(e.target.value)} 
             />
          </div>
          <button type="submit" className="w-full py-4 bg-forest text-white font-bold rounded-xl shadow-lg hover:bg-forest-light hover:shadow-xl hover:-translate-y-0.5 transition-all tracking-wide text-base mt-6">
            Secure Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-800 mt-8 font-medium">
          New network partner? <a href="/register" className="text-forest-dark hover:text-forest hover:underline font-bold transition-colors">Register here</a>
        </p>
    </div>
  );
}
