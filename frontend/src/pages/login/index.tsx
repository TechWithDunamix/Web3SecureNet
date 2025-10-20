import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] text-white overflow-hidden relative font-['Inter',sans-serif]">
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3); }
        }
        .glow-button {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pathGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 15px rgba(168, 85, 247, 0.4)); }
          50% { filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.5)); }
        }
        .curve-glow {
          animation: pathGlow 3s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spin 20s linear infinite;
        }
      `}</style>

      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
            }}
          ></div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      {/* Curved lines decoration */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-30">
        <svg
          className="absolute top-0 w-full h-32 curve-glow"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 Q300,20 600,60 T1200,60"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3 float-animation">
              <div className="relative">
                <Wallet className="w-10 h-10 text-purple-500" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              </div>
              <span className="text-2xl font-bold">Web3SecureNet</span>
            </div>
          </Link>

          {/* Login Card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-white/60">Sign in to access your wallet</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-purple-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-purple-500/30 bg-[#0a0a1f]/50 text-purple-600 focus:ring-purple-500/20"
                    />
                    <span className="text-white/70">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 glow-button group"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a3e] text-white/60">Or continue with</span>
                </div>
              </div>

              {/* Wallet Connect Button */}
              <button className="w-full bg-[#0a0a1f]/50 hover:bg-[#0a0a1f] border border-purple-500/30 hover:border-purple-500/50 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <span>Connect Wallet</span>
              </button>

              {/* Sign Up Link */}
              <p className="text-center mt-8 text-white/60">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative curved line at bottom */}
          <div className="relative w-full h-24 mt-8 overflow-hidden opacity-30">
            <svg
              className="absolute bottom-0 w-full h-24 curve-glow"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,80 C200,20 400,100 600,60 C800,20 1000,100 1200,40"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="2"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 0.2 }} />
                  <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#c084fc', stopOpacity: 0.2 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;