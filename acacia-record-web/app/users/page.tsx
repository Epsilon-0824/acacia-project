'use client';

import React, { useEffect, useState } from 'react';
import { http } from '@/app/services/http.service';
import { useAuthStore } from '@/app/stores/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AddUserModal from '../components/AddUserModal';

interface UserRecord {
    id: number;
    username: string;
    name: string | null;
    permission: 'ADMIN' | 'IT';
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const res = await http.get('/v1/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.permission !== 'ADMIN') {
            toast.error("Access Denied: Admins Only");
            router.push('/');
        }
    }, [currentUser, router]);

    useEffect(() => {
        if (currentUser?.permission === 'ADMIN') {
            fetchUsers();
        }
    }, [currentUser]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">
            Loading System Users...
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">System Users</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Manage permissions and access levels
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Add User</span>
                    </button>

                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{users.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((u) => (
                            <tr key={u.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-700">{u.username}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm text-slate-500 font-medium">{u.name || <em className="text-slate-300">Not Provided</em>}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest border
                    ${u.permission === 'ADMIN'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {u.permission}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        No system users discovered
                    </div>
                )}

                {isModalOpen && (
                    <AddUserModal
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            fetchUsers();
                        }}
                    />
                )}
            </div>
        </div>
    );
}