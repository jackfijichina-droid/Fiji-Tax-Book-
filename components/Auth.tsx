
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? 'Fiji Merchant' : formData.name,
      email: formData.email,
      role: UserRole.BOSS,
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">🇫🇯</div>
        <h1 className="text-3xl font-black text-white tracking-tighter">Fiji Tax Book</h1>
        <p className="text-slate-400 font-medium">Simplify your business compliance</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            JOIN NOW
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required 
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
                placeholder="Business Owner Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required 
              type="email"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
              placeholder="name@company.fj"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              required 
              type="password"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-500 outline-none font-bold"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button className="w-full py-5 bg-sky-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95 mt-4">
            {isLogin ? 'Welcome Back' : 'Start My Free Book'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Protected by Fiji Business Security Standards.
        </p>
      </div>

      <div className="mt-12 flex gap-8">
        <div className="text-center">
          <div className="text-white font-black text-xl">100+</div>
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">SMEs In Fiji</div>
        </div>
        <div className="text-center border-l border-slate-800 pl-8">
          <div className="text-white font-black text-xl">100%</div>
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">FRCS Compliant</div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
