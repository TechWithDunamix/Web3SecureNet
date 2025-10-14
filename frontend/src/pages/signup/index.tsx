import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight, User, Shield } from 'lucide-react';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
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
      <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[15%] right-[15%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      {/* Curved lines decoration */}
      <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-30">
        <svg
          className="absolute top-0 w-full h-32 curve-glow"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 Q150,80 300,40 T600,40 T900,40 T1200,40"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            opacity="0.8"
          />
          <path
            d="M0,60 Q150,100 300,60 T600,60 T900,60 T1200,60"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 0.4 }} />
              <stop offset="50%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 0.4 }} />
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
                <Shield className="w-10 h-10 text-purple-500" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full pulse-animation"></div>
              </div>
              <span className="text-2xl font-bold">Web3SecureNet</span>
            </div>
          </Link>

          {/* Signup Card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-white/60">Join the future of digital security</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-purple-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-purple-500/30 bg-[#0a0a1f]/50 text-purple-600 focus:ring-purple-500/20"
                    required
                  />
                  <label className="text-sm text-white/70">
                    I agree to the{' '}
                    <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 glow-button group"
                >
                  <span>Create Account</span>
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

              {/* Sign In Link */}
              <p className="text-center mt-8 text-white/60">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign in
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
                d="M0,50 Q100,10 200,50 Q300,90 400,50 Q500,10 600,50 Q700,90 800,50 Q900,10 1000,50 Q1100,90 1200,50"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="2"
                opacity="0.8"
              />
              <path
                d="M0,70 Q100,30 200,70 Q300,110 400,70 Q500,30 600,70 Q700,110 800,70 Q900,30 1000,70 Q1100,110 1200,70"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
