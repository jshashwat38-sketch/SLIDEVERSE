"use client";

import { Download, Users } from "lucide-react";

export default function AdminUsers() {
  const users = [
    { id: "USR-01", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", joined: "Oct 12, 2023", orders: 3 },
    { id: "USR-02", name: "Priya Desai", email: "priya@example.com", phone: "+91 8765432109", joined: "Nov 05, 2023", orders: 1 },
    { id: "USR-03", name: "Amit Patel", email: "amit@example.com", phone: "+91 7654321098", joined: "Jan 22, 2024", orders: 0 },
    { id: "USR-04", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 6543210987", joined: "Feb 10, 2024", orders: 5 },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">User <span className="text-primary neon-text">Directory</span></h1>
          <p className="text-zinc-500 mt-2 font-medium">Export and analyze your customer database and marketing leads.</p>
        </div>
        <button 
          className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,0,0.2)] hover:shadow-[0_0_25px_rgba(212,255,0,0.4)] hover:-translate-y-0.5 uppercase tracking-widest text-sm"
        >
          <Download className="w-5 h-5" />
          Export Database
        </button>
      </div>

      <div className="bg-card rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden mb-12 relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_10px_rgba(212,255,0,0.1)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Active Operatives ({users.length})</h2>
            <p className="text-sm text-zinc-500 font-medium">Total registered entities within the Slideverse network.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                <th className="p-8">Operative Identity</th>
                <th className="p-8">Communication Channel</th>
                <th className="p-8">System Registration</th>
                <th className="p-8">Acquisition History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-white uppercase tracking-wider text-sm group-hover:text-primary transition-colors italic">{user.name}</div>
                    <div className="text-zinc-600 text-[10px] mt-1 font-mono uppercase tracking-widest">{user.id}</div>
                  </td>
                  <td className="p-8">
                    <div className="text-white font-medium text-sm">{user.email}</div>
                    <div className="text-zinc-500 text-xs mt-1 font-mono">{user.phone}</div>
                  </td>
                  <td className="p-8">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs border border-white/10 px-3 py-1.5 rounded-lg bg-black/20">
                      {user.joined}
                    </span>
                  </td>
                  <td className="p-8">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                      {user.orders} Acquisitions
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
