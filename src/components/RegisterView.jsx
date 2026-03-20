import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterView() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'COLLECTOR'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (formData.role === 'FARMER') throw new Error('Farmers must register via the Mobile App');
      await register(formData);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Registration Failed');
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl ring-1 ring-white/40 w-full max-w-lg border border-white/60 relative my-12">
        <h2 className="text-3xl font-extrabold text-forest-dark text-center mb-3 tracking-tight">Join AyuSethu</h2>
        <p className="text-center text-base text-gray-500 mb-8 font-medium">Register as a Network Partner</p>
        
        {error && (
           <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 font-semibold border border-red-100 text-center">
             {error}
           </div>
        )}

        <form onSubmit={handleRegister} className="space-y-7">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Full Name</label>
            <input 
              name="name"
              className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
              value={formData.name} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Phone Number</label>
            <input 
              name="phone"
              className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
              value={formData.phone} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Email Address</label>
            <input 
              type="email"
              name="email"
              className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
              value={formData.email} onChange={handleChange} required
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Password</label>
             <input 
               type="password" name="password"
               className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base" 
               value={formData.password} onChange={handleChange} required
             />
          </div>
          <div className="relative">
             <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Partner Role</label>
             <select 
               name="role"
               className="w-full p-4 appearance-none hover:bg-white bg-white/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all focus:bg-white text-base font-medium text-gray-800 cursor-pointer"
               value={formData.role} onChange={handleChange}
             >
               <option value="COLLECTOR">Platform Collector</option>
               <option value="LAB">Pharmacognostic Lab</option>
               <option value="MANUFACTURER">Manufacturer</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-8 text-gray-500">
               <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
             </div>
          </div>
          <button type="submit" className="w-full py-4 bg-forest text-white font-extrabold rounded-xl shadow-lg hover:bg-forest-light hover:shadow-xl hover:-translate-y-0.5 transition-all tracking-wide text-base mt-8">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-800 mt-8 font-medium">
          Already a partner? <a href="/login" className="text-forest-dark hover:text-forest hover:underline font-bold transition-colors">Login here</a>
        </p>
    </div>
  );
}
