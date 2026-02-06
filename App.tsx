
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  History, 
  Settings, 
  Share2, 
  Download, 
  Trash2, 
  Printer, 
  Zap,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ReceiptData, ReceiptItem } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptCard from './components/ReceiptCard';
import RecentReceipts from './components/RecentReceipts';
import { generatePDF } from './lib/pdf-export';

const DEFAULT_SHOP_INFO = {
  shopName: "Velocity Sports Gear",
  shopAddress: "123 Elite Athlete Way, San Francisco, CA",
  currency: "USD",
  taxRate: 8.5
};

const App: React.FC = () => {
  const [view, setView] = useState<'create' | 'history' | 'preview'>('create');
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData>({
    id: `REC-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...DEFAULT_SHOP_INFO,
    customerName: "",
    customerPhone: "",
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
    alert("Receipt saved to history!");
  }, [currentReceipt, history]);

  const handleDownload = async () => {
    await generatePDF('receipt-capture');
  };

  const handleShare = async () => {
    const total = currentReceipt.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const text = `Receipt from ${currentReceipt.shopName}\nTotal: ${currentReceipt.currency} ${total.toFixed(2)}`;
    
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
      alert("Sharing not supported on this browser. Try copying the link.");
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-4">
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Q-BEAM <span className="text-blue-500">PRO</span></h1>
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
              <h2 className="text-2xl font-bold">New Receipt</h2>
              <button 
                onClick={() => setView('preview')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all transform active:scale-95"
              >
                Preview <FileText size={18} />
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
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => setView('create')}
                className="text-white/60 hover:text-white flex items-center gap-2"
              >
                Back to Editor
              </button>
              <div className="flex gap-2">
                <button onClick={handleShare} className="p-3 glass rounded-xl hover:bg-white/10"><Share2 size={20}/></button>
                <button onClick={handleDownload} className="p-3 glass rounded-xl hover:bg-white/10"><Download size={20}/></button>
                <button onClick={saveToHistory} className="bg-green-600 hover:bg-green-700 p-3 rounded-xl"><CheckCircle size={20}/></button>
              </div>
            </div>
            
            <div id="receipt-capture" className="w-full max-w-md">
               <ReceiptCard data={currentReceipt} />
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold">Recent Receipts</h2>
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

      {/* Mobile Sticky Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex justify-around items-center p-4 z-50">
        <button onClick={() => setView('create')} className={`flex flex-col items-center gap-1 ${view === 'create' ? 'text-blue-500' : 'text-white/40'}`}>
          <Plus size={24} />
          <span className="text-[10px] uppercase font-bold">New</span>
        </button>
        <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-blue-500' : 'text-white/40'}`}>
          <History size={24} />
          <span className="text-[10px] uppercase font-bold">History</span>
        </button>
        <button onClick={() => setView('preview')} className={`flex flex-col items-center gap-1 ${view === 'preview' ? 'text-blue-500' : 'text-white/40'}`}>
          <FileText size={24} />
          <span className="text-[10px] uppercase font-bold">Preview</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
