import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    users: 0,
    backups: 0,
    listings: 0,
    creators: 0
  });

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animateCount = (target: number, key: keyof typeof stats) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 20);
    };

    animateCount(120, 'users');
    animateCount(50, 'backups');
    animateCount(90, 'listings');
    animateCount(40, 'creators');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] text-white overflow-x-hidden relative font-['Inter',sans-serif]">
      {/* Sun Rays Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] -mr-[400px] -mt-[400px] pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-350px)`,
                transformOrigin: 'left center',
                animation: `pulse 3s ease-in-out ${i * 0.2}s infinite alternate`,
                filter: 'blur(1px)'
              }}
            />
          ))}
          <div 
            className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              boxShadow: '0 0 60px 20px rgba(251, 191, 36, 0.3)',
              animation: 'pulse 3s ease-in-out infinite alternate'
            }}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3); }
        }
        .glow-button {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes pathGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 15px rgba(168, 85, 247, 0.4)); }
          50% { filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 25px rgba(168, 85, 247, 0.5)); }
        }
        .curve-glow {
          animation: pathGlow 3s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={cursorRef}
        className="fixed w-6 h-6 rounded-full bg-purple-500/30 pointer-events-none z-50 blur-sm transition-transform duration-100 ease-out"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {/* Sun/Horizon Glow Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-900/80 via-purple-900/10 to-transparent z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-600/20 via-purple-400/10 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/10 to-transparent rounded-full animate-pulse" style={{
              boxShadow: '0 0 120px 80px rgba(168, 85, 247, 0.15)',
              filter: 'blur(40px)'
            }}></div>
          </div>
          
          {/* Horizon Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          
          {/* Glow Particles */}
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 50 + 50 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.6 + 0.1,
                filter: 'blur(1px)',
                animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Floating Particles */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`particle-${i}`}
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
      `}</style>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-12">
            <span className="text-sm text-white/90 font-light tracking-wide">Web3SecureNet</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-10 leading-tight tracking-tight">
            Explore the future
            <br />
            of digital assets
          </h1>

          <p className="text-xl text-white/70 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Helps you Back up all your Digital assets to avoid cyber attacks from quantum computer hackers (Internet Crash)
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 text-xs font-medium tracking-wide glow-button">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-1.5 bg-black hover:bg-gray-900 rounded-lg transition-all duration-200 text-xs font-medium border border-gray-800 tracking-wide">
              Register
            </Link>
          </div>
        </div>
        <div className="relative w-full h-32 mt-20 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-32 curve-glow"
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
      </section>

      {/* Crypto Price Ticker */}
      <div className="relative bg-gradient-to-r from-purple-900/30 via-purple-900/10 to-purple-900/30 border-t border-b border-purple-500/20 overflow-hidden">
        <div className="relative py-4">
          <div className="flex items-center whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-12 px-8">
                {[
                  { symbol: 'BTC', name: 'Bitcoin', price: '$34,850.12', change: '+2.34%', isUp: true },
                  { symbol: 'ETH', name: 'Ethereum', price: '$1,856.74', change: '+1.23%', isUp: true },
                  { symbol: 'SOL', name: 'Solana', price: '$102.56', change: '+5.67%', isUp: true },
                  { symbol: 'XRP', name: 'Ripple', price: '$0.6215', change: '-0.45%', isUp: false },
                  { symbol: 'ADA', name: 'Cardano', price: '$0.3872', change: '+0.89%', isUp: true },
                  { symbol: 'DOT', price: '$5.23', name: 'Polkadot', change: '+3.21%', isUp: true },
                  { symbol: 'MATIC', price: '$0.78', name: 'Polygon', change: '+1.56%', isUp: true },
                  { symbol: 'AVAX', price: '$20.45', name: 'Avalanche', change: '-1.23%', isUp: false },
                ].map((crypto, idx) => (
                  <div key={`${crypto.symbol}-${i}-${idx}`} className="flex items-center space-x-3">
                    <div className="text-white font-medium">{crypto.symbol}</div>
                    <div className="text-white/70">${parseFloat(crypto.price.replace(/[^0-9.]/g, '')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>
                    <div className={`text-sm ${crypto.isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.change}
                    </div>
                    <div className="w-px h-6 bg-purple-500/30"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-block;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-12">
            <span className="text-sm text-white/90 font-light tracking-wide">About Us</span>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Revolutionizing
                <br />
                digital exchange
              </h2>

              <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                <p>
                  At Web3security ledger, we're building the bridge between you and the decentralized web.
                </p>

                <p>
                  Our mission is to make <span className="text-white font-medium">Web3 accessible, secure, and seamless</span> for everyone — from first-time crypto users to seasoned blockchain developers. With our cutting-edge <span className="text-white font-medium">Wallet Connect</span> solutions, we empower users to connect their favorite wallets to dApps, NFTs, DeFi protocols, and beyond — safely and instantly.
                </p>

                <p>
                  We're not just building tools — we're shaping the future of digital freedom. By prioritizing <span className="text-white font-medium">security, transparency, and user control</span>, we ensure your journey into Web3 is smooth, private, and fully under your command.
                </p>
              </div>

              <Link to="/signup" className="mt-10 inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 text-sm font-medium tracking-wide glow-button">
                Register
              </Link>
            </div>

            <div className="relative group">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-900/10 to-purple-600/10 rounded-2xl border border-purple-500/30 flex items-center justify-center overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-[url('/fc7c8e8a-a310-415e-a645-f2d8f9911e29.jpg')] bg-cover bg-center opacity-80 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-transparent to-transparent"></div>
                <div className="relative z-10 text-center p-6">
                  
                </div>
                {/* Glow effect bottom right */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white rounded-full filter blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-32 mt-20 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-32 curve-glow"
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
            <path
              d="M0,60 C200,0 400,80 600,40 C800,0 1000,80 1200,20"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              opacity="0.5"
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
      </section>

      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-light mb-20 tracking-wide">
            Web3security ledger by the numbers
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{stats.users}K+</div>
              <div className="text-base text-white/60 font-light tracking-wide">Active Users</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{stats.backups}K+</div>
              <div className="text-base text-white/60 font-light tracking-wide">Backups</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{stats.listings}K+</div>
              <div className="text-base text-white/60 font-light tracking-wide">NFT Listings</div>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{stats.creators}K+</div>
              <div className="text-base text-white/60 font-light tracking-wide">Creators</div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-32 mt-20 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-32 curve-glow"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,40 Q150,80 300,40 T600,40 T900,40 T1200,40"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M0,60 Q150,100 300,60 T600,60 T900,60 T1200,60"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="1.5"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 0.4 }} />
                <stop offset="25%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                <stop offset="75%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative">
          <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-12">
            <span className="text-sm text-white/90 font-light tracking-wide">How It Works</span>
          </div>

          <div className="relative flex flex-col md:flex-row gap-16">
            {/* Sticky Left Side */}
            <div className="md:sticky md:top-32 self-start md:w-5/12 lg:w-1/2">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Backup your
                <br />
                wallet in 3 simple
                <br />
                steps
              </h2>
              <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-12"></div>
              <div className="hidden md:block">
                <p className="text-white/70 text-lg max-w-md">
                  Follow these simple steps to secure your digital assets with our cutting-edge protection technology.
                </p>
              </div>
            </div>

            {/* Scrollable Right Side */}
            <div className="md:w-7/12 lg:w-1/2 space-y-32 md:pl-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-purple-400 text-lg font-medium">01</span>
                  <h3 className="text-2xl font-bold">Connect your wallet</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Click connect wallet button.
                </p>
                <div className="relative group w-full aspect-video rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/4e67af24-337a-4b54-90b3-8b83cea0f6a9.jpg')] bg-cover bg-center opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent"></div>
                  <div className="absolute inset-0 border border-purple-500/30 rounded-2xl pointer-events-none"></div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-purple-400 text-lg font-medium">02</span>
                  <h3 className="text-2xl font-bold">Verify your assets</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Review all your digital assets and select what you want to backup securely.
                </p>
                <div className="relative group w-full aspect-video rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/8bc7dee3-53c4-4ada-b141-65e1cdd15823.jpg')] bg-cover bg-center opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent"></div>
                  <div className="absolute inset-0 border border-purple-500/30 rounded-2xl pointer-events-none"></div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-purple-400 text-lg font-medium">03</span>
                  <h3 className="text-2xl font-bold">Secure backup complete</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Your assets are now safely backed up and protected from quantum computer threats.
                </p>
                <div className="relative group w-full aspect-video rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/a65b2556-b1ec-4a43-b35b-08e3e0a8062f.jpg')] bg-cover bg-center opacity-90"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent"></div>
                  <div className="absolute inset-0 border border-purple-500/30 rounded-2xl pointer-events-none"></div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-32 mt-20 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-32 curve-glow"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,50 Q100,10 200,50 Q300,90 400,50 Q500,10 600,50 Q700,90 800,50 Q900,10 1000,50 Q1100,90 1200,50"
              fill="none"
              stroke="url(#gradient4)"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d="M0,70 Q100,30 200,70 Q300,110 400,70 Q500,30 600,70 Q700,110 800,70 Q900,30 1000,70 Q1100,110 1200,70"
              fill="none"
              stroke="url(#gradient4)"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M0,30 Q100,-10 200,30 Q300,70 400,30 Q500,-10 600,30 Q700,70 800,30 Q900,-10 1000,30 Q1100,70 1200,30"
              fill="none"
              stroke="url(#gradient4)"
              strokeWidth="1"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#7c3aed', stopOpacity: 0.3 }} />
                <stop offset="20%" style={{ stopColor: '#a855f7', stopOpacity: 0.7 }} />
                <stop offset="40%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
                <stop offset="60%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                <stop offset="80%" style={{ stopColor: '#9333ea', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6 bg-[#1a1a3e]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-6 mx-auto">
              <span className="text-sm text-white/90 font-light tracking-wide">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-white/70">Join thousands of satisfied users who trust us with their digital assets</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Web3SecureNet has completely changed how I manage my crypto portfolio. The security features give me peace of mind.",
                author: "Alex Johnson",
                role: "Crypto Trader"
              },
              {
                quote: "The multi-chain support is a game changer. I can secure all my assets in one place with top-notch security.",
                author: "Sarah Williams",
                role: "Blockchain Developer"
              },
              {
                quote: "Incredibly user-friendly interface with enterprise-level security. Highly recommended for anyone serious about crypto.",
                author: "Michael Chen",
                role: "Crypto Enthusiast"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-b from-purple-900/20 to-transparent p-8 rounded-2xl border border-purple-500/20">
                <div className="text-yellow-400 text-2xl mb-4">"</div>
                <p className="text-white/80 mb-6 italic">{testimonial.quote}</p>
                <div className="border-t border-purple-500/20 pt-4">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-purple-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-[#1a1a3e] to-[#0a0a1f]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-6 mx-auto">
              <span className="text-sm text-white/90 font-light tracking-wide">FAQs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-white/70">Find answers to common questions about Web3SecureNet and our services</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does Web3SecureNet protect my digital assets?",
                answer: "Web3SecureNet uses military-grade encryption (AES-256) to secure your digital assets. Your private keys are encrypted and stored securely, with multiple layers of protection against unauthorized access."
              },
              {
                question: "Which blockchains does Web3SecureNet support?",
                answer: "We support all major blockchains including Ethereum, Solana, Polygon, and more. Our platform is designed to be chain-agnostic, allowing you to secure assets across multiple networks."
              },
              {
                question: "How do I recover my account if I lose access?",
                answer: "We provide a secure recovery process that uses multi-factor authentication and your designated recovery contacts. You'll need to verify your identity through multiple steps to regain access to your account."
              },
              {
                question: "Is there a mobile app available?",
                answer: "Yes, Web3SecureNet is available on both iOS and Android devices, allowing you to manage your digital assets securely on the go."
              },
              {
                question: "What makes Web3SecureNet different from other wallets?",
                answer: "Unlike traditional wallets, Web3SecureNet focuses on enterprise-grade security with features like multi-signature support, transaction simulation, and real-time threat detection to keep your assets safe."
              }
            ].map((faq, index) => (
              <div key={index} className="group" onClick={() => {
                const content = document.getElementById(`faq-content-${index}`);
                const icon = document.getElementById(`faq-icon-${index}`);
                if (content && icon) {
                  content.classList.toggle('max-h-0');
                  content.classList.toggle('max-h-64');
                  icon.classList.toggle('rotate-180');
                }
              }}>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/30 to-transparent border border-purple-500/20 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-500/40">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <svg id={`faq-icon-${index}`} className="w-5 h-5 text-purple-400 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div id={`faq-content-${index}`} className="px-6 pt-0 pb-0 bg-gradient-to-b from-purple-900/10 to-transparent rounded-b-xl max-h-0 overflow-hidden transition-all duration-300">
                  <p className="pb-6 text-white/70">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 py-8 px-6 bg-[#0a0a1f] border-t border-purple-900/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">© {new Date().getFullYear()} Web3SecureNet. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-900/20 via-purple-800/10 to-transparent pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-64"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 Q300,100 600,180 T1200,200 L1200,300 L0,300 Z"
            fill="url(#gradient)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6b21a8', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#1e1b4b', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-[45%] left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500 blur-[2px]"></div>
    </div>
  );
}

export default Home;
