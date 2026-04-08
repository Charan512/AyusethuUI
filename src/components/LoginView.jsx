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
    <div className="bg-white/25 backdrop-blur-2xl xl:backdrop-blur-3xl px-8 py-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ring-1 ring-white/30 w-full max-w-[340px] border border-white/20 relative">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight drop-shadow-sm">AyuSethu</h2>
        <p className="text-center text-[15px] text-white/80 mb-6 font-medium">Network Partner Portal</p>
        
        {error && (
           <div className="bg-red-500/20 backdrop-blur-md text-red-100 text-sm p-4 rounded-xl mb-6 font-semibold border border-red-500/30 text-center shadow-inner">
             {error}
           </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 mt-5">
          <div>
            <label className="block text-xs font-bold text-white/90 uppercase tracking-widest mb-1.5 drop-shadow-sm">Email Address</label>
            <input 
              type="email"
              className="w-full px-3.5 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-forest-light focus:border-white/30 outline-none transition-all focus:bg-white/10 text-white placeholder-white/40 text-[15px] shadow-inner backdrop-blur-md" 
               value={email} onChange={e => setEmail(e.target.value)} 
               placeholder="partner@ayusethu.com"
               required
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-white/90 uppercase tracking-widest mb-1.5 drop-shadow-sm">Password</label>
             <input type="password"
               className="w-full px-3.5 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-forest-light focus:border-white/30 outline-none transition-all focus:bg-white/10 text-white placeholder-white/40 text-[15px] shadow-inner backdrop-blur-md" 
               value={password} onChange={e => setPassword(e.target.value)} 
               placeholder="••••••••"
             />
          </div>
          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all tracking-wide text-[15px] mt-8 border border-white/20">
            Secure Login
          </button>
        </form>

        <p className="text-center text-[13px] text-white/70 mt-8 font-medium">
          New network partner? <a href="/register" className="text-forest-light hover:text-white hover:underline font-bold transition-all drop-shadow-md">Register here</a>
        </p>
    </div>
  );
}
