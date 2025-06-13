import React from "react";

type Props = {
  order: {
    id: string;
    umbrellaId: string;
    createdAt: string;
    items: {
      name: string;
      quantity: number;
    }[];
  };
  onComplete: () => void;
  isCompleted: boolean;
};

const OrderCard: React.FC<Props> = ({ order, onComplete, isCompleted }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${
        isCompleted 
          ? 'bg-red-50 border-red-200' 
          : 'bg-white border-gray-200 hover:shadow-md transition-shadow'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">Umbrella #{order.umbrellaId}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Complete
          </button>
        )}
      </div>
      <div className="space-y-1">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="font-medium">x{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
