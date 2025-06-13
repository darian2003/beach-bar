export async function submitOrder(umbrellaId: string, items: { itemId: number; quantity: number }[]) {
    const res = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        umbrellaId,
        items,
      }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to submit order");
    }
  
    return res.json();
  }
  
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
  