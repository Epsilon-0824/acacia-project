'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '../services/auth.service';
import { useAuthStore } from '../stores/auth';

const schema = yup.object({
    username: yup.string().required('username is required').min(3, 'username must be 3 letters or more'),
    password: yup.string().required('password is required').min(8, 'password must be 8 letters or more'),
}).required();

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (values: any) => {
        try {
            const response = await login(values.username, values.password);

            if (response.status === 200) {
                localStorage.setItem('token', JSON.stringify(response.data));
                
                setUser(response.data.user);
                toast.success('login successful');

                router.replace('/');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'incorrect username or password';
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-green-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-900">Acacia</h1>
                    <p className="text-emerald-600 text-sm mt-2">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
                </div>

                {/* Username Field */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-emerald-900 mb-1">Username</label>
                    <input
                        {...register('username')}
                        placeholder="กรอกชื่อผู้ใช้งาน"
                        className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${errors.username ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-emerald-500'
                            }`}
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-emerald-900 mb-1">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-emerald-500'
                            }`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 disabled:bg-emerald-300"
                >
                    {isSubmitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
    );
}