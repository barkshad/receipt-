
import React from 'react';
import { ReceiptData } from '../types';
import { Trash2, ExternalLink, User } from 'lucide-react';

interface Props {
  items: ReceiptData[];
  onView: (data: ReceiptData) => void;
  onDelete: (id: string) => void;
}

const RecentReceipts: React.FC<Props> = ({ items, onView, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
          <Trash2 className="text-white/20" size={32} />
        </div>
        <p className="text-white/40 font-medium">No receipts found in history.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((receipt) => {
        const total = receipt.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) * (1 + receipt.taxRate / 100);
        
        return (
          <div key={receipt.id} className="glass p-5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  {receipt.customerName || 'Unknown Customer'}
                </h4>
                <p className="text-xs text-white/40">{receipt.date} • {receipt.items.length} Items</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-black text-white">{receipt.currency} {total.toFixed(2)}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onView(receipt)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all"
                >
                  <ExternalLink size={16} />
                </button>
                <button 
                  onClick={() => onDelete(receipt.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentReceipts;
