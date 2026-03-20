'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout as authLogout } from '@/app/services/auth.service';
import Link from 'next/link';
import { useAuthStore } from '../stores/auth';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout: storeLogout } = useAuthStore();
  const isAdmin = user?.permission === 'ADMIN';
  
  // State to control dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  // Inside app/components/Navbar.tsx

useEffect(() => {
  // 1. Check if the store is empty
  if (!user) {
    const tokenData = localStorage.getItem('token');
    
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        // 2. Extract the user data (adjust 'parsed.user' based on your NestJS return)
        const savedUser = parsed.user || parsed;
        
        // 3. Put it back into the Zustand store
        setUser(savedUser); 
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }
}, [user, setUser]); // This runs once on mount or when user changes

  const handleLogout = () => {
    authLogout();
    storeLogout();
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 text-slate-700 shadow-sm relative z-50">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-emerald-700">
          Acacia <span className="text-slate-400">Record</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {isAdmin && (
            <Link 
              href="/users" 
              className={`text-sm font-bold uppercase tracking-tight ${pathname === '/users' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-500 transition-colors'}`}
            >
              Users
            </Link>
          )}

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center focus:outline-none transition-transform active:scale-95"
            >
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0D9488&color=fff"
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border-2 border-emerald-500 p-0.5"
              />
            </button>

            {/* THE DROPDOWN CARD */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-150">
                {/* User Header */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-bold text-slate-800">
                    {user?.name} - {user?.permission}
                  </p>
                </div>

                {/* Links */}
                <div className="py-2">
                  <DropdownLink href="/profile" icon="👤" label="Edit profile" />
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-50 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper Component for the menu items
function DropdownLink({ href, icon, label }: { href: string, icon: string, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}