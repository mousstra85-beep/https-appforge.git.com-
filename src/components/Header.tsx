import React from 'react';
import {
  Share2,
  Shield,
  User,
  LogOut,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { UserAccount, PlatformConfig } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentUser: UserAccount | null;
  platformConfig: PlatformConfig;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  platformConfig,
  onOpenAuth,
  onOpenAdmin,
  onOpenShare,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>AppForge Studio</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Déploiement A à Z
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Créez & Déployez des Applications Installables (Mobile, Tablette, PC) depuis une Explication Écrite
            </p>
          </div>
        </div>

        {/* Promo Mode Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              platformConfig.isPromoMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-slate-300 font-medium">
            {platformConfig.isPromoMode ? (
              <>
                <strong className="text-emerald-400">Mode Promo :</strong> 100% Gratuit (Sans Paiement)
              </>
            ) : (
              <>
                <strong className="text-amber-400">Mode Payant :</strong> {platformConfig.pricePerAppCFA} FCFA / app
              </>
            )}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Share Button */}
          <button
            id="btn-share-header"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
            title="Partager par QR Code, WhatsApp, etc."
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Partager</span>
          </button>

          {/* User Account / Auth */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                {currentUser.nom[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-white font-bold truncate max-w-[100px]">
                  {currentUser.nom} {currentUser.prenom}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono truncate max-w-[100px]">
                  {currentUser.mobileMoneyNumber}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1 transition ml-1"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>S'inscrire / Connexion</span>
            </button>
          )}

          {/* Admin Dashboard Access */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition"
            title="Espace Administrateur (Code 1234)"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
