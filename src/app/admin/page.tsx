"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Eye, Trash2 } from "lucide-react";
import { getOrders, updateOrderStatus, deleteOrder } from "@/actions/orderActions";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    
    // Server update
    const res = await updateOrderStatus(id, newStatus);
    if (!res.success) {
      toast.error("Failed to update status");
      fetchOrders(); // Revert on failure
    } else {
      toast.success(`Order state updated: ${newStatus}`);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Delete request initiated for order:", id);
    const res = await deleteOrder(id);
    if (res.success) {
      toast.success("Transaction record purged.");
      setOrderToDelete(null);
      fetchOrders();
    } else {
      toast.error("Failed to purge record.");
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Order <span className="text-primary neon-text">Analytics</span></h1>
          <p className="text-zinc-500 mt-2 font-medium">Real-time tracking of platform acquisitions and distributions.</p>
        </div>
        <div className="flex gap-6">
          <div className="bg-card px-6 py-3 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4 text-xs font-black uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(197,165,114,0.8)]"></span>
            <span className="text-zinc-400">Inbound:</span>
            <span className="text-white">{orders.filter(o => o.status === 'pending').length}</span>
          </div>
          <div className="bg-card px-6 py-3 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4 text-xs font-black uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            <span className="text-zinc-400">Processed:</span>
            <span className="text-white">{orders.filter(o => o.status === 'accepted').length}</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                <th className="p-8">Transaction / Timestamp</th>
                <th className="p-8">Entity Details</th>
                <th className="p-8">Asset</th>
                <th className="p-8">Value</th>
                <th className="p-8">State</th>
                <th className="p-8 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-8">
                    <div className="font-mono text-white font-black italic tracking-tighter text-lg">{order.id}</div>
                    <div 
                      className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2"
                      suppressHydrationWarning
                    >
                      <Clock className="w-3 h-3 text-primary" />
                      {order.date}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="font-black text-white uppercase tracking-wider text-sm">{order.customer}</div>
                    <div className="text-zinc-500 text-xs mt-1 font-medium">{order.email}</div>
                    <div className="text-zinc-600 text-[10px] mt-1 font-mono uppercase tracking-widest">{order.phone}</div>
                  </td>
                  <td className="p-8">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs border border-white/10 px-3 py-1.5 rounded-lg bg-black/20">
                      {order.product}
                    </span>
                  </td>
                  <td className="p-8">
                    <span className="font-mono text-xl text-white font-black italic tracking-tighter">₹{order.amount}</span>
                  </td>
                  <td className="p-8">
                    {order.status === 'pending' && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(197,165,114,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Inbound
                      </span>
                    )}
                    {order.status === 'accepted' && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Check className="w-3 h-3" />
                        Deployed
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                        <X className="w-3 h-3" />
                        Terminated
                      </span>
                    )}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-3 text-zinc-500 hover:text-primary bg-white/5 hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/30" title="Inspect">
                        <Eye className="w-5 h-5" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateStatus(order.id, 'accepted')}
                            className="p-3 text-zinc-500 hover:text-primary bg-white/5 hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/30" title="Authorize Deployment">
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateStatus(order.id, 'rejected')}
                            className="p-3 text-zinc-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30" title="Deny Entry">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {orderToDelete === order.id ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                          <button 
                            onClick={() => handleDelete(order.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setOrderToDelete(null)}
                            className="p-2 bg-white/5 text-zinc-400 rounded-lg hover:text-white transition-all border border-white/5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setOrderToDelete(order.id)}
                          className="p-3 text-zinc-600 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30" title="Purge Record">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
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
