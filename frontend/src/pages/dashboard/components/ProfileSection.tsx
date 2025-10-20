import { User } from 'lucide-react';
import { type Profile } from '../../../services/apiService';

interface ProfileSectionProps {
  user: Profile | null;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  if (!user) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Profile</h2>
        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center">
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Profile</h2>

      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
            {user.id_card_front_url ? (
              <img src={user.id_card_front_url} alt="Profile" className="w-full h-full rounded-full" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user.full_name}</h3>
            <p className="text-white/60">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                user.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {user.verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Full Name</label>
              <p className="text-white">{user.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            {user.address && (
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Address</label>
                <p className="text-white">{user.address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Security</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
              Change Password
            </button>
            <button className="w-full bg-[#0a0a1f]/50 hover:bg-[#0a0a1f] border border-purple-500/30 px-4 py-2 rounded-lg transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
