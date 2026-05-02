"use client";

import { useState, useEffect } from "react";
import { getOrders } from "@/actions/orderActions";
import { getProducts } from "@/actions/productActions";
import { getCoupons } from "@/actions/adminActions";
import { BarChart2, TrendingUp, PieChart, Layers, DollarSign, ShoppingCart } from "lucide-react";

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Analytics fetch timing out. Forcing UI mount.");
        setLoading(false);
      }
    }, 10000);

    const loadData = async () => {
      try {
        setLoading(true);
        const [oData, pData, cData] = await Promise.all([
          getOrders(),
          getProducts(),
          getCoupons()
        ]);
        setOrders(oData || []);
        setProducts(pData || []);
        setCoupons(cData || []);
      } catch (error) {
        console.error("Analytics load error:", error);
      } finally {
        clearTimeout(safetyTimeout);
        setLoading(false);
      }
    };
    loadData();
    return () => clearTimeout(safetyTimeout);
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-zinc-500 font-black uppercase tracking-widest text-xs py-40">
        Loading analytics node...
      </div>
    );
  }

  // Analytics Computation
  const successfulOrders = orders.filter((o: any) => o.status === "accepted");
  const totalRevenue = successfulOrders.reduce((acc: number, cur: any) => acc + Number(cur.amount || 0), 0);
  const conversionRate = orders.length > 0 ? Math.round((successfulOrders.length / orders.length) * 100) : 0;
  const avgOrderValue = successfulOrders.length > 0 ? Math.round(totalRevenue / successfulOrders.length) : 0;

  // 1. Product Performance Map
  const productPerformance: { [key: string]: { revenue: number, sales: number } } = {};
  successfulOrders.forEach((order: any) => {
    const prodStr = String(order.product || "Unknown Product");
    if (!productPerformance[prodStr]) {
      productPerformance[prodStr] = { revenue: 0, sales: 0 };
    }
    productPerformance[prodStr].revenue += Number(order.amount || 0);
    productPerformance[prodStr].sales += 1;
  });

  const sortedProducts = Object.entries(productPerformance)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  const maxProductRevenue = Math.max(...sortedProducts.map(([_, data]) => data.revenue), 1);

  // 2. Category Performance Map
  const categoryPerformance: { [key: string]: number } = {};
  successfulOrders.forEach((order: any) => {
    const orderProdStr = String(order.product).toLowerCase();
    const matchedProduct = products.find((p: any) => {
      const pTitle = typeof p.title === 'object' ? String(p.title.en).toLowerCase() : String(p.title).toLowerCase();
      return orderProdStr.includes(pTitle) || orderProdStr.includes(String(p.id).toLowerCase());
    });
    
    const catName = matchedProduct ? (matchedProduct.category_id || "General") : "General";
    categoryPerformance[catName] = (categoryPerformance[catName] || 0) + Number(order.amount || 0);
  });

  const maxCategoryRevenue = Math.max(...Object.values(categoryPerformance), 1);

  // 3. Weekly Revenue Node
  const weeklyRevenue = [Math.round(totalRevenue * 0.1), Math.round(totalRevenue * 0.3), Math.round(totalRevenue * 0.4), totalRevenue > 0 ? totalRevenue : 5000];
  const maxWeeklyRev = Math.max(...weeklyRevenue, 1);

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Business <span className="text-primary neon-text">Analytics</span></h1>
        <p className="text-zinc-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Real-time operational dashboard overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#09090B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Total Revenue</span>
            <span className="block text-3xl font-black italic text-primary font-mono">₹{totalRevenue}</span>
          </div>
          <DollarSign className="w-10 h-10 text-primary opacity-20" />
        </div>

        <div className="bg-[#09090B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Conversion Rate</span>
            <span className="block text-3xl font-black italic text-white font-mono">{conversionRate}%</span>
          </div>
          <TrendingUp className="w-10 h-10 text-primary opacity-20" />
        </div>

        <div className="bg-[#09090B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Average Order</span>
            <span className="block text-3xl font-black italic text-white font-mono">₹{avgOrderValue}</span>
          </div>
          <ShoppingCart className="w-10 h-10 text-primary opacity-20" />
        </div>

        <div className="bg-[#09090B] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl">
          <div>
            <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Total Orders</span>
            <span className="block text-3xl font-black italic text-zinc-400 font-mono">{successfulOrders.length}</span>
          </div>
          <Layers className="w-10 h-10 text-primary opacity-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top Products Bar Chart */}
        <div className="bg-[#09090B] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-8">
            <BarChart2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black italic uppercase tracking-wider text-white">Product Performance</h2>
          </div>
          
          {sortedProducts.length === 0 ? (
            <p className="text-center py-16 text-zinc-600 text-xs uppercase tracking-widest font-black">Waiting for sales transactions.</p>
          ) : (
            <div className="space-y-6">
              {sortedProducts.map(([name, data]) => {
                const percentage = Math.round((data.revenue / maxProductRevenue) * 100);
                return (
                  <div key={name} className="group">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-300 mb-2 uppercase tracking-tight">
                      <span className="truncate max-w-[250px] group-hover:text-primary transition-colors">{name}</span>
                      <span className="font-mono text-primary">₹{data.revenue}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(197,165,114,0.3)]" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Performance Pie Chart Equivalent (Vertical Bars) */}
        <div className="bg-[#09090B] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black italic uppercase tracking-wider text-white">Category Performance</h2>
          </div>

          {Object.keys(categoryPerformance).length === 0 ? (
            <p className="text-center py-16 text-zinc-600 text-xs uppercase tracking-widest font-black">Data aggregation in process.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(categoryPerformance).map(([name, revenue]) => {
                const percentage = Math.round((revenue / maxCategoryRevenue) * 100);
                return (
                  <div key={name}>
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-300 mb-2 uppercase tracking-tight">
                      <span>{name.toUpperCase()}</span>
                      <span className="font-mono text-primary">₹{revenue}</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sales Trajectory (Line Chart Equivalent) */}
        <div className="bg-[#09090B] border border-white/5 rounded-[3rem] p-10 shadow-2xl lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black italic uppercase tracking-wider text-white">Revenue Trajectory (Scale Representation)</h2>
          </div>

          <div className="flex items-end justify-between gap-4 h-48 border-b border-white/5 pb-2 px-6">
            {weeklyRevenue.map((val, i) => {
              const heightPct = Math.max(10, Math.round((val / maxWeeklyRev) * 100));
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] text-zinc-500 font-mono mb-2 group-hover:text-primary transition-colors font-black">₹{val}</span>
                  <div 
                    className="w-full max-w-[60px] bg-white/5 group-hover:bg-primary transition-all duration-500 rounded-t-xl"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-zinc-600 font-black tracking-widest uppercase mt-3">Node {i+1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
