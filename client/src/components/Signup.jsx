// src/components/Signup.js
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, Sparkles, Check, X } from 'lucide-react';

const Signup = () => {
  const { signup, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
      feedback.push({ text: 'At least 8 characters', met: true });
    } else {
      feedback.push({ text: 'At least 8 characters', met: false });
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push({ text: 'One uppercase letter', met: true });
    } else {
      feedback.push({ text: 'One uppercase letter', met: false });
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push({ text: 'One lowercase letter', met: true });
    } else {
      feedback.push({ text: 'One lowercase letter', met: false });
    }

    if (/\d/.test(password)) {
      score += 1;
      feedback.push({ text: 'One number', met: true });
    } else {
      feedback.push({ text: 'One number', met: false });
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
      feedback.push({ text: 'One special character', met: true });
    } else {
      feedback.push({ text: 'One special character', met: false });
    }

    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time password strength checking
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      toast.success('Account created successfully! Welcome aboard! 🚀', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-yellow-500';
    if (score <= 3) return 'bg-blue-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Good';
    if (score <= 4) return 'Strong';
    return 'Excellent';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-lg animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                <UserPlus className="w-10 h-10 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
              Join TaskMaster
            </h1>
            <p className="text-slate-600 text-lg">
              Create your account and start organizing your life
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'name' || formData.name 
                    ? 'text-blue-600 scale-110' 
                    : 'text-slate-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50/80 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200/60 focus:border-blue-500/60'
                  }`}
                  placeholder="Enter your full name"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'name' ? 'opacity-100' : ''
                }`}></div>
              </div>
              {errors.name && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.name}</p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'email' || formData.email 
                    ? 'text-blue-600 scale-110' 
                    : 'text-slate-400'
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50/80 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200/60 focus:border-blue-500/60'
                  }`}
                  placeholder="Enter your email address"
                />
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'email' ? 'opacity-100' : ''
                }`}></div>
              </div>
              {errors.email && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'password' || formData.password 
                    ? 'text-blue-600 scale-110' 
                    : 'text-slate-400'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50/80 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200/60 focus:border-blue-500/60'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'password' ? 'opacity-100' : ''
                }`}></div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Password Strength</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      passwordStrength.score <= 1 ? 'bg-red-100 text-red-700' :
                      passwordStrength.score <= 2 ? 'bg-yellow-100 text-yellow-700' :
                      passwordStrength.score <= 3 ? 'bg-blue-100 text-blue-700' :
                      passwordStrength.score <= 4 ? 'bg-green-100 text-green-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {item.met ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400" />
                        )}
                        <span className={`text-xs ${item.met ? 'text-green-600' : 'text-slate-500'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'confirmPassword' || formData.confirmPassword 
                    ? (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword 
                        ? 'text-green-600 scale-110' 
                        : 'text-blue-600 scale-110')
                    : 'text-slate-400'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-50/80 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-slate-200/60 focus:border-blue-500/60'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                  focusedField === 'confirmPassword' ? 'opacity-100' : ''
                }`}></div>
              </div>
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <p className="text-sm font-medium">Passwords match!</p>
                </div>
              )}
              {errors.confirmPassword && (
                <div className="flex items-center space-x-2 text-red-600">
                  <X className="w-4 h-4" />
                  <p className="text-sm font-medium">{errors.confirmPassword}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0 || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <div className="flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
              {!isSubmitting && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500 font-medium">Already have an account?</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="group inline-flex items-center space-x-2 text-blue-600 hover:text-purple-600 font-semibold text-lg transition-all duration-300"
            >
              <span>Sign in here</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">Secure & Private</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">Analytics & Insights</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M9 8h6m-3 4v4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">Easy Collaboration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;