import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import halfDomeImage from '../assets/half-dome.png';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-amber-100 rounded-lg shadow-md border-2 border-amber-300">
      <div className="flex flex-col items-center mb-6">
        <img 
          src={halfDomeImage} 
          alt="Half Dome Yosemite" 
          className="w-36 h-36 mb-4 object-cover rounded-md"
        />
        <h2 className="text-3xl font-bold text-center text-amber-900 font-serif">
          Wassociates
        </h2>
        <p className="text-amber-700 text-sm mt-1">Yosemite National Park</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-amber-800 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-amber-400 bg-amber-50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-amber-800 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-amber-400 bg-amber-50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-700 text-amber-50 py-2 px-4 rounded-md hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
} 
