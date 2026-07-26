import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store, Coins, Upload, Download, CheckCircle2 } from 'lucide-react';
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

  const handlePurchase = async (materialId) => {
    if (!window.confirm("Are you sure you want to spend tokens to unlock these notes?")) return;
    try {
      const res = await axios.post(`/api/economy/purchase/${materialId}`);
      toast.success('Notes unlocked successfully!');
      setTokenBalance(res.data.tokens);
      fetchMaterialsAndSubjects(); // refresh to show as purchased
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
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
            <button 
              onClick={handleClaimTokens}
              disabled={claiming}
              className="w-full bg-white text-yellow-700 hover:bg-yellow-50 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {claiming ? 'Verifying...' : 'Claim Weekly Tokens'}
            </button>
          ) : user.role === 'teacher' ? (
            <button 
              onClick={() => setShowUpload(!showUpload)}
              className="w-full bg-white text-yellow-700 hover:bg-yellow-50 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Sell Item
            </button>
          ) : user.role === 'student' ? (
             <button 
              onClick={() => setShowUpload(!showUpload)}
              className="w-full mt-4 bg-yellow-700 text-yellow-50 hover:bg-yellow-800 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Sell Item
            </button>
          ) : null}
        </div>
      </div>

      {showUpload && (
        <form onSubmit={async (e) => {
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
        }} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required type="text" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows="2" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newNote.description} onChange={e => setNewNote({...newNote, description: e.target.value})} />
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
      <h2 className="text-2xl font-bold mt-8 mb-4">Available Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {materials.length === 0 && <p className="text-gray-500">No items available yet.</p>}
        {materials.map(mat => (
          <div key={mat.id} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col relative group">
            
            <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-sm">
              <Coins className="w-4 h-4" /> {mat.price}
            </div>
            
            <div className="absolute top-3 left-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold px-3 py-1 rounded-full text-xs shadow-sm uppercase tracking-wider">
              {mat.itemType}
            </div>

            <div className="p-6 pt-12 flex-grow">
              <h3 className="font-bold text-lg mb-2 leading-tight">{mat.title}</h3>
              {mat.description && <p className="text-sm text-gray-500 mb-4">{mat.description}</p>}
            </div>
            
            <div className="p-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
              {mat.purchased ? (
                <a 
                  href={mat.contentUrl || '#'} 
                  target={mat.contentUrl ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="w-full flex justify-center items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 py-2.5 rounded-xl font-medium transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" /> {mat.contentUrl ? 'Download/View' : 'Purchased (Contact Seller)'}
                </a>
              ) : (
                <button 
                  onClick={() => handlePurchase(mat.id)}
                  className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium transition-colors"
                >
                  <Store className="w-4 h-4" /> Unlock for {mat.price} Tokens
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesMarketplace;
