import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Loader2,
  LogIn,
  User,
  Activity,
  CheckCircle,
} from 'lucide-react';
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

export function AuthPage() {
  const { savePreferences } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode: Mode = location.pathname === '/signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignIn = mode === 'signin';

  const switchMode = () => {
    setMode(isSignIn ? 'signup' : 'signin');
    setError(null);
    setNotice(null);
  };

  const createProfile = async (userId: string, displayName: string) => {
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: userId,
      name: displayName,
      notifications: true,
      updated_at: new Date().toISOString(),
    });
    if (profileError) {
      setNotice(
        'Your account was created, but your name could not be saved. Finish setting up your profile in Settings.'
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!isSignIn && !trimmedName) {
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

    const result = isSignIn
      ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      : await supabase.auth.signUp({ email: trimmedEmail, password });

    if (result.error) {
      setError(describeAuthError(result.error.message));
      setIsSubmitting(false);
      return;
    }

    if (!isSignIn && result.data.user) {
      await createProfile(result.data.user.id, trimmedName);
      await savePreferences({
        goals: [],
        sports: [],
        skill_level: null,
        equipment: [],
        sessions_per_week: null,
        session_minutes: null,
      });
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-600">
            {isSignIn
              ? 'Sign in to pick up your training where you left off.'
              : 'Your workouts, nutrition, and progress stay in sync on every device.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => mode !== 'signin' && switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isSignIn ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => mode !== 'signup' && switchMode()}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isSignIn ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isSignIn && (
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1.5">Name</span>
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
              <span className="block text-sm font-medium text-gray-700 mb-1.5">Email</span>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-400">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">Password</span>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-400">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {notice && <p className="text-sm text-amber-600">{notice}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg disabled:opacity-60 transition-all"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {isSignIn ? 'Login' : 'Create Account'}
            </button>
          </form>

          {isSignIn && (
            <p className="mt-4 text-center text-sm text-gray-500">
              New here?{' '}
              <button type="button" onClick={switchMode} className="text-blue-600 font-medium hover:text-blue-700">
                Create an account
              </button>
            </p>
          )}
        </div>

        {!isSignIn && (
          <div className="mt-6 flex items-start gap-2 text-sm text-gray-500 justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>
              New athletes answer a short training questionnaire once — it personalizes every workout
              and coach chat. Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
