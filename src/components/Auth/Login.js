import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import ExperienceFlowLogo from '../../assets/experienceflow-logo.svg';
import authService from '../../services/authService';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Static login credentials
      const PHARMA_EMAIL = 'management@experienceflow.ai';
      const ITSM_ADMIN_EMAIL = 'adminitsm@experienceflow.ai';
      const ITSM_CEO_EMAIL = 'ceo@experienceflow.ai';
      const ALLOWED_PASSWORD = 'xFlow@321';

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const email = formData.email.trim().toLowerCase();
      const validEmails = [PHARMA_EMAIL, ITSM_ADMIN_EMAIL, ITSM_CEO_EMAIL];

      if (formData.password === ALLOWED_PASSWORD && validEmails.includes(email)) {

        const roleMap = {
          [PHARMA_EMAIL]: { role: 'admin', name: 'Management User' },
          [ITSM_ADMIN_EMAIL]: { role: 'itsm-admin', name: 'ITSM Admin' },
          [ITSM_CEO_EMAIL]: { role: 'itsm-ceo', name: 'CEO' },
        };

        const mockUser = {
          email: formData.email,
          name: roleMap[email].name,
          role: roleMap[email].role,
        };

        // Persist session to localStorage so refresh doesn't log the user out
        authService.setToken('dummy-session-token');
        authService.setUser(mockUser);

        onLogin(mockUser);
      } else {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        email: 'An unexpected error occurred.',
        password: 'An unexpected error occurred.'
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#daf5f0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg">
              <img
                src={ExperienceFlowLogo}
                alt="ExperienceFlow"
                className="w-16 h-16 rounded-2xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ExperienceFlow</h1>
            <p className="text-sm text-slate-500 mt-1">Hospital Pharma Procurement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-gray-200 focus:border-gray-900'
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-slate-200 focus:ring-gray-200 focus:border-gray-900'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-sm text-gray-900 hover:text-black font-medium">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>



          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-gray-900 hover:text-black font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
