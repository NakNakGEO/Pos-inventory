import React from 'react';
import { X } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    paymentMethod: string;
    date: string;
  };
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="border-t border-b py-2 mb-4">
          <p className="text-sm text-gray-600">Date: {receiptData.date}</p>
        </div>
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left">Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between font-bold mb-2">
          <span>Total</span>
          <span>${receiptData.total.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600">Payment Method: {receiptData.paymentMethod}</p>
        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;