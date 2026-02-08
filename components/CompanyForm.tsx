
import React, { useState } from 'react';
import { Company } from '../types';
import { VAT_RATE_FIJI } from '../constants';

interface CompanyFormProps {
  onSave: (company: Company) => void;
  onCancel: () => void;
  initialData?: Company;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    name: initialData?.name || '',
    tin: initialData?.tin || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    vatRegistered: initialData?.vatRegistered ?? true,
    vatRate: initialData?.vatRate || VAT_RATE_FIJI,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl mx-auto">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {initialData ? 'Update Business Profile' : 'Register New Business Entity'}
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
          Official FRCS Compliance Details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Business Name</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
              placeholder="e.g. Bula Trading Limited"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxpayer Identification Number (TIN)</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-mono"
              placeholder="00-00000-0-0"
              value={formData.tin}
              onChange={e => setFormData({ ...formData, tin: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
              placeholder="+679 000 0000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Email</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
              placeholder="finance@yourbusiness.fj"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Business Address</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-medium text-sm"
              placeholder="Street, Town, City, Fiji Islands"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 py-4 px-6 bg-sky-50/50 rounded-2xl border-2 border-sky-100">
            <input
              type="checkbox"
              id="vatReg"
              className="w-6 h-6 rounded-lg text-sky-600 focus:ring-sky-500 cursor-pointer"
              checked={formData.vatRegistered}
              onChange={e => setFormData({ ...formData, vatRegistered: e.target.checked })}
            />
            <label htmlFor="vatReg" className="cursor-pointer">
              <span className="text-sm font-black text-slate-700 block">VAT Registered Business</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Checking this applies {(formData.vatRate * 100).toFixed(1)}% VAT to records</p>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-sky-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95"
          >
            {initialData ? 'Update Business' : 'Register Business'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
