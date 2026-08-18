import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store, Coins, Upload, Download, CheckCircle2, Search, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotesMarketplace = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(user?.tokens || 0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', description: '', price: 10, subjectId: '' });
  const [file, setFile] = useState(null);
  const [activeMarketplaceCoupon, setActiveMarketplaceCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const fetchMaterialsAndSubjects = async () => {
    try {
      const [matRes, subRes] = await Promise.all([
        axios.get('/api/economy/materials'),
        user?.role !== 'student' ? axios.get('/api/subjects') : Promise.resolve({ data: [] })
      ]);
      setMaterials(matRes.data);
      if (user?.role !== 'student') setSubjects(subRes.data);
    } catch (err) {
      toast.error('Failed to fetch marketplace data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialsAndSubjects();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [useSemantic, setUseSemantic] = useState(true);
  const [semanticResults, setSemanticResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSemanticResults(null);
      return;
    }

    if (useSemantic) {
      setSearching(true);
      try {
        const res = await axios.post('/api/ai/search', { query: searchQuery });
        setSemanticResults(res.data);
      } catch (err) {
        toast.error('AI Semantic search failed. Falling back to local search.');
        setSemanticResults(null);
      } finally {
        setSearching(false);
      }
    }
  };

  const handleClaimTokens = async () => {
    setClaiming(true);
    try {
      const res = await axios.post('/api/economy/claim');
      toast.success(res.data.message);
      setTokenBalance(res.data.tokens);
      // user context needs to be updated but for simplicity we rely on local state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim tokens');
    } finally {
      setClaiming(false);
    }
  };

  const handlePurchase = async (materialId, purchaseType = 'lifetime') => {
    const costText = purchaseType === 'rental' ? 'rent this note for 3 days' : 'unlock this note permanently';
    if (!window.confirm(`Are you sure you want to spend tokens to ${costText}?`)) return;
    try {
      const res = await axios.post(`/api/economy/purchase/${materialId}`, {
        couponCode: appliedCoupon,
        purchaseType
      });
      toast.success(purchaseType === 'rental' ? 'Lease started successfully!' : 'Notes unlocked permanently!');
      setTokenBalance(res.data.tokens);
      fetchMaterialsAndSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    }
  };

  const displayedMaterials = (() => {
    if (useSemantic && semanticResults !== null) {
      return semanticResults.map(resItem => {
        const mat = materials.find(m => m.id === resItem.id);
        if (!mat) return null;
        return {
          ...mat,
          similarityScore: resItem.similarity_score
        };
      }).filter(Boolean);
    } else {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return materials.filter(m => 
          m.title.toLowerCase().includes(query) || 
          (m.description || '').toLowerCase().includes(query)
        );
      }
      return materials;
    }
  })();

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newNote.title);
      formData.append('description', newNote.description);
      formData.append('price', newNote.price);
      if (newNote.subjectId) formData.append('subjectId', newNote.subjectId);
      formData.append('itemType', newNote.itemType || 'notes');
      if (file) formData.append('file', file);

      await axios.post('/api/economy/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Item listed successfully!');
      setShowUpload(false);
      setNewNote({ title: '', description: '', price: 10, subjectId: '', itemType: 'notes' });
      setFile(null);
      fetchMaterialsAndSubjects();
    } catch (err) {
      toast.error('Failed to list item');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Economy Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Store className="w-8 h-8" />
            Edu Stack Pro Marketplace
          </h1>
          <p className="text-yellow-100 max-w-lg">
            Maintain over 85% attendance to earn tokens every week. Spend your tokens here to unlock premium handwritten notes and PYQs uploaded by your seniors.
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl text-center min-w-[200px]">
          <div className="text-sm text-yellow-100 font-medium mb-1 uppercase tracking-wider">Your Balance</div>
          <div className="text-4xl font-black flex items-center justify-center gap-2 mb-4">
            <Coins className="w-8 h-8 text-yellow-200" />
            {tokenBalance}
          </div>
          {user.role === 'student' ? (
            <div className="space-y-3">
              <div className="text-left">
                <label className="block text-[9px] text-yellow-200 font-bold uppercase tracking-wider mb-1">Coupon Discount Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. KIWISTUDY20"
                    value={activeMarketplaceCoupon}
                    onChange={e => setActiveMarketplaceCoupon(e.target.value)}
                    className="w-full bg-white/10 border border-white/25 rounded px-2 py-1 text-xs text-white placeholder-white/50 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (activeMarketplaceCoupon === 'KIWISTUDY20' || activeMarketplaceCoupon === 'CAFEFREE10') {
                        setAppliedCoupon(activeMarketplaceCoupon);
                        toast.success('Marketplace discount applied!');
                      } else {
                        toast.error('Invalid coupon code');
                      }
                    }}
                    className="bg-white text-yellow-600 px-3 py-1 rounded text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                onClick={handleClaimTokens}
                disabled={claiming}
                className="w-full bg-white text-yellow-600 hover:bg-yellow-50 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold shadow transition-all hover:scale-[1.02]"
              >
                {claiming ? 'Claiming...' : 'Claim Attendance Tokens'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="w-full bg-white text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" /> {showUpload ? 'Close Upload Form' : 'Upload Notes / PYQs'}
            </button>
          )}
        </div>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required type="text" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input required type="text" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.description} onChange={e => setNewNote({...newNote, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Item Type</label>
            <select required className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.itemType || 'notes'} onChange={e => setNewNote({...newNote, itemType: e.target.value})}>
              <option value="notes">Notes/PYQs (Digital)</option>
              <option value="textbook">Textbook (Physical)</option>
              <option value="electronics">Electronics/Gadgets</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image / Document (Optional)</label>
            <input type="file" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (Tokens)</label>
            <input required type="number" min="0" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.price} onChange={e => setNewNote({...newNote, price: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.subjectId} onChange={e => setNewNote({...newNote, subjectId: e.target.value})}>
              <option value="">No specific subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium">Publish to Marketplace</button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Marketplace Items</h2>
          <p className="text-xs text-gray-400 mt-1">Browse study guides, textbooks, and lab manuals from peers</p>
        </div>

        {/* Search Bar & AI Toggle */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-1 shadow-sm w-full sm:w-auto">
            <input
              type="text"
              placeholder={useSemantic ? "Search topics semantically..." : "Search by keyword..."}
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) setSemanticResults(null);
              }}
              className="flex-1 px-3 py-2 bg-transparent text-sm outline-none w-full sm:w-64 dark:text-white"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
            >
              {searching ? 'AI Matching...' : <><Search className="w-3.5 h-3.5" /> Search</>}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              const newMode = !useSemantic;
              setUseSemantic(newMode);
              setSemanticResults(null);
              toast.info(newMode ? 'AI Semantic Search Enabled' : 'Standard Keyword Search Enabled');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
              useSemantic 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-850 dark:text-indigo-400' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-dark-card dark:border-dark-border dark:text-gray-400'
            }`}
          >
            <Brain className="w-3.5 h-3.5" /> AI Semantic {useSemantic ? 'ON' : 'OFF'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
        {displayedMaterials.length === 0 && (
          <p className="text-gray-500 col-span-full py-8 text-center border border-dashed rounded-xl">
            No items match your search query.
          </p>
        )}
        {displayedMaterials.map(mat => {
          const hasDiscount = appliedCoupon === 'KIWISTUDY20' || appliedCoupon === 'CAFEFREE10';
          const discountPct = appliedCoupon === 'KIWISTUDY20' ? 0.8 : appliedCoupon === 'CAFEFREE10' ? 0.9 : 1.0;
          const finalPrice = hasDiscount ? Math.ceil(mat.price * discountPct) : mat.price;
          const rentalPrice = Math.ceil(finalPrice * 0.3);

          return (
            <div key={mat.id} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col relative group">
              
              <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm z-10">
                <Coins className="w-4 h-4" /> 
                {hasDiscount ? (
                  <span>
                    <span className="line-through text-xs text-yellow-600/70 mr-1">{mat.price}</span>
                    {finalPrice}
                  </span>
                ) : (
                  mat.price
                )}
              </div>
              
              <div className="absolute top-3 left-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-3 py-1 rounded-full text-xs shadow-sm uppercase tracking-wider">
                {mat.itemType}
              </div>

              <div className="p-6 pt-12 flex-grow">
                <h3 className="font-bold text-lg mb-2 leading-tight">{mat.title}</h3>
                {mat.description && <p className="text-sm text-gray-500 mb-4">{mat.description}</p>}
                
                {/* Active rental display banner */}
                {mat.purchased && mat.purchaseType === 'rental' && (
                  <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-lg font-bold border border-amber-100">
                    ⏰ 3-Day Rental Active<br />
                    Expires: {new Date(mat.leaseExpiresAt).toLocaleDateString()}
                  </div>
                )}
                {mat.purchased && mat.purchaseType === 'lifetime' && (
                  <div className="mt-2 text-xs bg-emerald-50 text-emerald-700 p-2 rounded-lg font-bold border border-emerald-100">
                    ✓ Lifetime Access Unlocked
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 space-y-2">
                {mat.purchased ? (
                  <a 
                    href={mat.contentUrl || '#'} 
                    target={mat.contentUrl ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="w-full flex justify-center items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 py-2.5 rounded-xl font-medium transition-colors text-xs"
                  >
                    <CheckCircle2 className="w-5 h-5" /> {mat.contentUrl ? 'Download/View' : 'Purchased (Contact Seller)'}
                  </a>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handlePurchase(mat.id, 'lifetime')}
                      className="w-full flex justify-center items-center gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-2 rounded-xl font-bold transition-colors text-xs"
                    >
                      <Store className="w-3.5 h-3.5" /> Lifetime for {finalPrice}
                    </button>
                    <button 
                      onClick={() => handlePurchase(mat.id, 'rental')}
                      className="w-full flex justify-center items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 py-2 rounded-xl font-bold transition-colors border border-yellow-200 text-xs"
                    >
                      ⏱ Rent 3 Days for {rentalPrice}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesMarketplace;
