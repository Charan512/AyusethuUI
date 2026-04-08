import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const INPUT_CLS = "w-full px-3.5 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-forest-light focus:border-white/30 outline-none transition-all focus:bg-white/10 text-white placeholder-white/40 text-[15px] shadow-inner backdrop-blur-md";
const LABEL_CLS = "block text-xs font-bold text-white/90 uppercase tracking-widest mb-1.5 drop-shadow-sm";

export default function RegisterView() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'COLLECTOR',
    // Manufacturer-specific
    organizationName: '', location: '', productsManufactured: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isMfg = formData.role === 'MANUFACTURER';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (formData.role === 'FARMER') { setError('Farmers must register via the Mobile App.'); return; }
    setLoading(true);
    try {
      const payload = isMfg
        ? {
            role: 'MANUFACTURER',
            email: formData.email,
            password: formData.password,
            organizationName: formData.organizationName,
            location: formData.location,
            productsManufactured: formData.productsManufactured,
          }
        : {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          };
      await register(payload);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Registration Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white/25 backdrop-blur-2xl xl:backdrop-blur-3xl px-8 py-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ring-1 ring-white/30 w-full max-w-[380px] border border-white/20 relative my-8">
      <h2 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight drop-shadow-sm">Join AyuSethu</h2>
      <p className="text-center text-[15px] text-white/80 mb-6 font-medium">Register as a Network Partner</p>

      {error && (
        <div className="bg-red-500/20 backdrop-blur-md text-red-100 text-sm p-4 rounded-xl mb-6 font-semibold border border-red-500/30 text-center shadow-inner">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">

        {/* Role selector */}
        <div className="relative">
          <label className={LABEL_CLS}>Partner Role</label>
          <select name="role" value={formData.role} onChange={handleChange}
            className="w-full px-3.5 py-2.5 appearance-none bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-forest-light focus:border-white/30 outline-none transition-all text-white text-[15px] font-medium cursor-pointer shadow-inner backdrop-blur-md">
            <option value="COLLECTOR" className="text-gray-900">Platform Collector</option>
            <option value="LAB" className="text-gray-900">Pharmacognostic Lab</option>
            <option value="MANUFACTURER" className="text-gray-900">Manufacturer / Organisation</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-white/70">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>

        {/* Standard fields */}
        {!isMfg && (
          <>
            <div>
              <label className={LABEL_CLS}>Full Name</label>
              <input name="name" className={INPUT_CLS} value={formData.name} onChange={handleChange} required placeholder="Arjun Verma" />
            </div>
            <div>
              <label className={LABEL_CLS}>Phone Number</label>
              <input name="phone" className={INPUT_CLS} value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
            </div>
          </>
        )}

        {/* Manufacturer-specific fields */}
        {isMfg && (
          <>
            <div>
              <label className={LABEL_CLS}>Organisation Name *</label>
              <input name="organizationName" className={INPUT_CLS} value={formData.organizationName} onChange={handleChange} required placeholder="AyurPharm Pvt Ltd" />
            </div>
            <div>
              <label className={LABEL_CLS}>Location</label>
              <input name="location" className={INPUT_CLS} value={formData.location} onChange={handleChange} placeholder="Bangalore, Karnataka" />
            </div>
            <div>
              <label className={LABEL_CLS}>Products Manufactured</label>
              <input name="productsManufactured" className={INPUT_CLS} value={formData.productsManufactured} onChange={handleChange}
                placeholder="Ashwagandha Extract, Moringa Capsules…" />
              <p className="text-[10px] text-white/50 mt-1">Comma-separated list of products</p>
            </div>
          </>
        )}

        {/* Common: email, password, confirm */}
        <div>
          <label className={LABEL_CLS}>Email Address *</label>
          <input type="email" name="email" className={INPUT_CLS} value={formData.email} onChange={handleChange} required placeholder="org@example.com" />
        </div>
        <div>
          <label className={LABEL_CLS}>Password *</label>
          <input type="password" name="password" className={INPUT_CLS} value={formData.password} onChange={handleChange} required placeholder="••••••••" />
        </div>
        <div>
          <label className={LABEL_CLS}>Confirm Password *</label>
          <input type="password" name="confirmPassword" className={INPUT_CLS} value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all tracking-wide text-[15px] mt-6 border border-white/20 disabled:opacity-60">
          {loading ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-[13px] text-white/70 mt-8 font-medium">
        Already a partner? <a href="/login" className="text-forest-light hover:text-white hover:underline font-bold transition-all drop-shadow-md">Login here</a>
      </p>
    </div>
  );
}
