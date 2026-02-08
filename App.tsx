
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import CompanyForm from './components/CompanyForm';
import { Company, Customer, Supplier, TaxEntry, EntryType, UserRole, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.BOSS);
  
  // Entities State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState('');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [entries, setEntries] = useState<TaxEntry[]>([]);
  
  const [showEntryForm, setShowEntryForm] = useState<EntryType | null>(null);
  const [isRegisteringCompany, setIsRegisteringCompany] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('fiji_tax_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedData = localStorage.getItem('fiji_tax_full_state');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCompanies(parsed.companies || []);
      setActiveCompanyId(parsed.activeCompanyId || (parsed.companies?.[0]?.id || ''));
      setEntries(parsed.entries || []);
      setCustomers(parsed.customers || []);
      setSuppliers(parsed.suppliers || []);
    }
  }, []);

  // Save State to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fiji_tax_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fiji_tax_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('fiji_tax_full_state', JSON.stringify({ 
        companies, 
        activeCompanyId, 
        entries, 
        customers, 
        suppliers 
      }));
    }
  }, [companies, activeCompanyId, entries, customers, suppliers]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setUserRole(user.role);
    // If no companies, force to register
    if (companies.length === 0) {
      setIsRegisteringCompany(true);
      setActiveTab('register_company');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    // We keep data in local storage for demo purposes, but in real app we might clear it
  };

  const handleRegisterCompany = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
    setActiveCompanyId(newCompany.id);
    setIsRegisteringCompany(false);
    setActiveTab('dashboard');
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setActiveTab('settings');
  };

  const handleAddEntry = (entry: TaxEntry) => {
    setEntries(prev => [entry, ...prev]);
    setShowEntryForm(null);
  };

  const handleCompanySwitch = (id: string) => {
    if (id === 'ADD_NEW') {
      setIsRegisteringCompany(true);
      setActiveTab('register_company');
    } else {
      setActiveCompanyId(id);
      setIsRegisteringCompany(false);
      if (activeTab === 'register_company') {
        setActiveTab('dashboard');
      }
    }
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId);
  const currentCompanyEntries = entries.filter(e => e.companyId === activeCompanyId);

  // If not logged in, show Auth screen
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'register_company' || (isRegisteringCompany && companies.length === 0)) {
      return (
        <div className="py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800">Setup Your Business Profile</h2>
            <p className="text-slate-500 mt-2">Let's get your tax information ready for FRCS filing.</p>
          </div>
          <CompanyForm 
            onSave={handleRegisterCompany} 
            onCancel={() => {
              if (companies.length > 0) {
                setIsRegisteringCompany(false);
                setActiveTab('dashboard');
              } else {
                handleLogout();
              }
            }} 
          />
        </div>
      );
    }

    if (!activeCompany) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard entries={currentCompanyEntries} alerts={[]} />;
      
      case 'income':
      case 'expense':
        const type = activeTab === 'income' ? EntryType.INCOME : EntryType.EXPENSE;
        const filtered = currentCompanyEntries.filter(e => e.type === type);
        const contacts = type === EntryType.INCOME ? customers : suppliers;

        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{type === EntryType.INCOME ? 'Sales Ledger' : 'Expense Ledger'}</h2>
                <p className="text-slate-500 font-medium">Managing records for <span className="text-sky-600 font-bold">{activeCompany.name}</span></p>
              </div>
              {userRole !== UserRole.ACCOUNTANT && (
                <button 
                  onClick={() => setShowEntryForm(type)}
                  className={`px-6 py-3 rounded-2xl text-white font-black shadow-lg transition-all active:scale-95 ${
                    type === EntryType.INCOME ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-100 hover:bg-rose-700'
                  }`}
                >
                  + Add New Record
                </button>
              )}
            </div>

            {showEntryForm === type && (
              <EntryForm 
                type={type}
                company={activeCompany}
                contacts={contacts}
                onAdd={handleAddEntry}
                onCancel={() => setShowEntryForm(null)}
              />
            )}

            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Contact / Ref</th>
                    <th className="px-8 py-5 text-right">Net</th>
                    <th className="px-8 py-5 text-right">VAT</th>
                    <th className="px-8 py-5 text-right">Total (FJD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-600">{e.date}</td>
                      <td className="px-8 py-5">
                        <div className="font-black text-slate-800">{e.invoiceNo}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: {e.counterpartyId}</div>
                      </td>
                      <td className="px-8 py-5 text-right font-medium text-slate-500">${e.subtotal.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right font-bold text-sky-600/70">${e.vatAmount.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right">
                        <span className="inline-block px-3 py-1.5 bg-slate-50 rounded-xl font-black text-slate-900 group-hover:bg-white group-hover:shadow-sm transition-all">
                          ${e.totalAmount.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-bold">No records found for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-800">Contacts Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
                <h3 className="font-black text-emerald-600 mb-4 uppercase tracking-widest text-xs">Customers List</h3>
                <div className="space-y-3">
                  {customers.filter(c => c.companyId === activeCompanyId).map(c => <div key={c.id} className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">{c.name} <span className="text-[10px] block text-slate-400">TIN: {c.tin}</span></div>)}
                  {customers.filter(c => c.companyId === activeCompanyId).length === 0 && <p className="text-sm text-slate-400 italic">No customers added.</p>}
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
                <h3 className="font-black text-rose-600 mb-4 uppercase tracking-widest text-xs">Suppliers List</h3>
                <div className="space-y-3">
                  {suppliers.filter(s => s.companyId === activeCompanyId).map(s => <div key={s.id} className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">{s.name} <span className="text-[10px] block text-slate-400">TIN: {s.tin}</span></div>)}
                  {suppliers.filter(s => s.companyId === activeCompanyId).length === 0 && <p className="text-sm text-slate-400 italic">No suppliers added.</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
             <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Business Settings</h2>
                <p className="text-slate-500">Managing profile for <span className="font-bold">{activeCompany.name}</span></p>
              </div>
            </div>
            <CompanyForm 
              initialData={activeCompany} 
              onSave={handleUpdateCompany} 
              onCancel={() => setActiveTab('dashboard')} 
            />
          </div>
        );

      default:
        return <div className="p-20 text-center text-slate-300 font-black text-4xl uppercase tracking-tighter opacity-20">Coming Soon</div>;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} setActiveTab={setActiveTab} 
      userRole={userRole} setUserRole={setUserRole}
      companies={companies} activeCompanyId={activeCompanyId} setActiveCompanyId={handleCompanySwitch}
      currentUser={currentUser} onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
