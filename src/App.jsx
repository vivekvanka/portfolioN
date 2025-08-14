import { useState, useEffect } from 'react';

const STORAGE_KEY = 'railway_buddy_posts';

const defaultForm = {
  trainNo: '',
  from: '',
  to: '',
  date: '',
  type: 'cancel',
  message: '',
  contact: ''
};

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
    setForm(defaultForm);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">🚆 Railway Buddy</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-sm text-red-600">
          ⚠️ Disclaimer: This platform only shares travel info. No ticket resale/transfer. Always use the official IRCTC portal for bookings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="trainNo" placeholder="Train No" value={form.trainNo} onChange={handleChange} className="border p-2 rounded" required />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-2 rounded" required />
          <input name="from" placeholder="From" value={form.from} onChange={handleChange} className="border p-2 rounded" required />
          <input name="to" placeholder="To" value={form.to} onChange={handleChange} className="border p-2 rounded" required />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input type="radio" name="type" value="cancel" checked={form.type === 'cancel'} onChange={handleChange} />
            Cancelling Ticket
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="type" value="swap" checked={form.type === 'swap'} onChange={handleChange} />
            Seat Swap
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="type" value="buddy" checked={form.type === 'buddy'} onChange={handleChange} />
            Find Buddy
          </label>
        </div>
        <textarea name="message" placeholder="Optional message" value={form.message} onChange={handleChange} className="border w-full p-2 rounded" />
        <input name="contact" placeholder="Contact info (email/phone)" value={form.contact} onChange={handleChange} className="border w-full p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
            <div className="font-semibold">{post.type === 'cancel' ? '🚫 Ticket Cancelled' : post.type === 'swap' ? '🔄 Seat Swap Request' : '👥 Looking for Travel Buddy'}</div>
            <div className="text-gray-800">Train {post.trainNo} — {post.from} ➝ {post.to} on {post.date}</div>
            {post.message && <div className="text-gray-700 mt-1">{post.message}</div>}
            <div className="text-sm text-blue-600 mt-1">Contact: {post.contact}</div>
            <button onClick={() => handleDelete(post.id)} className="text-red-500 text-xs mt-2 hover:underline">Delete</button>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-600">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
