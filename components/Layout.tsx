
import React from 'react';
import { UserRole, Company, User } from '../types';

interface LayoutProps {
  children: React.InternalSymbolName | React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  companies: Company[];
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, userRole, setUserRole, 
  companies, activeCompanyId, setActiveCompanyId, currentUser, onLogout
}) => {
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.BOSS, UserRole.STAFF, UserRole.ACCOUNTANT] },
    { id: 'income', label: 'Sales (Invoices)', icon: '💰', roles: [UserRole.BOSS, UserRole.STAFF, UserRole.ACCOUNTANT] },
    { id: 'expense', label: 'Purchases (Expenses)', icon: '💸', roles: [UserRole.BOSS, UserRole.STAFF, UserRole.ACCOUNTANT] },
    { id: 'contacts', label: 'Contacts', icon: '👥', roles: [UserRole.BOSS, UserRole.STAFF, UserRole.ACCOUNTANT] },
    { id: 'reports', label: 'Reports', icon: '📋', roles: [UserRole.BOSS, UserRole.ACCOUNTANT] },
    { id: 'settings', label: 'Settings', icon: '⚙️', roles: [UserRole.BOSS] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(userRole));
  const activeCompany = companies.find(c => c.id === activeCompanyId);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-black text-sky-600 flex items-center gap-2 mb-6">
            <span className="text-2xl">🇫🇯</span> Fiji Tax Book
          </h1>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active Business</label>
            <select 
              value={activeCompanyId}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-2.5 px-3 text-sm font-bold text-slate-800 outline-none focus:border-sky-500 transition-all"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="ADD_NEW">+ Register New Entity</option>
            </select>
            {activeCompany && (
              <p className="text-[10px] text-slate-400 mt-1 ml-1 font-mono">TIN: {activeCompany.tin}</p>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</span>
              <button 
                onClick={onLogout}
                className="text-[9px] font-black text-rose-500 uppercase hover:underline"
              >
                Logout
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-xs">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate">{userRole}</p>
              </div>
            </div>

            <select 
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value={UserRole.BOSS}>老板 (Boss)</option>
              <option value={UserRole.STAFF}>员工 (Staff)</option>
              <option value={UserRole.ACCOUNTANT}>会计 (Accountant)</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <h1 className="text-lg font-bold text-sky-600">Fiji Tax Book</h1>
          <div className="flex items-center gap-2">
            <select 
              value={activeCompanyId}
              onChange={(e) => setActiveCompanyId(e.target.value)}
              className="text-xs font-bold border rounded px-2 py-1"
            >
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={onLogout} className="text-xs text-rose-500 font-bold ml-2">Exit</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex border-t border-slate-200 bg-white sticky bottom-0 z-50 p-1">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-1 rounded-lg ${
                activeTab === item.id ? 'bg-sky-50 text-sky-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
