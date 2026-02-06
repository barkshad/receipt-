
import React from 'react';
import { ReceiptData } from '../types';
import { format } from 'date-fns';

interface Props {
  data: ReceiptData;
}

const ReceiptCard: React.FC<Props> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="receipt-paper w-full p-8 font-mono text-sm relative overflow-hidden">
      {/* Decorative dots for tear-off effect */}
      <div className="absolute top-0 left-0 right-0 h-1 flex justify-around opacity-20">
        {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full" />)}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">{data.shopName}</h2>
        <p className="text-[10px] text-gray-500">{data.shopAddress}</p>
        <div className="my-4 border-y border-black/10 py-2">
          <p className="font-bold">TAX RECEIPT</p>
          <p className="text-[10px]">No: {data.id}</p>
        </div>
      </div>

      <div className="mb-6 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">DATE:</span>
          <span>{data.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">CUSTOMER:</span>
          <span className="font-bold">{data.customerName || 'Walk-in Customer'}</span>
        </div>
        {data.customerPhone && (
          <div className="flex justify-between">
            <span className="text-gray-500">PHONE:</span>
            <span>{data.customerPhone}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between font-bold border-b border-black/10 pb-2 mb-2">
          <span className="flex-1">ITEM</span>
          <span className="w-12 text-center">QTY</span>
          <span className="w-20 text-right">PRICE</span>
        </div>
        <div className="space-y-2">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="flex-1 truncate pr-2">{item.description || 'Unnamed Item'}</span>
              <span className="w-12 text-center">x{item.quantity}</span>
              <span className="w-20 text-right">{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-black/10 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>SUBTOTAL</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>TAX ({data.taxRate}%)</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-black pt-2 border-t border-black/5">
          <span>TOTAL {data.currency}</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase font-bold tracking-widest">Thank you for your purchase!</p>
        <div className="mt-6 flex justify-center">
          {/* Simple barcode representation */}
          <div className="flex items-end gap-[1px] h-8 opacity-40">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="bg-black" style={{ width: `${Math.random() > 0.5 ? 2 : 1}px`, height: `${Math.random() * 100}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 flex justify-around opacity-20 transform translate-y-1/2">
        {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-1 bg-black rounded-full" />)}
      </div>
    </div>
  );
};

export default ReceiptCard;
