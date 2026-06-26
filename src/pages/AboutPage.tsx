import { Activity, Target, Zap, Users, Shield, Award, Heart, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Personalization',
    description: 'Every athlete is unique. Our AI adapts training plans to your specific goals, fitness level, and available resources.',
  },
  {
    icon: Zap,
    title: 'Science-Backed',
    description: 'All training methods are grounded in sports science research and validated by professional coaches.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Professional-level training guidance available to athletes of all levels, from beginners to advanced.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your training data is yours. We maintain strict privacy standards and never sell your information.',
  },
];

const features = [
  { label: 'Sports Supported', value: '7+' },
  { label: 'Training Drills', value: '500+' },
  { label: 'Exercise Library', value: '1000+' },
  { label: 'Active Athletes', value: '50K+' },
];

const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Sports Science Director',
    description: 'Former Olympic coach with 15+ years in athlete development',
  },
  {
    name: 'Marcus Williams',
    role: 'Head of AI',
    description: 'ML researcher specializing in adaptive training algorithms',
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Lead UX Designer',
    description: 'Designed fitness apps used by millions of athletes',
  },
];

export function AboutPage() {
  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Athletic Training
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AthleteAI combines cutting-edge artificial intelligence with proven sports science
            to deliver personalized training programs that help athletes of all levels reach
            their full potential.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {feature.value}
                </div>
                <div className="text-gray-600 mt-1">{feature.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                We believe every athlete deserves access to world-class training guidance.
                Our mission is to democratize elite sports training, making it accessible,
                affordable, and effective for athletes worldwide.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-blue-600 font-semibold mb-2">Step 1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Sport</h3>
              <p className="text-gray-600">
                Select from our growing library of sports and identify the specific area you want to improve.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-emerald-600 font-semibold mb-2">Step 2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Goals</h3>
              <p className="text-gray-600">
                Complete a brief questionnaire so our AI understands your unique needs and constraints.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-purple-600 font-semibold mb-2">Step 3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Train & Improve</h3>
              <p className="text-gray-600">
                Follow your personalized plan, track progress, and watch your performance soar.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <div className="text-blue-600 text-sm mb-2">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 text-center">
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Join thousands of athletes who are already achieving their goals with AthleteAI.
            </p>
            <a
              href="/sports"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <Award className="w-5 h-5 mr-2" />
              Start Training Free
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
