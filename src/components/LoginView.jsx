import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginView() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('9999900010');
  const [password, setPassword] = useState('test123');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(phone, password);
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login Failed');
    }
  };

  return (
    <div className="min-h-screen bg-earth-bg flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-forest-dark text-center mb-8 tracking-tight">AyuSethu</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              className="w-full p-4 bg-earth-bg border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-shadow" 
               value={phone} onChange={e => setPhone(e.target.value)} 
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
             <input type="password"
               className="w-full p-4 bg-earth-bg border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-shadow" 
               value={password} onChange={e => setPassword(e.target.value)} 
             />
          </div>
          <button type="submit" className="w-full py-4 bg-forest text-white font-bold rounded-xl shadow-md hover:bg-forest-light transition-colors tracking-wide">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
