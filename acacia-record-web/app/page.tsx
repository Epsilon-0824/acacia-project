"use client"

import { useState, useEffect } from 'react';
import { http } from './services/http.service';
import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function HardwareTable() {
  const [hardwares, setHardwares] = useState([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchData = async () => {
    try {
      const res = await http.get('/v1/hardwares');
      setHardwares(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // --- Action Handlers ---
  const handleEdit = (e: React.MouseEvent, id: number) => {
    router.push(`/hardwares/${id}/edit`)
    e.stopPropagation();
    console.log("Edit hardware:", id);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Do you sure to delete this hardwar?")) {
      try {
        await http.delete(`/v1/hardwares/${id}`);
        fetchData();
        toast.error('hardware deleted')
      } catch (err) {
        alert("ไม่สามารถลบข้อมูลได้");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#4dac71] text-white">
            <tr>
              <th className="p-4 uppercase text-xs font-bold tracking-wider">Hardware Name</th>
              <th className="p-4 uppercase text-xs font-bold tracking-wider">Serial Number</th>
              <th className="p-4 uppercase text-xs font-bold tracking-wider text-center">Created</th>
              <th className="p-4 uppercase text-xs font-bold tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hardwares.map((hw: any) => (
              <React.Fragment key={hw.id}>
                {/* Main Row */}
                <tr
                  className={`hover:bg-green-50/50 cursor-pointer transition-colors ${expandedRow === hw.id ? 'bg-green-50/30' : ''}`}
                  onClick={() => toggleRow(hw.id)}
                >
                  <td className="p-4 font-medium text-gray-900">{hw.name}</td>
                  <td className="p-4 text-gray-600 font-mono text-sm">{hw.serialNumber}</td>
                  <td className="p-4 text-center text-gray-500 text-sm">{formatDate(hw.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={(e) => handleEdit(e, hw.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(e, hw.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expandable Section */}
                {expandedRow === hw.id && (
                  <tr className="bg-gray-50/50 animate-in slide-in-from-top-1 duration-200">
                    <td colSpan={4} className="p-6 border-l-4 border-emerald-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hw.checks?.map((check: any) => (
                          <div key={check.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <div>
                              <p className="text-gray-800 font-semibold text-sm">{check.checkpointName}</p>
                            </div>
                            <div>
                              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                                check.status === 'NORMAL' ? 'bg-green-100 text-green-700' :
                                check.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {check.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => router.push('/create')}
        title="เพิ่มอุปกรณ์ใหม่"
        className="fixed bottom-10 right-10 w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-[60] group"
      >
        {/* Plus Icon */}
        <svg 
          className="w-8 h-8 transition-transform group-hover:rotate-90" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        
        {/* Optional Hover Label */}
        <span className="absolute right-20 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          add new hardware
        </span>
      </button>
    </div>
  );
}