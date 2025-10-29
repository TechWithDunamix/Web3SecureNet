import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '../../services/apiService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: () => void;
}

export function ChangePasswordModal({ isOpen, onClose, onPasswordChanged }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiService.changePassword({
        old_password: currentPassword,
        new_password: newPassword
      });
      
      toast.success('Password changed successfully');
      onPasswordChanged();
      onClose();
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a3e] border border-purple-500/30 rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Change Password</h2>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-white/80 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0f0f24] border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/80 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0f0f24] border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0f0f24] border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
