'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Shield, Zap, Code, ArrowRight, CheckCircle2, Github, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          router.push('/dashboard');
        }
      } catch (e) { }
    };
    checkAuth();
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Mail className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Signature Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-blue-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-blue-400 transition-colors">How it works</a>
              <Link
                href="/api/auth/login"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>Professional Email Signature Tool</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
              Render & Send <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Byte-for-Byte HTML
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
              Stop letting email clients break your design. We send your signature exactly as you code it. No sanitization, no resizing, no compromises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/api/auth/login"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25 flex items-center gap-2"
              >
                Start Sending Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700"
              >
                View Features
              </a>
            </div>

            {/* Preview UI Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10" />
              <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden p-2">
                <div className="bg-[#0f172a] rounded-xl p-4 md:p-8 text-left font-mono text-sm overflow-x-auto border border-slate-800">
                  <pre className="text-blue-400">
                    {`<table width="100%" cellpadding="0" cellspacing="0"
  style="font-family: Arial, sans-serif;">
  <tr>
    <td>
      <p style="font-size:18px;">Best regards,</p>
      <p style="font-weight:bold;">Ibrar</p>
      <img src="logo.png" style="width:200px;" />
    </td>
  </tr>
</table>`}
                  </pre>
                  <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Byte-for-Byte Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[#0f172a] relative border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Why Signature Pro?</h2>
              <p className="text-slate-400 text-lg">Engineered for low-level email precision.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8 text-blue-400" />,
                  title: "Zero Sanitization",
                  desc: "We don't touch your HTML. Scripts (if supported), complex tables, and inline styles are preserved exactly as provided."
                },
                {
                  icon: <Code className="w-8 h-8 text-indigo-400" />,
                  title: "Raw HTML Power",
                  desc: "No WYSIWYG mess. Use our raw editor to paste your professional signature code directly."
                },
                {
                  icon: <Zap className="w-8 h-8 text-purple-400" />,
                  title: "Instant Gmail Sync",
                  desc: "Connect your Google workspace account and start sending emails with your professional signature in seconds."
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#1e293b]/50 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                  <div className="mb-6 p-4 rounded-2xl bg-slate-900 w-fit">{f.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps / Guide Section */}
        <section className="py-24 bg-slate-900/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Complete Setup Guide</h2>
              <p className="text-slate-400 text-lg">Follow these simple steps to master your signatures.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "Step 1", title: "OAuth Login", desc: "Sign in with your Google account. We only request permissions to manage and send emails on your behalf.", icon: <Shield className="w-6 h-6" /> },
                { step: "Step 2", title: "Design HTML", desc: "Design your signature using standard HTML tables and inline CSS for maximum compatibility.", icon: <Code className="w-6 h-6" /> },
                { step: "Step 3", title: "Paste & Save", desc: "Navigate to settings in your dashboard and paste your raw HTML. No filters applied.", icon: <CheckCircle2 className="w-6 h-6" /> },
                { step: "Step 4", title: "Send Quality", desc: "Compose your mail. Your signature is automatically injected at the bottom of every email.", icon: <Zap className="w-6 h-6" /> }
              ].map((s, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-[#0f172a] border border-slate-800 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
                    {i + 1}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 mt-4 flex items-center gap-2">
                    <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{s.icon}</span>
                    {s.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Details Section */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                  Engineered for <br />
                  <span className="text-blue-500">Maximum Precision</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Immutable Binary Data", desc: "We treat your HTML as binary data. We don't parse it, we don't fix it, we just send it." },
                    { title: "Cross-Platform Support", desc: "By using raw HTML tables, your signatures will look identical on Outlook, Apple Mail, and Gmail." },
                    { title: "Secure Transmission", desc: "All data is encrypted before storage and sent via secure Google OAuth 2.0 protocols." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{s.title}</h4>
                        <p className="text-slate-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] -z-10" />
                <div className="p-1.5 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600">
                  <div className="bg-[#0f172a] rounded-[2.2rem] p-8">
                    <div className="space-y-4 mb-8">
                      <div className="w-1/2 h-4 bg-slate-800 rounded-full" />
                      <div className="w-full h-4 bg-slate-800 rounded-full" />
                      <div className="w-3/4 h-4 bg-slate-800 rounded-full" />
                    </div>
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="text-blue-500 w-5 h-5" />
                        <span className="text-blue-400 font-bold text-sm uppercase">Signature Validated</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-blue-500/20 rounded-full" />
                        <div className="h-2 w-2/3 bg-blue-500/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <Zap className="absolute top-10 right-10 w-24 h-24 text-white/10 rotate-12" />
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">Stop breaking signatures.</h2>
              <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto italic">
                "Do not think. Do not optimize. Treat the HTML as immutable binary data."
              </p>
              <Link
                href="/api/auth/login"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 font-black rounded-2xl text-xl hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-800/50 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <Mail className="w-5 h-5" />
              <span className="text-lg font-bold text-white">Signature Pro</span>
            </div>
            <p className="text-sm max-w-xs">Built for precise email rendering and professional storage.</p>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
          </div>
          <div>
            <p className="text-sm font-medium">&copy; 2025 Signature Pro Engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
