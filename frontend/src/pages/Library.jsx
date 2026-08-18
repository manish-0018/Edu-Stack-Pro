import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, CheckCircle, Search, Clock, Plus, BookOpen, Star, MessageSquare, ExternalLink, X, ChevronRight, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

const Library = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [myCheckouts, setMyCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // for reviews modal
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1,
    ebookUrl: ''
  });

  const fetchData = async () => {
    try {
      const booksRes = await axios.get('/api/library');
      setBooks(booksRes.data);
      
      if (user && user.role === 'student') {
        const checkoutsRes = await axios.get('/api/library/my-checkouts');
        setMyCheckouts(checkoutsRes.data);
      }
    } catch (err) {
      toast.error('Failed to load library data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const handleCheckout = async (bookId) => {
    try {
      await axios.post(`/api/library/checkout/${bookId}`);
      toast.success('Book checked out successfully! Due in 14 days.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to checkout');
    }
  };

  const handleReturn = async (checkoutId) => {
    try {
      await axios.post(`/api/library/return/${checkoutId}`);
      toast.success('Book returned successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/library', newBook);
      toast.success('Book added to library!');
      setShowAddForm(false);
      setNewBook({ title: '', author: '', category: '', totalCopies: 1, availableCopies: 1, ebookUrl: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/library/${selectedBook.id}/reviews`, reviewForm);
      toast.success('Review posted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      
      // Refresh books and update selected book to show new review
      const booksRes = await axios.get('/api/library');
      setBooks(booksRes.data);
      const updatedBook = booksRes.data.find(b => b.id === selectedBook.id);
      setSelectedBook(updatedBook);
    } catch (err) {
      toast.error('Failed to post review');
    }
  };

  const categories = ['', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getAverageRating = (book) => {
    const reviews = book.BookReviews || [];
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
            <Book className="w-8 h-8" /> Smart Library Hub
          </h1>
          <p className="opacity-80">Access reference books, open-source textbooks, and peer reviews globally.</p>
        </div>
        {user.role !== 'student' && user.role !== 'guardian' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold flex items-center gap-2 shadow"
          >
            <Plus className="w-5 h-5" /> Add New Textbook
          </button>
        )}
      </div>

      {/* Add Book Form */}
      {showAddForm && (
        <form onSubmit={handleAddBook} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Book Title</label>
            <input required type="text" className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input required type="text" className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category / Field</label>
            <input required type="text" placeholder="e.g. Computer Science, Mathematics" className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Open-Access PDF Link (Optional)</label>
            <input type="url" placeholder="https://example.com/textbook.pdf" className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" value={newBook.ebookUrl} onChange={e => setNewBook({...newBook, ebookUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Copies</label>
            <input required type="number" min="1" className="w-full px-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value), availableCopies: parseInt(e.target.value)})} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">Save Book</button>
          </div>
        </form>
      )}

      {/* Issued Books */}
      {user.role === 'student' && myCheckouts.length > 0 && (
        <div className="space-y-3 bg-indigo-50/50 dark:bg-indigo-955/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
          <h2 className="text-xl font-black text-indigo-955 dark:text-indigo-400 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-500" /> Issued Books & Hold List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCheckouts.map(checkout => (
              <div key={checkout.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{checkout.Book?.title}</h3>
                    <p className="text-xs text-gray-500">{checkout.Book?.author}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    checkout.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {checkout.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Due: {new Date(checkout.dueDate).toLocaleDateString()}
                </div>
                {checkout.status === 'active' && (
                  <div className="flex gap-2">
                    {checkout.Book?.ebookUrl && (
                      <a href={checkout.Book.ebookUrl} target="_blank" rel="noreferrer" className="flex-1 text-center bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Read PDF
                      </a>
                    )}
                    <button onClick={() => handleReturn(checkout.id)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-xl text-xs font-bold">
                      Return
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search catalog by title, author, field..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="md:w-56 px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none"
        >
          <option value="">All Categories</option>
          {categories.filter(Boolean).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          const avgRating = getAverageRating(book);
          return (
            <div key={book.id} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-xs font-bold">{avgRating > 0 ? `${avgRating}/5.0` : 'No reviews'}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">By {book.author}</p>
                </div>
                <div className="flex items-center justify-between text-xs font-medium pt-1">
                  {book.availableCopies > 0 ? (
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{book.availableCopies} Copies Available</span>
                  ) : (
                    <span className="text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border space-y-2">
                <div className="flex gap-2">
                  {book.ebookUrl && (
                    <a href={book.ebookUrl} target="_blank" rel="noreferrer" className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" /> Digital PDF
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedBook(book)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Reviews ({book.BookReviews?.length || 0})
                  </button>
                </div>
                {user.role === 'student' && (
                  <button 
                    onClick={() => handleCheckout(book.id)} 
                    disabled={book.availableCopies <= 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    {book.availableCopies > 0 ? 'Reserve Physical Copy' : 'Currently Unavailable'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredBooks.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No books found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Reviews Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1">{selectedBook.title}</h2>
                <p className="text-sm text-gray-500">Book Reviews & Student Ratings</p>
              </div>
              <button onClick={() => setSelectedBook(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-bold text-gray-400">STUDENT FEEDBACK</h3>
              {(selectedBook.BookReviews || []).length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl">No reviews posted yet. Be the first!</p>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {(selectedBook.BookReviews || []).map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-850">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{r.Student?.name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review */}
            {user.role === 'student' && (
              <form onSubmit={handleAddReview} className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-400">WRITE A REVIEW</h3>
                
                {/* Rating selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment input */}
                <textarea 
                  required
                  placeholder="Share your thoughts about this textbook (scope, syllabus accuracy, language simplicity)..." 
                  rows={3} 
                  value={reviewForm.comment} 
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setSelectedBook(null)} className="px-5 py-2 font-bold text-gray-500 text-sm">Close</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm">Submit Review</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
