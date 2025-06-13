import React, { useEffect, useState } from "react";
import { fetchAllOrders, completeOrder } from "../api/orders";
import OrderCard from "../components/OrderCard";

type Order = {
  id: string;
  umbrellaId: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
  status: 'active' | 'completed';
};

const BarDashboard: React.FC = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 100_000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      console.log('Raw orders data:', data);
      // Split orders into active and completed
      const active = data.filter((order: Order) => order.status === 'active');
      const completed = data.filter((order: Order) => order.status === 'completed');
      console.log('Active orders:', active);
      console.log('Completed orders:', completed);
      setActiveOrders(active);
      setCompletedOrders(completed);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (orderId: string) => {
    try {
      await completeOrder(orderId);
      // Refresh orders to get the updated status
      await fetchOrders();
    } catch (err) {
      console.error("Failed to complete order", err);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🍹 Bar Dashboard</h1>
        <button
          onClick={fetchOrders}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Active Orders Column */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Active Orders</h2>
            <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {activeOrders.length === 0 ? (
                <p className="text-center text-gray-500">No active orders</p>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onComplete={() => handleComplete(order.id)}
                      isCompleted={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Completed Orders Column */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Completed Orders</h2>
            <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {completedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No completed orders</p>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onComplete={() => {}}
                      isCompleted={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarDashboard;
