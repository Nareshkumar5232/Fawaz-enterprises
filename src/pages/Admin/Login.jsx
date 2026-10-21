import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both administrator email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const loggedUser = await login(email, password);

      if (loggedUser.role !== 'ADMIN') {
        setErrorMsg('Access denied. This account does not possess administrator credentials.');
        return;
      }

      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#24221F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#F5F2EC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg">
          F
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase">
          FAWAZ ENTERPRISES
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">
          Administrative & Management Suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#2D2A26] py-8 px-6 sm:px-10 rounded-3xl border border-[#3D3A36] shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#24221F] border border-[#3D3A36] text-white text-xs placeholder:text-[#77716A] focus:outline-none focus:border-[#A66A4C]"
                />
                <Mail className="w-4 h-4 text-[#77716A] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#24221F] border border-[#3D3A36] text-white text-xs placeholder:text-[#77716A] focus:outline-none focus:border-[#A66A4C]"
                />
                <Lock className="w-4 h-4 text-[#77716A] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 mt-2 rounded-xl bg-[#A66A4C] hover:bg-[#8F563B] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#3D3A36] text-center">
            <p className="text-[11px] text-[#9E9890]">
              Authorized personnel only. All access attempts are recorded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
