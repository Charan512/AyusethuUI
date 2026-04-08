import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { 
  Building2, 
  Leaf, 
  FlaskConical, 
  LogOut, 
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import CollectorView from './CollectorView';
import LabView from './LabView';
import AdminView from './AdminView';
import ManufacturerView from './ManufacturerView';
import NotificationDropdown from './NotificationDropdown';
import { NotificationService } from '../services/api';

// ── Shared Dashboard Shell ──────────────────────────────────────────
export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role || 'COLLECTOR');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    NotificationService.fetchHistory()
      .then(res => {
        if (res.data?.success) setNotifications(res.data.data);
      })
      .catch(err => console.warn('History fetch failed', err));

    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5001';
    const socket = io(socketUrl);
    
    socket.emit('joinRole', user.role);
    return () => socket.disconnect();
  }, [user]);

  return (
    <div className="flex h-screen bg-earth-bg font-sans overflow-hidden text-gray-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-forest text-white flex flex-col shadow-xl z-20">
        <div className="px-8 py-10 border-b border-forest-light/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Leaf size={24} className="text-leaf" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AyuSethu</h1>
          </div>
          <p className="text-sm text-leaf/80 font-medium tracking-wide uppercse ml-12">Supply Chain</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {user?.role === 'ADMIN' && (
            <SidebarItem icon={LayoutDashboard} label="Command Center" active={activeTab === 'ADMIN'} onClick={() => setActiveTab('ADMIN')} />
          )}
          {(user?.role === 'COLLECTOR' || user?.role === 'ADMIN') && (
            <SidebarItem icon={Leaf} label="Collector Portal" active={activeTab === 'COLLECTOR'} onClick={() => setActiveTab('COLLECTOR')} />
          )}
          {(user?.role === 'LAB' || user?.role === 'ADMIN') && (
            <SidebarItem icon={FlaskConical} label="Lab Analysis" active={activeTab === 'LAB'} onClick={() => setActiveTab('LAB')} />
          )}
          {(user?.role === 'MANUFACTURER' || user?.role === 'ADMIN') && (
             <SidebarItem icon={Building2} label="Manufacturer" active={activeTab === 'MANUFACTURER'} onClick={() => setActiveTab('MANUFACTURER')} />
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 px-10 flex items-center justify-between z-10 shadow-sm relative">
          <h2 className="text-xl font-bold text-forest-dark">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).toLowerCase()} Portal
          </h2>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user?.name || 'Authorized User'}</p>
              <p className="text-xs font-semibold text-leaf uppercase tracking-wider">{user?.role || 'Unknown'}</p>
            </div>
            
            <div className="relative">
              <NotificationDropdown notifications={notifications} setNotifications={setNotifications} />
            </div>

            <div className="h-8 w-px bg-gray-200" />
            <button 

              onClick={logout} 
              className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-10 overflow-y-auto w-full relative">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="max-w-6xl mx-auto"
             >
                {activeTab === 'ADMIN' && <AdminView />}
                {activeTab === 'COLLECTOR' && <CollectorView />}
                {activeTab === 'LAB' && <LabView />}
                {activeTab === 'MANUFACTURER' && <ManufacturerView />}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sidebar Component
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center space-x-4 ${
      active 
        ? 'bg-forest-dark text-white shadow-md font-semibold' 
        : 'text-leaf hover:bg-forest-light/20 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-leaf opacity-80'} />
    <span className="tracking-wide">{label}</span>
  </button>
);
