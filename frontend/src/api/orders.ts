export const submitOrder = async (umbrellaId: string, items: { itemId: number; quantity: number }[]) => {
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ umbrellaId, items }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit order');
  }

  return response.json();
};

export async function fetchAllOrders() {
  try {
      console.log("Attempting to fetch orders...");
      const res = await fetch("http://localhost:3000/api/orders");
  
      if (!res.ok) {
          console.error("Response not OK:", res.status, res.statusText);
          throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      console.log("Fetched orders:", data);
      return data;
  } catch (error) {
      console.error("Error in fetchAllOrders:", error);
      throw error;
  }
}

export async function completeOrder(orderId: string) {
  const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "completed"
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to complete order");
  }

  return res.json();
}
  