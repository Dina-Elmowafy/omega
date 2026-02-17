import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // تحقق من أن البريد يحتوي على "admin" - فقط المسؤولون يمكنهم الدخول
    if (!email.includes('admin')) {
      setError('Invalid credentials. Admin access only.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      setLoading(false);
      navigate('/admin');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
          <img 
            src="image/WHY CHOOSE OMEGA.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
      </div>

      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 border-t-4 border-omega-yellow">
        <div className="flex justify-center mb-8">
           <Logo variant="dark" />
        </div>
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Admin Portal</p>
            <p className="text-xs text-gray-400 mt-1">Administration access only</p>
          </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-omega-yellow transition-colors"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-omega-yellow transition-colors"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-omega-yellow text-omega-dark py-3 rounded-full font-bold uppercase tracking-wide hover:bg-yellow-400 transition-colors flex justify-center items-center shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-omega-dark border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Secure Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
