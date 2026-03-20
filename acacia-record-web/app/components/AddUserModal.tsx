import { useState } from "react";
import { useForm } from "react-hook-form";
import { http } from "../services/http.service";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const userSchema = yup.object({
    name: yup.string().min(1, 'name is required').required('required'),
    username: yup.string().min(3, 'Too short').required('Required'),
    password: yup.string().min(8, 'Min 8 characters').required('Required'),
}).required();

type UserFormData = yup.InferType<typeof userSchema>;

export default function AddUserModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
        resolver: yupResolver(userSchema)
    });

    const onSubmit = async (data: UserFormData) => {
        setLoading(true);
        try {
            await http.post('/v1/auth/register', data);
            toast.success("User created successfully");
            onSuccess();
        } catch (err: any) {
            const msg = err.response?.data?.message || "Error creating user";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
            <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
                <div className="bg-slate-900 px-8 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">New Account</h2>
                        <p className="text-slate-400 text-[9px] font-bold uppercase mt-0.5">System Access</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                    {/* Username Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
                        <input
                            {...register('username')}
                            placeholder="e.g. john_doe"
                            className={`w-full px-4 py-3 text-sm rounded-2xl border bg-slate-50 focus:bg-white outline-none transition-all 
                ${errors.username ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-emerald-500'}`}
                        />
                        {errors.username && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase tracking-tighter">{errors.username.message}</p>}
                    </div>

                    {/* Display Name Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Display Name</label>
                        <input
                            {...register('name')}
                            placeholder="Full Name"
                            className={`w-full px-4 py-3 text-sm rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all
                ${errors.name ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-emerald-500'}`}
                        />
                        {errors.name && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase tracking-tighter">{errors.name.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 text-sm rounded-2xl border bg-slate-50 focus:bg-white outline-none transition-all 
                ${errors.password ? 'border-red-200 focus:border-red-400' : 'border-slate-100 focus:border-emerald-500'}`}
                        />
                        {errors.password && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase tracking-tighter">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all disabled:bg-slate-200 active:scale-[0.98]"
                    >
                        {loading ? 'Processing...' : 'Generate System User'}
                    </button>
                </form>
            </div>
        </div>
    );
}