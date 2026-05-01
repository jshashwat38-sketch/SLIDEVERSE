"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Eye, Trash2, Search, Filter, Phone, Mail, Award, Download, AlertCircle } from "lucide-react";
import { getOrders, updateOrderStatus, deleteOrder } from "@/actions/orderActions";
import { toast } from "react-hot-toast";

export default function CustomOrdersDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    
    // Parse orders that start with CUSTOM_PPT_SPECS|
    const parsedOrders = data
      .filter((o: any) => o.product && o.product.startsWith("CUSTOM_PPT_SPECS|"))
      .map((o: any) => {
        try {
          const jsonStr = o.product.replace("CUSTOM_PPT_SPECS|", "");
          const specs = JSON.parse(jsonStr);
          return {
            ...o,
            specs
          };
        } catch (e) {
          return {
            ...o,
            specs: { topic: o.product, fullName: o.customer, email: o.email }
          };
        }
      });
      
    setOrders(parsedOrders);
    setIsLoading(false);
  };

  const updateCustomStatus = async (id: string, newStatus: string, currentSpecs: any) => {
    const updatedSpecs = { ...currentSpecs, orderStatus: newStatus };
    const serialized = `CUSTOM_PPT_SPECS|${JSON.stringify(updatedSpecs)}`;
    
    setOrders(orders.map(order => 
      order.id === id ? { ...order, specs: updatedSpecs } : order
    ));
    
    // Update state via updateOrderStatus or a custom payload
    const res = await updateOrderStatus(id, serialized);
    if (!res.success) {
      toast.error("Failed to update status");
      fetchOrders();
    } else {
      toast.success(`Request state: ${newStatus}`);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, specs: updatedSpecs });
      }
    }
  };

  // Filters logic
  const filteredOrders = orders.filter((o) => {
    const specs = o.specs || {};
    const matchesSearch = 
      (o.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || 
      (specs.orderStatus || "New Request").toLowerCase() === statusFilter.toLowerCase();
      
    const matchesLang = 
      languageFilter === "all" || 
      (specs.language || "english").toLowerCase() === languageFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesLang;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter">
            Custom PPT <span className="text-primary neon-text">Requests</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Coordinate custom build deliveries and operational benchmarks.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search specs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-zinc-100 dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white text-xs font-black uppercase focus:outline-none focus:border-primary/40 w-full md:w-64"
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-100 dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white text-xs font-black uppercase cursor-pointer focus:outline-none focus:border-primary/40"
          >
            <option value="all">All States</option>
            <option value="New Request">New Request</option>
            <option value="Reviewing">Reviewing</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Details">Awaiting Details</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select 
            value={languageFilter} 
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-3 bg-zinc-100 dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white text-xs font-black uppercase cursor-pointer focus:outline-none focus:border-primary/40"
          >
            <option value="all">Languages</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-card rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 dark:bg-white/5 border-b border-zinc-200 dark:border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                  <th className="p-8">Topic / Client</th>
                  <th className="p-8">Details</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 font-black uppercase tracking-widest text-xs animate-pulse">Loading Custom Requirements...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 font-black uppercase tracking-widest text-xs">No matching requests.</td>
                  </tr>
                ) : filteredOrders.map((order) => {
                  const specs = order.specs || {};
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-8">
                        <div className="font-black text-zinc-900 dark:text-white text-base tracking-tight uppercase italic mb-1">{specs.topic || "Unknown Topic"}</div>
                        <div className="text-zinc-500 text-xs font-bold">{order.customer}</div>
                      </td>
                      <td className="p-8">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Slides: <span className="text-primary">{specs.slides || "N/A"}</span></div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deadline: <span className="text-white">{specs.deadline || "N/A"}</span></div>
                      </td>
                      <td className="p-8">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          (specs.orderStatus || 'New Request') === 'Completed' || (specs.orderStatus || 'New Request') === 'Delivered'
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : (specs.orderStatus || 'New Request') === 'Cancelled'
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-primary/10 border-primary/20 text-primary'
                        }`}>
                          {specs.orderStatus || 'New Request'}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 hover:bg-primary/20 bg-primary/10 border border-primary/20 rounded-xl text-primary font-black text-xs uppercase tracking-wider transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Drawer */}
        <div className="bg-card dark:bg-[#09090C] border border-zinc-200 dark:border-white/5 rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            Request Info
          </h2>

          {selectedOrder ? (
            <div className="space-y-6">
              <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Topic / Purpose</span>
                <span className="text-zinc-900 dark:text-white font-black text-lg uppercase italic tracking-tight">{selectedOrder.specs.topic}</span>
                <span className="text-xs text-primary font-bold uppercase tracking-widest">{selectedOrder.specs.purpose}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Slides</span>
                  <span className="text-zinc-900 dark:text-white font-black text-sm">{selectedOrder.specs.slides}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Style</span>
                  <span className="text-zinc-900 dark:text-white font-black text-sm uppercase">{selectedOrder.specs.style}</span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Customer Specs</span>
                <div className="flex items-center gap-3 text-xs text-zinc-900 dark:text-white">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">{selectedOrder.email}</span>
                </div>
                {selectedOrder.specs.phone && (
                  <div className="flex items-center gap-3 text-xs text-zinc-900 dark:text-white">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span>{selectedOrder.specs.phone}</span>
                  </div>
                )}
              </div>

              {selectedOrder.specs.notes && (
                <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Extra Notes</span>
                  <p className="text-zinc-600 dark:text-zinc-300 text-xs font-semibold leading-relaxed">{selectedOrder.specs.notes}</p>
                </div>
              )}

              {selectedOrder.specs.fileAttached && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                    <Download className="w-4 h-4 text-primary" />
                    <span className="truncate max-w-[120px]">{selectedOrder.specs.fileName || "Attachment"}</span>
                  </div>
                  <button 
                    onClick={() => toast.success("Retrieving file payload...")}
                    className="bg-primary hover:bg-white text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
                  >
                    Get File
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-zinc-200 dark:border-white/5">
                <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Update Status</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Reviewing", "In Progress", "Awaiting Details", "Completed", "Delivered", "Cancelled"].map((st) => (
                    <button 
                      key={st}
                      onClick={() => updateCustomStatus(selectedOrder.id, st, selectedOrder.specs)}
                      className={`text-[9px] font-black uppercase tracking-widest py-2.5 rounded-xl border transition-all ${
                        selectedOrder.specs.orderStatus === st
                          ? "bg-primary border-primary text-black"
                          : "border-zinc-200 dark:border-white/5 hover:border-primary/40 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4 text-zinc-600">
              <AlertCircle className="w-12 h-12 opacity-20" />
              <span className="text-xs font-black uppercase tracking-widest">Select an order to manage</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
