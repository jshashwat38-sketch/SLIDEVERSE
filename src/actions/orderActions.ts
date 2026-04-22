"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (error) throw error;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) throw error;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function saveOrder(order: any) {
  try {
    const newOrder = {
      id: order.id || `ORD-${Date.now()}`,
      customer: order.customer,
      email: order.email,
      product: order.product,
      amount: order.amount,
      status: order.status || "pending",
      date: order.date || new Date().toLocaleDateString(),
      payment_id: order.paymentId,
      razorpay_order_id: order.razorpayOrderId,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('orders').insert(newOrder);
    if (error) throw error;

    revalidatePath("/admin");
    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false, error: "Failed to save order" };
  }
}
