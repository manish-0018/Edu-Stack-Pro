import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldCheck, Sparkles, Award, Play, AlertCircle, CreditCard, Lock, CheckCircle2, QrCode, Ticket, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const triggerConfetti = () => {
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = `${Math.random() * 8 + 6}px`;
    confetti.style.height = `${Math.random() * 8 + 6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.top = '60%';
    confetti.style.left = '50%';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 12 + 6;
    let x = 0;
    let y = 0;
    let dx = Math.cos(angle) * velocity;
    let dy = Math.sin(angle) * velocity - 5;
    
    document.body.appendChild(confetti);
    
    let ticks = 0;
    const animate = () => {
      ticks++;
      x += dx;
      y += dy;
      dy += 0.4;
      dx *= 0.98;
      
      confetti.style.transform = `translate(${x}px, ${y}px) rotate(${ticks * 10}deg)`;
      confetti.style.opacity = Math.max(0, 1 - ticks / 50).toString();
      
      if (ticks < 50) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    requestAnimationFrame(animate);
  }
};

const PremiumUpgrade = () => {
  const { user, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('card'); // 'card' or 'upi'
  const [formData, setFormData] = useState({ cardNo: '', expiry: '', cvv: '', name: '' });
  const [upiIdInput, setUpiIdInput] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Promo Code States
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Dynamic Seller UPI config state
  const [upiConfigId, setUpiConfigId] = useState('yourupi@upi');
  const [customMerchantUpi, setCustomMerchantUpi] = useState('yourupi@upi');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/auth/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        const res = await axios.get('/api/auth/payment-config');
        if (res.data.upiId) {
          setUpiConfigId(res.data.upiId);
          setCustomMerchantUpi(res.data.upiId);
        }
      } catch (err) {
        console.error("Failed to load payment config", err);
      }
    };
    fetchPaymentConfig();
    fetchTransactions();
  }, []);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'EDUSTACK25') {
      setAppliedPromo('EDUSTACK25');
      setDiscountPercent(25);
      toast.success("Promo applied! 25% Off coupon activated.");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (paymentMode === 'card') {
      if (formData.cardNo.length < 16 || formData.cvv.length < 3) {
        toast.error("Please enter a valid credit card.");
        return;
      }
    } else {
      if (!upiIdInput.includes('@')) {
        toast.error("Please enter a valid UPI ID (e.g. name@upi).");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await axios.put('/api/auth/upgrade', {
        amount: finalPrice,
        paymentMethod: paymentMode === 'card' ? 'Card' : 'UPI'
      });
      toast.success("Semester Pass Purchase Successful!");
      
      // Update local state
      updateCurrentUser({ isPremium: true });
      
      // Trigger Confetti Celebration
      triggerConfetti();
      setSuccess(true);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment gateway simulation error");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (txn) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6); // amber color
    doc.text("EDU STACK PRO", 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("Premium Upgrade Invoice / Receipt", 20, 38);
    doc.line(20, 42, 190, 42);

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details", 20, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Ref: ${txn.id}`, 20, 60);
    doc.text(`Transaction ID: ${txn.transactionId}`, 20, 68);
    doc.text(`Payment Method: ${txn.paymentMethod}`, 20, 76);
    doc.text(`Status: Completed`, 20, 84);
    doc.text(`Date of Issue: ${new Date(txn.createdAt).toLocaleString()}`, 20, 92);

    doc.line(20, 98, 190, 98);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 108);
    doc.text("Price", 160, 108);
    doc.setFont("helvetica", "normal");
    doc.text("One-Time Premium Semester Pass Upgrade", 20, 118);
    doc.text(`$${parseFloat(txn.amount).toFixed(2)}`, 160, 118);

    doc.line(20, 126, 190, 126);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 20, 136);
    doc.text(`$${parseFloat(txn.amount).toFixed(2)}`, 160, 136);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(156, 163, 175);
    doc.text("This is a computer-generated transaction receipt from Edu Stack Pro.", 20, 160);
    doc.save(`receipt-${txn.transactionId}.pdf`);
    toast.success("Receipt downloaded successfully!");
  };

  const basePrice = 2.00;
  const finalPrice = basePrice * (1 - discountPercent / 100);

  if (user?.isPremium || success) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-xl">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 dark:border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          You are an Edu Stack Pro Premium Member!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Your One-Time Semester Pass is active. All premium features are unlocked.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-lg mx-auto text-left">
          {[
            "Priority 1-on-1 Tutoring requests",
            "Global Peer Matching & Mentor Finder",
            "AI Study Guides (Structured from recordings)",
            "AI Team Builder & Classmate Skill Matcher",
            "Lockdown Practice Mode for Timed Quizzes",
            "2x Daily Claim Tokens multiplier",
            "Gold profile badges & tags"
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-semibold bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Billing History Section */}
        {transactions.length > 0 && (
          <div className="mt-12 text-left border-t border-gray-100 dark:border-slate-800 pt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing History</h3>
            <div className="bg-gray-50 dark:bg-slate-800/20 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-100/50 dark:bg-slate-800/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Txn ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3.5 font-medium">{new Date(txn.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-gray-700 dark:text-gray-300">{txn.transactionId}</td>
                      <td className="px-4 py-3.5 font-extrabold text-slate-800 dark:text-white">${parseFloat(txn.amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 font-semibold uppercase">{txn.paymentMethod}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button 
                          onClick={() => downloadReceipt(txn)}
                          className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1 border border-gray-200 dark:border-slate-700"
                          title="Download Receipt"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left: Features Presentation */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full border border-amber-200 dark:border-amber-900/30">
            <Award className="w-3.5 h-3.5" /> Premium Semester Pass
          </div>
          <h1 className="text-4xl font-black tracking-tight mt-4 text-gray-900 dark:text-white leading-tight">
            Supercharge Your Learning with <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent">Edu Stack Plus</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            One tiny one-time purchase. Unlimited premium access for the entire semester. No recurring cards, no hidden charges.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl shrink-0 h-fit">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Tutoring & AI Team Matcher</h4>
                <p className="text-xs text-gray-400 mt-0.5">Priority 1-on-1 requests, Global peer matching, and automated project/hackathon team recruiting fit explanations.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-xl shrink-0 h-fit">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Whiteboard Logs & AI Study Guides</h4>
                <p className="text-xs text-gray-400 mt-0.5">Record whiteboard collaboration rooms. Automatically summarize key equations, notes, and chat transcripts with AI.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl shrink-0 h-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Quiz Lockdown & 2x Tokens Multiplier</h4>
                <p className="text-xs text-gray-400 mt-0.5">Simulate cheating prevention lockdown during quizzes, claim double weekly token rewards, and get a gold crown badge.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3 text-blue-700 dark:text-blue-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-medium">Semester passes are configured as single one-time payments that expire automatically at the end of the semester exams.</p>
        </div>
      </div>

      {/* Right: Checkout Simulation */}
      <div className="lg:col-span-5">
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Payment Checkout</h2>
          <p className="text-xs text-gray-400">Secure sandbox P2P payment processing.</p>

          <div className="my-5 p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 text-center">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider block">One-Time semester pass</span>
            <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              ${finalPrice.toFixed(2)} <span className="text-xs font-semibold text-gray-400">/ semester</span>
            </div>
            {appliedPromo && (
              <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                Coupon Applied: 25% Off
              </span>
            )}
          </div>

          {/* Promo code field */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Promo Code (e.g. EDUSTACK25)"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 outline-none text-xs"
              />
              <Ticket className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>
            <button 
              type="button" 
              onClick={handleApplyPromo}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold"
            >
              Apply
            </button>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button 
              type="button"
              onClick={() => setPaymentMode('card')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentMode === 'card' ? 'bg-white dark:bg-slate-700 shadow text-amber-500' : 'text-gray-500'}`}
            >
              💳 Card
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMode('upi')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${paymentMode === 'upi' ? 'bg-white dark:bg-slate-700 shadow text-amber-500' : 'text-gray-500'}`}
            >
              📱 UPI
            </button>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            {paymentMode === 'card' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name on Card</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neeraj Kumar"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={16}
                      required
                      placeholder="4111 2222 3333 4444"
                      value={formData.cardNo}
                      onChange={e => setFormData({ ...formData, cardNo: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={formData.expiry}
                      onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVV / CVN</label>
                    <input
                      type="password"
                      required
                      placeholder="***"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={e => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm text-center"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Receive Money to (Merchant UPI ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@okaxis"
                    value={customMerchantUpi}
                    onChange={e => setCustomMerchantUpi(e.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 dark:border-amber-700/50 rounded-xl dark:bg-slate-800 focus:ring-1 focus:ring-amber-500 outline-none text-xs font-bold text-amber-600 dark:text-amber-400"
                  />
                  <span className="text-[9px] text-gray-400 block leading-tight">To save permanently, edit <code>DEVELOPER_UPI_ID</code> in backend <code>.env</code> file.</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-40 h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${customMerchantUpi || 'yourupi@upi'}&pn=EduStackPro&am=${appliedPromo ? '99.00' : '149.00'}&cu=INR`)}`}
                      alt="UPI Payment QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 text-center leading-relaxed max-w-[200px] mt-1">
                    Scan QR code with GPay, PhonePe, Paytm, or BHIM app to pay dynamically.
                  </span>
                  <div className="text-xs bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-mono font-bold mt-1 break-all">
                    Merchant UPI: {customMerchantUpi || 'yourupi@upi'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Enter your UPI ID to verify</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="username@okaxis"
                      value={upiIdInput}
                      onChange={e => setUpiIdInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                    />
                    <QrCode className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm mt-6"
            >
              {loading ? "Processing..." : <><ShieldCheck className="w-5 h-5" /> Buy Semester Pass</>}
            </button>
          </form>
        </div>
      </div>
    </div>

      {/* Billing History Section */}
      {transactions.length > 0 && (
        <div className="border-t border-gray-100 dark:border-slate-800 pt-8 text-left">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing History</h3>
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Txn ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {transactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3.5 font-medium">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-gray-700 dark:text-gray-300">{txn.transactionId}</td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-800 dark:text-white">${parseFloat(txn.amount).toFixed(2)}</td>
                    <td className="px-4 py-3.5 font-semibold uppercase">{txn.paymentMethod}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button 
                        onClick={() => downloadReceipt(txn)}
                        className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1 border border-gray-200 dark:border-slate-700"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumUpgrade;
