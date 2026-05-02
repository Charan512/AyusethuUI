import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationBell({ role }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Optionally fetch existing notifications from backend here
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
        const token = localStorage.getItem('ayusethu_token');
        // This endpoint might need to be created on your backend (GET /api/v1/notifications)
        const res = await axios.get(`${apiUrl}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.warn('Notification history fetch failed (route might not exist yet).');
      } finally {
        setLoading(false);
      }
    };
    
    if (role) {
      fetchHistory();
    }

    // Handle clicks outside of dropdown to close it
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [role]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // In a real app we would mark it read on the backend
  const dismissNotification = (idx) => {
    setNotifications(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <Bell size={24} className="text-gray-500 hover:text-forest transition-colors" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow ring-2 ring-white">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded-md">
                {notifications.length} New
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-gray-400">Loading history...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                  <CheckCircle2 size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm font-medium">You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif, idx) => (
                    <div key={idx} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group">
                      <p className="text-sm text-gray-700 pr-6">{notif.message || notif}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); dismissNotification(idx); }}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Dismiss"
                      >
                         <AlertCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => setNotifications([])}
                  className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
