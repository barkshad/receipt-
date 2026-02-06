
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  History, 
  Share2, 
  Download, 
  Zap,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ReceiptData } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptCard from './components/ReceiptCard';
import RecentReceipts from './components/RecentReceipts';
import { generatePDF } from './lib/pdf-export';

const DEFAULT_SHOP_INFO = {
  shopName: "VELOCITY SPORTS KENYA",
  shopAddress: "Nairobi CBD, Kimathi Street, Block 4",
  currency: "KSH",
  taxRate: 16.0 // Standard VAT in Kenya
};

const App: React.FC = () => {
  const [view, setView] = useState<'create' | 'history' | 'preview'>('create');
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>({
    id: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    ...DEFAULT_SHOP_INFO,
    customerName: "",
    customerPhone: "",
    amountPaid: 0,
    items: [{ id: '1', description: '', quantity: 1, price: 0 }]
  });
  const [history, setHistory] = useState<ReceiptData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('receipt_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = useCallback(() => {
    const updatedHistory = [currentReceipt, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('receipt_history', JSON.stringify(updatedHistory));
    alert("Receipt saved and logged.");
  }, [currentReceipt, history]);

  const handleDownload = async () => {
    await generatePDF('receipt-capture');
  };

  const handleShare = async () => {
    const subtotal = currentReceipt.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal * (1 + currentReceipt.taxRate / 100);
    const text = `Receipt from ${currentReceipt.shopName}\nInvoice: ${currentReceipt.id}\nTotal: KSH ${total.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sports Gear Receipt',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Copy this: " + text);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-4 bg-[#0a0a0a]">
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Q-BEAM <span className="text-blue-500">POS</span></h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('history')}
            className={`p-2 rounded-lg transition-colors ${view === 'history' ? 'bg-white/10 text-blue-400' : 'text-white/60 hover:text-white'}`}
          >
            <History size={20} />
          </button>
          <button 
            onClick={() => setView('create')}
            className={`p-2 rounded-lg transition-colors ${view === 'create' ? 'bg-white/10 text-blue-400' : 'text-white/60 hover:text-white'}`}
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === 'create' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Issue Receipt</h2>
              <button 
                onClick={() => setView('preview')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                Preview Invoice <FileText size={18} />
              </button>
            </div>
            <ReceiptForm 
              data={currentReceipt} 
              onChange={setCurrentReceipt} 
            />
          </div>
        )}

        {view === 'preview' && (
          <div className="space-y-8 flex flex-col items-center">
            <div className="w-full flex items-center justify-between max-w-md">
              <button 
                onClick={() => setView('create')}
                className="text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium"
              >
                ← Edit Details
              </button>
              <div className="flex gap-2">
                <button onClick={handleShare} title="Share" className="p-3 glass rounded-xl hover:bg-white/10 text-white"><Share2 size={20}/></button>
                <button onClick={handleDownload} title="Download/Print" className="p-3 glass rounded-xl hover:bg-white/10 text-white"><Download size={20}/></button>
                <button onClick={saveToHistory} title="Save to History" className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"><CheckCircle size={20}/></button>
              </div>
            </div>
            
            <div id="receipt-capture" className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
               <ReceiptCard data={currentReceipt} />
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-white">Transaction Logs</h2>
             <RecentReceipts 
               items={history} 
               onView={(item) => {
                 setCurrentReceipt(item);
                 setView('preview');
               }}
               onDelete={(id) => {
                 const updated = history.filter(h => h.id !== id);
                 setHistory(updated);
                 localStorage.setItem('receipt_history', JSON.stringify(updated));
               }}
             />
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex justify-around items-center p-4 z-50">
        <button onClick={() => setView('create')} className={`flex flex-col items-center gap-1 ${view === 'create' ? 'text-blue-500' : 'text-white/40'}`}>
          <Plus size={24} />
          <span className="text-[10px] uppercase font-bold">Checkout</span>
        </button>
        <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-blue-500' : 'text-white/40'}`}>
          <History size={24} />
          <span className="text-[10px] uppercase font-bold">Sales</span>
        </button>
        <button onClick={() => setView('preview')} className={`flex flex-col items-center gap-1 ${view === 'preview' ? 'text-blue-500' : 'text-white/40'}`}>
          <FileText size={24} />
          <span className="text-[10px] uppercase font-bold">Review</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
