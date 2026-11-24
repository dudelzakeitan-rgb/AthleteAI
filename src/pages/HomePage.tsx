import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Trophy, Zap, Heart, Target, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const features = [
  {
    icon: Target,
    title: 'Personalized Plans',
    description: 'AI-generated training plans tailored to your specific goals and skill level',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Trophy,
    title: 'Track Progress',
    description: 'Monitor your improvements with detailed analytics and achievement badges',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Nutrition Guidance',
    description: 'Get personalized meal recommendations for optimal performance',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Science-Backed',
    description: 'Training methods developed by professional coaches and sports scientists',
    color: 'from-amber-500 to-orange-500',
  },
];

const stats = [
  { value: '50K+', label: 'Athletes', icon: Users },
  { value: '100+', label: 'Training Plans', icon: Target },
  { value: '95%', label: 'Success Rate', icon: TrendingUp },
];

export function HomePage() {
  const location = useLocation();
  const workoutSaved = Boolean((location.state as { workoutSaved?: boolean } | null)?.workoutSaved);

  return (
    <div className="pt-16">
      {workoutSaved && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-emerald-500 text-white rounded-full shadow-lg animate-slide-up flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Workout saved!
        </div>
      )}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Personal AI
              <br />
              <span className="text-cyan-200">Sports Coach</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Get personalized training plans, exercises, nutrition advice,
              and performance improvement recommendations.
            </p>

            <Link
              to="/sports"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 group"
            >
              Start Training
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Athletes Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Performance?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of athletes who have already improved their skills with AthleteAI.
          </p>
          <Link
            to="/sports"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            Get Started Free
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
