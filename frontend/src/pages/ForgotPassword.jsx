import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, User } from 'lucide-react';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'student',
    verificationValue: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email: formData.email,
        role: formData.role,
        verificationValue: formData.verificationValue,
        newPassword: formData.newPassword,
      });

      toast.success(response.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Password reset failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg transition-colors duration-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border">
        <div>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30">
            A
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Verify your details to secure and update your password
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Your Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Registered Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@test.com"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Verification Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {formData.role === 'student' ? 'Parent Registered Email' : 'Master Reset Key'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <input
                type={formData.role === 'student' ? 'text' : 'password'}
                name="verificationValue"
                required
                value={formData.verificationValue}
                onChange={handleChange}
                placeholder={formData.role === 'student' ? "parent@test.com" : "Enter secret master key"}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.role === 'student'
                ? "Verification relies on your registered parent email address."
                : "Enter your role-specific secret platform reset code."}
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
