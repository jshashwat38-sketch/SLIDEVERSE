"use client";

import { useState, useEffect } from "react";
import { Download, Users, Eye, X, Mail, Phone, Lock, Calendar, ShoppingBag, ShieldCheck, User as UserIcon, Trash2 } from "lucide-react";
import { getUsers, deleteUser } from "@/actions/authActions";
import { getOrders } from "@/actions/orderActions";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [allUsers, allOrders] = await Promise.all([getUsers(), getOrders()]);
      setUsers(allUsers);
      setOrders(allOrders);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getUserOrders = (email: string) => {
    return orders.filter(o => o.email?.toLowerCase() === email?.toLowerCase());
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUser(id);
    if (res.success) {
      toast.success("Identity successfully terminated.");
      setUsers(users.filter(u => u.id !== id));
      setUserToDelete(null);
    } else {
      toast.error(res.error || "Failed to terminate identity.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">User <span className="text-primary neon-text">Directory</span></h1>
          <p className="text-zinc-500 mt-2 font-medium italic">Monitor and manage all elite curator identities.</p>
        </div>
        <button 
          className="bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(197,165,114,0.2)] hover:shadow-[0_0_25px_rgba(197,165,114,0.4)] hover:-translate-y-0.5 uppercase tracking-widest text-sm italic"
        >
          <Download className="w-5 h-5" />
          Export Database
        </button>
      </div>

      <div className="bg-card rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden mb-12 relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_10px_rgba(197,165,114,0.1)]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Active Operatives ({users.length})</h2>
            <p className="text-sm text-zinc-500 font-medium italic">Total registered entities within the network.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center text-zinc-500 font-black uppercase tracking-[0.3em] animate-pulse">
              Retrieving encrypted user data...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                  <th className="p-8">Operative Identity</th>
                  <th className="p-8">Communication</th>
                  <th className="p-8">Registration</th>
                  <th className="p-8">Access Key</th>
                  <th className="p-8">Acquisitions</th>
                  <th className="p-8 text-right">Action</th>
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
                      <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] border border-white/10 px-3 py-1.5 rounded-lg bg-black/20">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-primary/40" />
                        <span className="text-white font-mono text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                          {user.password}
                        </span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                        {getUserOrders(user.email).length} Acquisitions
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-3 bg-white/5 hover:bg-primary hover:text-black rounded-xl transition-all text-zinc-400 border border-white/5 hover:border-primary group-hover:scale-110"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {userToDelete === user.id ? (
                          <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-300">
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="px-3 py-3 bg-red-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setUserToDelete(null)}
                              className="p-3 bg-white/10 text-zinc-400 rounded-xl hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setUserToDelete(user.id)}
                            className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all text-zinc-400 border border-white/5 hover:border-red-500 group-hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              
              <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                {/* Left Side: Profile */}
                <div className="w-full md:w-1/3 bg-white/5 p-10 border-r border-white/5 overflow-y-auto">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/30 shadow-[0_0_30px_rgba(197,165,114,0.2)]">
                      <UserIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedUser.name}</h3>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">Verified Curator</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Vault Identity</label>
                      <div className="flex items-center gap-3 text-white">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold truncate">{selectedUser.email}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Secure Link</label>
                      <div className="flex items-center gap-3 text-white">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold">{selectedUser.phone || "Not provided"}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 border-dashed">
                      <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Access Key (Pass)</label>
                      <div className="flex items-center gap-3 text-white">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono font-black">{selectedUser.password}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-2">Established</label>
                      <div className="flex items-center gap-3 text-white">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Activity & Forms */}
                <div className="flex-1 p-10 overflow-y-auto">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-widest">Acquisition Records</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="p-3 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {getUserOrders(selectedUser.email).length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-zinc-600 font-black uppercase tracking-widest text-xs italic">No acquisitions found in current epoch.</p>
                      </div>
                    ) : (
                      getUserOrders(selectedUser.email).map((order: any) => (
                        <div key={order.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-primary font-black border border-white/10 group-hover:border-primary/50 transition-all">
                              {order.product.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-black uppercase tracking-wider text-sm italic">{order.product}</div>
                              <div className="text-zinc-500 text-[10px] mt-1 font-mono uppercase tracking-widest">{order.id} | {order.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-primary font-black text-sm italic">₹{order.amount}</div>
                            <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
                              order.status === 'accepted' ? 'text-green-500' : 
                              order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Form Data Section */}
                  <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-widest">Encrypted Form Data</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Registration Endpoint</div>
                        <div className="text-zinc-300 font-bold text-xs uppercase tracking-wider truncate">{selectedUser.email}</div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Communication Link</div>
                        <div className="text-zinc-300 font-bold text-xs uppercase tracking-wider">{selectedUser.phone}</div>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                        <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Assigned Operative ID</div>
                        <div className="text-zinc-300 font-bold text-xs font-mono uppercase tracking-widest">{selectedUser.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
