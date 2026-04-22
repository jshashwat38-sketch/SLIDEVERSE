"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const dataFilePath = path.join(process.cwd(), "src", "data", "orders.json");

export async function getOrders() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const orders = await getOrders();
    const updatedOrders = orders.map((order: any) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    await fs.writeFile(dataFilePath, JSON.stringify(updatedOrders, null, 2));
    revalidatePath("/admin");
    return { success: true, orders: updatedOrders };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const orders = await getOrders();
    const filteredOrders = orders.filter((order: any) => order.id !== orderId);
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredOrders, null, 2));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function saveOrder(order: any) {
  try {
    const orders = await getOrders();
    const newOrder = {
      ...order,
      id: order.id || `ORD-${Date.now()}`,
      date: order.date || new Date().toLocaleDateString(),
      status: order.status || "pending",
    };
    
    orders.push(newOrder);
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2));
    revalidatePath("/admin");
    return { success: true, order: newOrder };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false, error: "Failed to save order" };
  }
}
