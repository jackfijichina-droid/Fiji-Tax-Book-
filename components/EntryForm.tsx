
import React, { useState, useRef } from 'react';
import { EntryType, TaxEntry, Customer, Supplier, Company } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, VAT_RATE_FIJI } from '../constants';
import { performOCR } from '../services/geminiService';

interface EntryFormProps {
  type: EntryType;
  company: Company;
  contacts: (Customer | Supplier)[];
  onAdd: (entry: TaxEntry) => void;
  onCancel: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ type, company, contacts, onAdd, onCancel }) => {
  const [loadingOCR, setLoadingOCR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    invoiceNo: '',
    counterpartyId: '', // Selected from list
    newCounterpartyName: '', // If not in list
    newCounterpartyTin: '',
    date: new Date().toISOString().split('T')[0],
    subtotal: '',
    vatAmount: '',
    totalAmount: '',
    category: type === EntryType.INCOME ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
  });

  const calculateFromTotal = (total: number) => {
    const vat = (total * (company.vatRate / (1 + company.vatRate)));
    const sub = total - vat;
    return { vat: vat.toFixed(2), sub: sub.toFixed(2) };
  };

  const calculateFromSubtotal = (sub: number) => {
    const vat = sub * company.vatRate;
    const total = sub + vat;
    return { vat: vat.toFixed(2), total: total.toFixed(2) };
  };

  const handleTotalChange = (val: string) => {
    const num = parseFloat(val) || 0;
    const { vat, sub } = calculateFromTotal(num);
    setFormData(prev => ({ ...prev, totalAmount: val, vatAmount: vat, subtotal: sub }));
  };

  const handleSubtotalChange = (val: string) => {
    const num = parseFloat(val) || 0;
    const { vat, total } = calculateFromSubtotal(num);
    setFormData(prev => ({ ...prev, subtotal: val, vatAmount: vat, totalAmount: total }));
  };

  const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingOCR(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await performOCR(base64, type);
        
        const total = result.totalAmount || 0;
        const { vat, sub } = calculateFromTotal(total);

        setFormData(prev => ({
          ...prev,
          invoiceNo: result.invoiceNo || '',
          newCounterpartyName: result.counterpartyName || '',
          newCounterpartyTin: result.tin || '',
          date: result.date || prev.date,
          totalAmount: total > 0 ? total.toString() : '',
          vatAmount: vat,
          subtotal: sub,
          category: result.suggestedCategory || prev.category
        }));
        setLoadingOCR(false);
      };
    } catch (error) {
      alert("Scan failed. Manual entry required.");
      setLoadingOCR(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: TaxEntry = {
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      type,
      counterpartyId: formData.counterpartyId || 'NEW', // Logic: handle new creation in parent
      invoiceNo: formData.invoiceNo,
      date: formData.date,
      subtotal: parseFloat(formData.subtotal) || 0,
      vatAmount: parseFloat(formData.vatAmount) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      category: formData.category,
    };
    onAdd(entry);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            New {type === EntryType.INCOME ? 'Sales Invoice' : 'Purchase Expense'}
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Entity: {company.name}</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loadingOCR}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all disabled:opacity-50"
        >
          {loadingOCR ? 'Scanning...' : '📸 OCR Scan'}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleOCR} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type === EntryType.INCOME ? 'Select Customer' : 'Select Supplier'}</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
                value={formData.counterpartyId}
                onChange={e => setFormData({...formData, counterpartyId: e.target.value})}
              >
                <option value="">-- Choose Contact --</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name} (TIN: {c.tin})</option>)}
                <option value="NEW">+ Create New Contact</option>
              </select>
            </div>

            {formData.counterpartyId === 'NEW' && (
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                <input 
                  placeholder="New Contact Name" 
                  className="w-full px-4 py-2 bg-white border border-sky-100 rounded-xl text-sm outline-none"
                  value={formData.newCounterpartyName}
                  onChange={e => setFormData({...formData, newCounterpartyName: e.target.value})}
                />
                <input 
                  placeholder="Contact TIN (e.g. 12-345-6)" 
                  className="w-full px-4 py-2 bg-white border border-sky-100 rounded-xl text-sm outline-none font-mono"
                  value={formData.newCounterpartyTin}
                  onChange={e => setFormData({...formData, newCounterpartyTin: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
              <input type="date" required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref #</label>
              <input required placeholder="INV-001" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} />
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net (Subtotal)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-sky-500 outline-none" value={formData.subtotal} onChange={e => handleSubtotalChange(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VAT ({(company.vatRate * 100).toFixed(1)}%)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input disabled className="w-full pl-8 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold" value={formData.vatAmount} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Grand Total</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 font-bold">$</span>
                <input required type="number" step="0.01" className="w-full pl-8 pr-4 py-3 bg-white border-2 border-sky-500 rounded-xl focus:ring-4 focus:ring-sky-100 outline-none font-black text-xl" value={formData.totalAmount} onChange={e => handleTotalChange(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95">Save Document</button>
          <button type="button" onClick={onCancel} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all">Discard</button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
