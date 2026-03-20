'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray, Watch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { http } from '@/app/services/http.service';
import { useAuthStore } from '@/app/stores/auth';
import toast from 'react-hot-toast';

const schema = yup.object({
  id: yup.number().optional(),
  name: yup.string().required('Required'),
  serialNumber: yup.string().required('Required'),
  checks: yup.array().of(
    yup.object({
      id: yup.number().optional(),
      checkpointName: yup.string().required('Required'),
      status: yup.string().oneOf(['NORMAL', 'WARNING', 'CRITICAL']).required('Required'),
    })
  ).min(1),
}).required();

export default function EditHardwarePage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "checks" });
  const watchedChecks = watch("checks") || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'bg-green-100 text-green-700 border-green-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http.get(`/v1/hardwares/${id}`);
        reset(res.data); 
      } catch (err) {
        toast.error("Could not find record");
        router.push('/');
      }
    };
    if (id) fetchData();
  }, [id, reset, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const payload = { ...data, userId: user?.id };
    try {
      await http.patch(`/v1/hardwares/${id}`, payload);
      toast.success('Update successful');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header - Fixed to Green and says Edit */}
        <div className="bg-green-700 px-6 py-4 flex justify-between items-center text-sm">
          <h1 className="text-white font-bold tracking-tight uppercase">Edit Hardware</h1>
          <button type="button" onClick={() => router.back()} className="text-slate-200 hover:text-white transition-colors uppercase text-[10px] font-bold">CANCEL</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
              <input 
                {...register('name')} 
                placeholder="Hardware Name"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Serial</label>
              <input 
                {...register('serialNumber')} 
                placeholder="S/N"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 outline-none transition-all" 
              />
            </div>
          </div>

          <hr className="border-gray-50" />

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Checkpoints</span>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {fields.map((field, index) => {
                const currentStatus = watchedChecks[index]?.status || 'NORMAL';
                
                return (
                  <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 group">
                    <input
                      {...register(`checks.${index}.checkpointName`)}
                      placeholder="e.g. Battery"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-white focus:border-emerald-400 outline-none shadow-sm transition-all"
                    />
                    
                    <select
                      {...register(`checks.${index}.status`)}
                      className={`text-[10px] font-black px-3 py-2 rounded-lg border outline-none shadow-sm cursor-pointer transition-all uppercase tracking-tighter ${getStatusColor(currentStatus)}`}
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="WARNING">WARNING</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onSubmit={onSubmit}
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:bg-gray-200 active:scale-[0.98]"
          >
            {loading ? 'SAVING...' : 'UPDATE HARDWARE RECORD'}
          </button>
        </form>
      </div>
    </div>
  );
}