export interface OrderItem {
    id: string;
    quantity: number;
  }
  
  export interface CreateOrderRequest {
    umbrellaId: number;
    items: {
      itemId: string;
      quantity: number;
    }[];
  }

  export interface Order {
    id: string;
    umbrellaId: number;
    status: string;
    timestamp: string;
    items: OrderItem[];
  }