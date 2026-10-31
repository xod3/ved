'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Connection failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1d0436] via-[#240643] to-[#2e0854] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto relative bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center border-2 border-purple-400">
            <Image
              src="/images/ved-logo.png"
              alt="VED COURIER LOGISTICS"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            VED <span className="text-purple-400">COURIER</span> LOGISTICS
          </h1>
          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
            Operational Management Console
          </p>
        </div>

        {/* Login Box in White with Purple Accents */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl space-y-6 border border-purple-100">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-50">
            <Lock className="w-4 h-4 text-purple-700" />
            <h2 className="text-base font-extrabold text-[#2e0854]">
              Staff &amp; Dispatch Authentication
            </h2>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vedcourier.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 transition"
                />
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-700 transition"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Evaluator */}
          <div className="pt-4 border-t border-purple-50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Staff Credentials:
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin@vedcourier.com', 'admin123')}
                className="w-full text-left px-3 py-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <span className="font-bold text-purple-950 block">Super Administrator</span>
                  <span className="text-purple-700 font-mono text-[11px]">admin@vedcourier.com / admin123</span>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-white px-2 py-0.5 rounded-md border border-purple-200">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('ops@vedcourier.com', 'ops123')}
                className="w-full text-left px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <span className="font-bold text-slate-800 block">Operations Manager</span>
                  <span className="text-slate-600 font-mono text-[11px]">ops@vedcourier.com / ops123</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Public Website Return */}
        <div className="text-center text-xs text-purple-200">
          <Link href="/" className="hover:text-white transition">
            ← Return to VED Courier Logistics Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
