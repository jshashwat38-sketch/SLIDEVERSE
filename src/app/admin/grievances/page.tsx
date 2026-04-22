"use client";

import { useEffect, useState } from "react";
import { getGrievances, deleteGrievance } from "@/actions/adminActions";
import { MessageSquare, Trash2, Calendar, Mail, User, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    const data = await getGrievances();
    setGrievances(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transmission record?")) return;
    const res = await deleteGrievance(id);
    if (res.success) {
      toast.success("Record purged from system.");
      fetchGrievances();
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[1px] bg-primary/40" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Intelligence Feed</span>
          </div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Customer <span className="text-primary">Grievances</span></h1>
        </div>
        <div className="bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl">
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Transmissions: </span>
          <span className="text-primary font-black ml-2">{grievances.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500 uppercase tracking-widest animate-pulse font-bold">Scanning frequencies...</div>
      ) : grievances.length === 0 ? (
        <div className="py-32 text-center bg-white/[0.02] border border-dashed border-white/5 rounded-[3rem]">
          <MessageSquare className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No incoming transmissions detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {grievances.map((g: any) => (
            <div key={g.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 hover:border-primary/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <User className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Identity Protocol</span>
                      </div>
                      <div className="text-xl text-white font-black italic uppercase tracking-tight">{g.name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Relay Endpoint</span>
                      </div>
                      <div className="text-lg text-primary font-bold tracking-tight">{g.email}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <MessageSquare className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Payload</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-8 rounded-3xl text-zinc-300 text-lg leading-relaxed italic font-medium">
                      "{g.message}"
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-6 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end text-zinc-600 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Timestamp</span>
                    </div>
                    <div className="text-white font-bold text-xs uppercase tracking-widest">{new Date(g.createdAt).toLocaleDateString()}</div>
                    <div className="text-zinc-500 font-bold text-[10px] mt-1">{new Date(g.createdAt).toLocaleTimeString()}</div>
                  </div>

                  <button 
                    onClick={() => handleDelete(g.id)}
                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                    title="Purge Record"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">
                <span>Ref Code: {g.id}</span>
                <span className="flex items-center gap-2">
                  <Clock className="w-2 h-2" />
                  Status: <span className="text-primary">{g.status || 'Pending'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
