import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Package,
  Share2,
  Database,
  Rocket,
  ShieldAlert,
  HelpCircle,
  Code2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserAccount, PlatformConfig } from './types';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ShareModal } from './components/ShareModal';
import { PipelineWizard } from './components/PipelineWizard';
import { PWAInstallButton } from './components/PWAInstallButton';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    isPromoMode: true,
    isPaidModeActive: false,
    pricePerAppCFA: 2500,
    adminPin: '1234',
    mobileMoneyAPIs: {
      orangeMoney: { enabled: true, merchantKey: 'OM_PROD_DEMO_KEY' },
      mtnMoMo: { enabled: true, subscriptionKey: 'MOMO_PRIMARY_KEY' },
      wave: { enabled: true, apiToken: 'WAVE_CI_TEST_TOKEN' },
      moovMoney: { enabled: false, apiSecret: 'MOOV_SECRET_VAL' },
    },
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Load user from localStorage & fetch platform config
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('appforge_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {}

    fetch('/api/platform/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setPlatformConfig(data.config);
      })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('appforge_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('appforge_user');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        platformConfig={platformConfig}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenShare={() => setShowShareModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Plateforme de Génération & Déploiement d'Applications</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Créez et Déployez des Applications Prêtes à l'Emploi de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">A à Z</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              À partir d'une simple explication écrite, générez des applications et sites web installables sur 
              <strong> Mobile</strong>, <strong>Tablette</strong> et <strong>Ordinateur</strong>. 
              Inclut la version démo en temps réel, la création d'APK Android, d'AAB pour le Google Play Store, 
              la base de données intégrée, la phase de tests, et les solutions de déploiement instantanées.
            </p>

            {/* Feature highlights grid */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 p-2.5 rounded-xl">
                <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-medium">Installable PWA & APK</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 p-2.5 rounded-xl">
                <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 font-medium">Base de données</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300 font-medium">Preview à chaque étape</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 p-2.5 rounded-xl">
                <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">Partage QR & WhatsApp</span>
              </div>
            </div>

            {/* Action Buttons: Direct Install & Registration */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <PWAInstallButton variant="hero" label="Installer l'Application Directement" appName="AppForge Studio" />

              {!currentUser && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <span>S'inscrire (Nom, Prénom & Mobile Money)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Account Blocked Warning if applicable */}
        {currentUser && currentUser.isBlocked && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="text-white block">Votre compte a été suspendu par l'administrateur</strong>
                <span>Veuillez contacter le support ou l'administrateur pour débloquer votre accès.</span>
              </div>
            </div>
            <button
              onClick={() => setShowAdminModal(true)}
              className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-lg text-xs font-semibold transition"
            >
              Espace Admin
            </button>
          </div>
        )}

        {/* The 6-Stage App Generator Pipeline */}
        <PipelineWizard
          currentUser={currentUser}
          platformConfig={platformConfig}
          onRequireAuth={() => setShowAuthModal(true)}
        />
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">AppForge Studio</span>
            <span className="text-slate-400">— Créateur & Déployeur d'applications mobiles, tablettes et PC</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowShareModal(true)}
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager l'App</span>
            </button>
            <button
              onClick={() => setShowAdminModal(true)}
              className="hover:text-amber-400 transition flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administration (1234)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfigChanged={(newConfig) => setPlatformConfig(newConfig)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Persistent Floating Install Button */}
      <PWAInstallButton variant="floating" appName="AppForge Studio" />
    </div>
  );
}

export default App;
