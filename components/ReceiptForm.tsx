
import React from 'react';
import { Trash2, Plus, Sparkles, Banknote } from 'lucide-react';
import { ReceiptData, ReceiptItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
}

const ReceiptForm: React.FC<Props> = ({ data, onChange }) => {
  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    onChange({
      ...data,
      items: data.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: string, field: keyof ReceiptItem, value: any) => {
    onChange({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const handleSmartSuggest = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Suggest 3 random popular sports products with realistic prices in Kenyan Shillings (KSH). Return as JSON array of objects with description and price.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                price: { type: Type.NUMBER }
              },
              required: ["description", "price"]
            }
          }
        }
      });
      
      const suggested = JSON.parse(response.text);
      const newItems = suggested.map((s: any, idx: number) => ({
        id: `suggested-${Date.now()}-${idx}`,
        description: s.description,
        price: s.price,
        quantity: 1
      }));
      
      onChange({
        ...data,
        items: [...data.items, ...newItems].filter(i => i.description !== '')
      });
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const subtotal = data.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal * (1 + data.taxRate / 100);

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-white/60">Customer Name</span>
            <input 
              type="text" 
              value={data.customerName}
              onChange={e => onChange({...data, customerName: e.target.value})}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white"
              placeholder="e.g. John Doe"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-white/60">Customer Phone</span>
            <input 
              type="text" 
              value={data.customerPhone}
              onChange={e => onChange({...data, customerPhone: e.target.value})}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white"
              placeholder="+254 7XX XXX XXX"
            />
          </label>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-white/60">Date of Sale</span>
            <input 
              type="date" 
              value={data.date}
              onChange={e => onChange({...data, date: e.target.value})}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white"
            />
          </label>
          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl">
             <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-blue-400 font-bold uppercase">Total Due</span>
                <span className="text-xl font-black text-white">KSH {total.toLocaleString()}</span>
             </div>
             <label className="block mt-2">
                <div className="flex items-center gap-2 mb-1">
                   <Banknote size={14} className="text-green-400" />
                   <span className="text-xs font-medium text-white/60 uppercase">Amount Received</span>
                </div>
                <input 
                  type="number" 
                  value={data.amountPaid}
                  onChange={e => onChange({...data, amountPaid: parseFloat(e.target.value) || 0})}
                  className="block w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:border-green-500 outline-none text-white font-mono"
                  placeholder="Cash Received"
                />
             </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Items List</h3>
          <button 
            onClick={handleSmartSuggest}
            className="text-xs bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors border border-purple-500/30 font-bold"
          >
            <Sparkles size={14} /> AI Suggestions
          </button>
        </div>
        
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="glass p-4 rounded-2xl flex flex-wrap md:flex-nowrap gap-4 items-end border-l-4 border-blue-600">
              <div className="flex-1 min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-white/40 mb-1 block tracking-wider">Description</span>
                <input 
                  type="text" 
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-white"
                  placeholder="Item Name"
                />
              </div>
              <div className="w-20">
                <span className="text-[10px] uppercase font-bold text-white/40 mb-1 block tracking-wider">Qty</span>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-center text-white"
                />
              </div>
              <div className="w-32">
                <span className="text-[10px] uppercase font-bold text-white/40 mb-1 block tracking-wider">KSH / Unit</span>
                <input 
                  type="number" 
                  value={item.price}
                  onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-blue-500 text-right text-white font-mono"
                />
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mb-[1px]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={addItem}
          className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-white/40 hover:text-blue-400 p-4 rounded-2xl flex items-center justify-center gap-2 transition-all group font-bold"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Add Another Product
        </button>
      </div>
    </div>
  );
};

export default ReceiptForm;
