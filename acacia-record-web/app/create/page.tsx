'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { http } from '../services/http.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth';

const schema = yup.object({
  name: yup.string().required('Required'),
  serialNumber: yup.string().required('Required'),
  checks: yup.array().of(
    yup.object({
      checkpointName: yup.string().required('Required'),
      status: yup.string().oneOf(['NORMAL', 'WARNING', 'CRITICAL']).required('Required'),
    })
  ).min(1, 'At least 1 check'),
}).required();

export default function CreateHardwarePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { 
      checks: [{ checkpointName: '', status: 'NORMAL' }] 
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "checks" });

  const watchedChecks = watch("checks");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'bg-green-100 text-green-700 border-green-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const onSubmit = async (data: any) => {
    if (!user?.id) {
      toast.error("User session not found. Please login again.");
      return;
    }
    setLoading(true);
    const payload = {
      ...data,
      userId: user.id
    };
    try {
      // console.log(user);
      // console.log(user?.id);
      // const currentData = watch(); 
      console.log("This is my JSON right now:", JSON.stringify(payload, null, 2));
      await http.post('/v1/hardwares', payload);
      toast.success('Saved Hardware Record');
      router.push('/');
    } catch (error) {
      toast.error('Error saving data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="bg-green-700 px-6 py-4 flex justify-between items-center text-sm">
          <h1 className="text-white font-bold tracking-tight uppercase">New Hardware</h1>
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">CANCEL</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Hardware Info Section */}
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

          {/* Checkpoints Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Checkpoints</span>
              <button 
                type="button" 
                onClick={() => append({ checkpointName: '', status: 'NORMAL' })}
                className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
              >
                + ADD ROW
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {fields.map((field, index) => {
                const currentStatus = (watchedChecks || [])[index]?.status || 'NORMAL';
                
                return (
                  <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 group">
                    <input
                      {...register(`checks.${index}.checkpointName`)}
                      placeholder="e.g. Battery"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-white focus:border-emerald-400 outline-none shadow-sm transition-all"
                    />
                    
                    {/* 4. Apply dynamic colors to the Select */}
                    <select
                      {...register(`checks.${index}.status`)}
                      className={`text-[10px] font-black px-3 py-2 rounded-lg border outline-none shadow-sm cursor-pointer transition-all uppercase tracking-tighter ${getStatusColor(currentStatus)}`}
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="WARNING">WARNING</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>

                    {fields.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)} 
                        className="text-gray-300 hover:text-red-500 transition-colors px-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:bg-gray-200 active:scale-[0.98]"
          >
            {loading ? 'SAVING...' : 'SAVE HARDWARE RECORD'}
          </button>
        </form>
      </div>
    </div>
  );
}