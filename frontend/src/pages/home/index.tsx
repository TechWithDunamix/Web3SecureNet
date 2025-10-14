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
      <style>{`
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

      <div className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full bg-purple-500 blur-sm"></div>

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

            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center">
                <span className="text-white/40 text-lg">Image Placeholder</span>
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

      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="inline-flex items-center space-x-2 bg-transparent border border-purple-500/50 rounded-full px-5 py-2 mb-12">
            <span className="text-sm text-white/90 font-light tracking-wide">How It Works</span>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="md:sticky md:top-32">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Backup your
                <br />
                wallet in 3 simple
                <br />
                steps
              </h2>
            </div>

            <div className="space-y-32">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-purple-400 text-lg font-medium">01</span>
                  <h3 className="text-2xl font-bold">Connect your wallet</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Click connect wallet button.
                </p>
                <div className="w-full aspect-video bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center">
                  <span className="text-white/40 text-lg">Step 1 Image</span>
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
                <div className="w-full aspect-video bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center">
                  <span className="text-white/40 text-lg">Step 2 Image</span>
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
                <div className="w-full aspect-video bg-gradient-to-br from-purple-900/30 to-purple-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center">
                  <span className="text-white/40 text-lg">Step 3 Image</span>
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
