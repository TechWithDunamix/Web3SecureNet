import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function PasswordRecovery() {
  const { uid, token } = useParams();
  const confirming = Boolean(uid && token);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (confirming && password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const result = confirming
        ? await authAPI.confirmPasswordReset({ uid: uid!, token: token!, password })
        : await authAPI.requestPasswordReset(email);
      setMessage(result.message);
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { detail?: unknown } } }).response;
      setError(typeof response?.data?.detail === 'string'
        ? response.data.detail : 'Unable to reset your password. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f] text-white flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-[#1a1a3e] border border-purple-500/30 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-3">{confirming ? 'Choose a new password' : 'Forgot password?'}</h1>
        {message ? <p role="status" className="my-6 text-white/80">{message}</p> : (
          <form onSubmit={submit} className="space-y-5 mt-6">
            <p className="text-white/70">{confirming ? 'Set a new password for your account.' : 'Enter your account email to request a password reset link.'}</p>
            {error && <p role="alert" className="text-red-400">{error}</p>}
            {confirming ? <>
              <label className="block">New password
                <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} disabled={loading} className="mt-2 w-full bg-[#0a0a1f] border border-purple-500/30 rounded-xl p-3" />
              </label>
              <label className="block">Confirm password
                <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={loading} className="mt-2 w-full bg-[#0a0a1f] border border-purple-500/30 rounded-xl p-3" />
              </label>
            </> : <label className="block">Email
              <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading} className="mt-2 w-full bg-[#0a0a1f] border border-purple-500/30 rounded-xl p-3" />
            </label>}
            <button disabled={loading} className="w-full bg-purple-600 py-3 rounded-xl disabled:opacity-50">
              {loading ? 'Please wait...' : confirming ? 'Reset password' : 'Send reset link'}
            </button>
          </form>
        )}
        <Link to="/login" className="block mt-6 text-purple-300">Back to sign in</Link>
      </section>
    </main>
  );
}
