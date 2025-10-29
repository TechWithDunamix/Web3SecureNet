import { User, X } from 'lucide-react';
import { type Profile } from '../../../services/apiService';
import { useState } from 'react';
import { apiService } from '../../../services/apiService';
import { toast } from 'react-toastify';
import { ChangePasswordModal } from '../../../components/modals/ChangePasswordModal';

interface ProfileSectionProps {
  user: Profile | null;
  onProfileUpdate?: (updatedUser: Profile) => void;
}

export function ProfileSection({ user, onProfileUpdate }: ProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

  // Combine first and last name for display
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  const handleUpdateProfile = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsModalOpen(false);

      if (onProfileUpdate) {
        onProfileUpdate(response.user);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Profile</h2>

      <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{fullName || user.email}</h3>
            <p className="text-white/60">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${user.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {user.verified ? 'Verified' : 'Not Verified'}
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
              <p className="text-white">{fullName || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Member Since</label>
              <p className="text-white">{new Date(user.date_joined).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Address</label>
              <p className="text-white">{user.address || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Verification Status</label>
              <span className={`px-3 py-1 rounded-full text-sm ${user.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {user.verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a3e]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Account Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              Update Profile
            </button>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full bg-[#0a0a1f]/50 hover:bg-[#0a0a1f] border border-purple-500/30 px-4 py-2 rounded-lg transition-colors"
            >
              Change Password
            </button>
            <button className="w-full bg-[#0a0a1f]/50 hover:bg-[#0a0a1f] border border-purple-500/30 px-4 py-2 rounded-lg transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Profile Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a3e] border border-purple-500/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Update Profile</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-[#0a0a1f]/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Enter your address (optional)"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#0a0a1f]/50 hover:bg-[#0a0a1f] border border-purple-500/30 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordChanged={() => {
          toast.success('Password changed successfully');
          setIsPasswordModalOpen(false);
        }}
      />
    </div>
  );
}
