
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// Fix: Import DeadlineAlert and EntryType from types.ts
import { TaxEntry, DeadlineAlert, EntryType } from '../types';
import { UI_COLORS, VAT_RATE_FIJI } from '../constants';

interface DashboardProps {
  entries: TaxEntry[];
  alerts: DeadlineAlert[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries, alerts }) => {
  // Fix: Corrected property access from e.amount to e.totalAmount to match TaxEntry definition
  const totalIncome = entries.filter(e => e.type === EntryType.INCOME).reduce((sum, e) => sum + e.totalAmount, 0);
  const totalExpense = entries.filter(e => e.type === EntryType.EXPENSE).reduce((sum, e) => sum + e.totalAmount, 0);
  const estimatedVAT = entries.reduce((sum, e) => {
    return sum + (e.type === EntryType.INCOME ? e.vatAmount : -e.vatAmount);
  }, 0);

  // Mock chart data derived from entries
  const chartData = [
    { month: 'Oct', income: 4500, expense: 2100 },
    { month: 'Nov', income: 5200, expense: 3400 },
    { month: 'Dec', income: 3800, expense: 1900 },
    { month: 'Jan', income: totalIncome, expense: totalExpense },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bula! Here's your business summary</h2>
          <p className="text-slate-500">Keep your records clean, keep FRCS happy.</p>
        </div>
        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-sky-700 transition">
          Quick Report Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">💰</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12% vs last month</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Money In (Income)</p>
          <p className="text-2xl font-bold text-slate-800">FJD {totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-rose-50 rounded-lg text-rose-600">💸</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">+5% vs last month</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Money Out (Expenses)</p>
          <p className="text-2xl font-bold text-slate-800">FJD {totalExpense.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-sky-50 rounded-lg text-sky-600">📊</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Est. VAT Payable</p>
          <p className="text-2xl font-bold text-slate-800">FJD {estimatedVAT.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Calculated at {(VAT_RATE_FIJI * 100).toFixed(1)}% rate</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Income vs Expense Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={UI_COLORS.income} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={UI_COLORS.income} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="income" stroke={UI_COLORS.income} fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke={UI_COLORS.expense} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Top Spending Categories</h3>
              <button className="text-sky-600 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {['Stock Purchase', 'Electricity', 'Rent', 'Wages'].map((cat, i) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{cat}</span>
                    <span className="font-semibold text-slate-800">FJD {Math.floor(Math.random() * 1000 + 200)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-500 rounded-full" 
                      style={{ width: `${80 - (i * 15)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Reminders */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>🔔</span> Compliance Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  alert.status === 'urgent' ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-300'
                }`}>
                  <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-1">Due: {alert.dueDate}</p>
                  <button className="text-xs font-semibold text-sky-600 mt-2 hover:underline">
                    Action Now →
                  </button>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4 italic">No urgent alerts. Looking good!</p>
              )}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-md">
            <h3 className="font-bold mb-2">Pro Tip 💡</h3>
            <p className="text-sm text-indigo-100 mb-4">
              Did you know? Small businesses in Fiji with turnover under $100k can opt for simplified reporting. Check with your local tax office!
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition">
              Read FRCS Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
