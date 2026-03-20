'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { http } from '@/app/services/http.service';
import { useAuthStore } from '@/app/stores/auth';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
    name: yup.string().min(1, 'name is require').required('Required'),
    username: yup.string().min(3, 'Too short').required('Required'),
    password: yup.string().nullable().notRequired().default(null)
}).required();

type ProfileFormData = yup.InferType<typeof profileSchema>;

export default function EditProfilePage() {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                username: user.username,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await http.patch(`/v1/users/${user?.id}`, data);

            setUser(res.data);

            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

                {/* Header Section */}
                <div className="bg-slate-900 p-10 text-center relative">
                    <div className="w-24 h-24 bg-emerald-500 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-lg rotate-3">
                        {user?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-white font-black text-xl tracking-tight uppercase">My Profile</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        Role: {user?.permission}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Full Name</label>
                        <input
                            {...register('name')}
                            className="w-full px-5 py-3.5 text-sm rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                        />
                        {errors.name && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
                        <input
                            {...register('username')}
                            className="w-full px-5 py-3.5 text-sm rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700"
                        />
                        {errors.username && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase">{errors.username.message}</p>}
                    </div>

                    <div className="space-y-1 pt-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">New Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="Leave blank to keep current"
                            className="w-full px-5 py-3.5 text-sm rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                        />
                        {errors.password && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'SAVING CHANGES...' : 'UPDATE ACCOUNT'}
                    </button>
                </form>
            </div>
        </div>
    );
}