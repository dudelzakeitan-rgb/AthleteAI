import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Bell,
  Target,
  Activity,
  ChevronRight,
  CheckCircle,
  Save,
  Camera,
  Trash2,
  LogOut,
  Shield,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sportsConfig, SkillLevel, Sport } from '../types';
import { supabase } from '../lib/supabase';

const equipmentOptions = [
  { id: 'pool', label: 'Access to Pool' },
  { id: 'gym', label: 'Gym Membership' },
  { id: 'weights', label: 'Free Weights' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'foam_roller', label: 'Foam Roller' },
  { id: 'pull_buoy', label: 'Pull Buoy' },
  { id: 'kickboard', label: 'Kickboard' },
  { id: 'paddles', label: 'Hand Paddles' },
  { id: 'fins', label: 'Swim Fins' },
  { id: 'stairs', label: 'Stairs/Bleachers' },
  { id: 'ball', label: 'Sports Ball' },
  { id: 'net', label: 'Net/Goal' },
];

const goalOptions = [
  'Improve overall fitness',
  'Lose weight',
  'Build muscle',
  'Increase speed',
  'Improve technique',
  'Prepare for competition',
  'Rehabilitate injury',
  'General health',
];

export function SettingsPage() {
  const { userProfile, setUserProfile, session } = useApp();
  const [activeSection, setActiveSection] = useState<'profile' | 'sport' | 'notifications' | 'account'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 25,
    weight: 70,
    height: 175,
    sport: 'swimming' as Sport,
    skillLevel: 'intermediate' as SkillLevel,
    goal: '',
    equipment: [] as string[],
    notifications: true,
    emailUpdates: true,
    weeklyReport: true,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: '',
        age: userProfile.age || 25,
        weight: userProfile.weight || 70,
        height: userProfile.height || 175,
        sport: userProfile.sport || 'swimming',
        skillLevel: userProfile.skillLevel || 'intermediate',
        goal: userProfile.goal || '',
        equipment: userProfile.equipment || [],
        notifications: userProfile.notifications ?? true,
        emailUpdates: true,
        weeklyReport: true,
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const { data: auth } = await supabase.auth.getUser();
    const profile = {
      id: auth.user?.id || userProfile?.id || 'user-1',
      name: formData.name,
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      sport: formData.sport,
      goal: formData.goal,
      skill_level: formData.skillLevel,
      equipment: formData.equipment,
      notifications: formData.notifications,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('user_profiles').upsert(profile);
    if (error) {
      setSaveError('Your changes could not be saved. Check your connection and try again.');
      setIsSaving(false);
      return;
    }

    setUserProfile({ ...profile, created_at: userProfile?.created_at ?? profile.updated_at } as typeof userProfile);
    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleEquipmentToggle = (equipId: string) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipId)
        ? prev.equipment.filter((e) => e !== equipId)
        : [...prev.equipment, equipId],
    }));
  };

  const calculateBMI = () => {
    const heightM = formData.height / 100;
    return (formData.weight / (heightM * heightM)).toFixed(1);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sport', label: 'Sport & Goals', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {formData.name ? formData.name[0].toUpperCase() : 'A'}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center border border-gray-200">
                      <Camera className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{formData.name || 'Athlete'}</div>
                    <div className="text-sm text-gray-500">{formData.sport}</div>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as typeof activeSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        min={8}
                        max={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        step={0.1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                      <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                        <span className="text-xl font-bold text-gray-900">{calculateBMI()}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({parseFloat(calculateBMI()) < 18.5 ? 'Underweight' : parseFloat(calculateBMI()) < 25 ? 'Normal' : parseFloat(calculateBMI()) < 30 ? 'Overweight' : 'Obese'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'sport' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Primary Sport</h2>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {sportsConfig.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => setFormData({ ...formData, sport: sport.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.sport === sport.id
                            ? `border-blue-500 bg-gradient-to-br ${sport.color} bg-opacity-10`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{sport.name}</div>
                        <div className="text-sm text-gray-500">{sport.improvements.length} areas</div>
                      </button>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setFormData({ ...formData, skillLevel: level as SkillLevel })}
                          className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                            formData.skillLevel === level
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">Select your goal</option>
                      {goalOptions.map((goal) => (
                        <option key={goal} value={goal}>{goal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Equipment</label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {equipmentOptions.map((equip) => (
                        <button
                          key={equip.id}
                          onClick={() => handleEquipmentToggle(equip.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.equipment.includes(equip.id)
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                              : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {formData.equipment.includes(equip.id) && <CheckCircle className="w-4 h-4" />}
                          {equip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'notifications', label: 'Push Notifications', description: 'Receive training reminders and updates', icon: Bell },
                      { key: 'emailUpdates', label: 'Email Updates', description: 'Weekly progress reports and tips', icon: Mail },
                      { key: 'weeklyReport', label: 'Weekly Report', description: 'Get a summary of your weekly progress', icon: Activity },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-200">
                            <setting.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{setting.label}</div>
                            <div className="text-sm text-gray-500">{setting.description}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[setting.key as keyof typeof formData] as boolean}
                            onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>

                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <Lock className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Change Password</div>
                          <div className="text-sm text-gray-500">Update your password</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Language</div>
                          <div className="text-sm text-gray-500">English (US)</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Help & Support</div>
                          <div className="text-sm text-gray-500">Get help with AthleteAI</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Danger Zone</h2>

                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium text-red-900">Clear All Data</div>
                          <div className="text-sm text-red-600">Delete all your training history</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => session && supabase.auth.signOut()}
                      disabled={!session}
                      className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <LogOut className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium text-red-900">Sign Out</div>
                          <div className="text-sm text-red-600">
                            {session ? 'Log out of your account' : 'You are not signed in'}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {showSaveSuccess && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-emerald-500 text-white rounded-full shadow-lg animate-slide-up flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully!
          </div>
        )}

        {saveError && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-full shadow-lg animate-slide-up flex items-center gap-2" role="alert">
            {saveError}
          </div>
        )}
      </div>
    </div>
  );
}
