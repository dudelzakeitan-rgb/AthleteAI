import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function OnboardingGate({ children }: { children: ReactNode }) {
  const { session, preferences, preferencesLoaded } = useApp();
  const location = useLocation();

  if (!session || !preferencesLoaded || preferences) return <>{children}</>;

  if (location.pathname.startsWith('/onboarding')) return <>{children}</>;

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">One quick questionnaire</h2>
        <p className="text-gray-600 mb-8">
          Answer a few questions about your goals, sports, experience, and equipment once. We use
          the answers for every workout and coach chat, so you never fill this in again.
        </p>
        <Link
          to="/onboarding"
          state={{ from: location.pathname + location.search }}
          className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Set My Training Preferences
        </Link>
      </div>
    </div>
  );
}
