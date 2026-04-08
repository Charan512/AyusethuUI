import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NotificationService } from '../services/api';

export default function NotificationDropdown({ notifications, setNotifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      await NotificationService.markRead(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded-md">
                {notifications.length} Unread
              </span>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                  <CheckCircle2 size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm font-medium">You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      onClick={(e) => handleMarkRead(e, notif._id)}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative group block"
                    >
                      <p className="text-sm text-gray-700 pr-4">{notif.message}</p>
                      {notif.batchId && <p className="text-xs text-gray-400 mt-1 uppercase">Batch Ref: {notif.batchId}</p>}
                      {notif.createdAt && <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
