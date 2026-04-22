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
  } catch { return []; }
}

export async function createOrder(orderData: any) {
  try {
    const newOrder = {
      id: `ord-${Date.now()}`,
      customer: orderData.customer,
      email: orderData.email,
      phone: orderData.phone,
      product: orderData.product,
      amount: Number(orderData.amount),
      status: "pending",
      date: new Date().toLocaleDateString(),
      razorpay_order_id: orderData.razorpayOrderId
    };

    const { error } = await supabase.from('orders').insert(newOrder);
    if (error) throw error;

    revalidatePath("/admin/orders");
    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Create order error:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrderStatus(id: string, status: string, paymentId?: string) {
  try {
    const updateData: any = { status };
    if (paymentId) updateData.payment_id = paymentId;

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Failed to update order status" };
  }
}
