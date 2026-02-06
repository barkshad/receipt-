
import React from 'react';
import { ReceiptData } from '../types';

interface Props {
  data: ReceiptData;
}

const ReceiptCard: React.FC<Props> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;
  const changeDue = data.amountPaid > total ? data.amountPaid - total : 0;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="receipt-paper w-full p-6 md:p-10 font-sans text-sm relative border border-gray-200">
      {/* Header Section */}
      <div className="text-center border-b-2 border-black pb-6 mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 text-black">{data.shopName}</h2>
        <p className="text-[11px] text-gray-600 font-medium mb-1">{data.shopAddress}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Premium Sports & Fitness Gear</p>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-[12px]">
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="text-gray-400 uppercase font-bold w-16">Invoice:</span>
            <span className="font-mono font-bold text-black">{data.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 uppercase font-bold w-16">Date:</span>
            <span className="text-black">{formatDate(data.date)}</span>
          </div>
        </div>
        <div className="space-y-1 text-right border-l border-gray-100 pl-4">
          <p className="text-gray-400 uppercase font-bold text-[10px]">Customer Details</p>
          <p className="font-black text-black text-[13px]">{data.customerName || 'CASH SALE'}</p>
          <p className="text-gray-600 font-mono">{data.customerPhone || 'N/A'}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="mb-8">
        <div className="grid grid-cols-12 gap-2 font-black text-[11px] uppercase border-b border-black pb-2 mb-3 tracking-wider text-black">
          <span className="col-span-6">Description</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-4 text-right">Amount (KSH)</span>
        </div>
        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 text-[12px] text-black">
              <div className="col-span-6">
                <p className="font-bold leading-tight">{item.description || 'General Item'}</p>
                <p className="text-[10px] text-gray-400 font-mono">@{item.price.toLocaleString()}</p>
              </div>
              <span className="col-span-2 text-center font-mono">x{item.quantity}</span>
              <span className="col-span-4 text-right font-black">{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Section */}
      <div className="border-t border-gray-100 pt-6 flex flex-col items-end space-y-2">
        <div className="w-full md:w-3/5 space-y-1.5">
          <div className="flex justify-between text-gray-600">
            <span className="text-[11px] font-bold uppercase tracking-wide">Gross Subtotal</span>
            <span className="font-mono">{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="text-[11px] font-bold uppercase tracking-wide">VAT ({data.taxRate}%)</span>
            <span className="font-mono">{tax.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-lg font-black pt-3 border-t-2 border-black text-black">
            <span className="uppercase tracking-tighter">Net Total</span>
            <span className="font-mono">{data.currency} {total.toLocaleString()}</span>
          </div>

          <div className="pt-4 space-y-1 border-t border-dotted border-gray-300 mt-2">
             <div className="flex justify-between text-[12px] text-gray-500 font-bold">
                <span className="uppercase">Amount Paid</span>
                <span className="font-mono text-black">{data.amountPaid.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-[12px] text-green-600 font-bold">
                <span className="uppercase">Change Due</span>
                <span className="font-mono">KSH {changeDue.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer / Legal */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification</p>
              <p className="text-[9px] text-gray-400 font-mono">HASH: {btoa(data.id + total).slice(0, 16).toUpperCase()}</p>
              <div className="bg-black text-white px-2 py-0.5 inline-block text-[9px] font-black rounded uppercase">Verified E-Receipt</div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-black uppercase mb-1">Terms & Conditions</p>
              <p className="text-[9px] text-gray-500 max-w-[150px] leading-tight">Goods once sold are only returnable with original receipt within 7 days.</p>
           </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-end gap-[2px] h-6 opacity-80 mb-2">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="bg-black" style={{ width: `${(i % 3 === 0) ? 2 : 1}px`, height: `${40 + Math.random() * 60}%` }} />
            ))}
          </div>
          <p className="text-[10px] font-black text-black tracking-[0.2em] uppercase">Powered by Q-Beam POS</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
