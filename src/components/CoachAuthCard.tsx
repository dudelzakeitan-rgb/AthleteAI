import { useState, FormEvent } from 'react';
import { Mail, Lock, Loader2, LogIn, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

type Mode = 'signin' | 'signup';

const MIN_PASSWORD_LENGTH = 6;

function describeAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Email or password is incorrect.';
  if (lower.includes('already registered')) return 'An account with this email already exists. Try signing in.';
  if (lower.includes('password')) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return 'Something went wrong. Please check your connection and try again.';
}

export function CoachAuthCard() {
  const { savePreferences } = useApp();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setNotice(null);
  };

  const createProfile = async (userId: string, displayName: string) => {
    await supabase.from('user_profiles').upsert({
      id: userId,
      name: displayName,
      notifications: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (mode === 'signup' && !trimmedName) {
      setError('Enter your name to create an account.');
      return;
    }
    if (!trimmedEmail || password.length < MIN_PASSWORD_LENGTH) {
      setError(`Enter your email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    const result =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        : await supabase.auth.signUp({ email: trimmedEmail, password });

    if (result.error) {
      setError(describeAuthError(result.error.message));
    } else if (mode === 'signup' && result.data.user) {
      await createProfile(result.data.user.id, trimmedName);
      await savePreferences({
        goals: [],
        sports: [],
        skill_level: null,
        equipment: [],
        sessions_per_week: null,
        session_minutes: null,
      });
    } else if (mode === 'signup' && !result.data.session) {
      setNotice('Account created. You can now sign in.');
      setMode('signin');
    }
    setIsSubmitting(false);
  };

  const isSignIn = mode === 'signin';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {isSignIn ? 'Sign in to chat with your coach' : 'Create an account to start'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          The AI Coach is available to signed-in athletes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isSignIn && (
          <label className="block">
            <span className="sr-only">Name</span>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-400">
              <User className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="sr-only">Email</span>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-400">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="sr-only">Password</span>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-400">
            <Lock className="w-4 h-4 text-gray-400" />
            <input
              type="password"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-emerald-600">{notice}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium transition-all hover:shadow-lg disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          {isSignIn ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        type="button"
        onClick={switchMode}
        className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700"
      >
        {isSignIn ? "New here? Create an account" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}
