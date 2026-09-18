import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'card' | 'floating';
  label?: string;
  appName?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  label,
  appName = 'AppForge Studio',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'android' | 'desktop' | 'ios'>(
    isIOS ? 'ios' : 'auto'
  );

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleInstallClick = async () => {
    if (isInstallable) {
      try {
        const success = await install();
        if (!success) {
          setShowGuideModal(true);
        }
      } catch (e) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // If already running standalone as installed app, display an installed badge
  if (isInstalled) {
    if (variant === 'floating') return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Application Déjà Installée</span>
      </div>
    );
  }

  return (
    <>
      {/* Variant: HERO */}
      {variant === 'hero' && (
        <button
          id="btn-install-app-hero"
          onClick={handleInstallClick}
          className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-95 transition transform duration-150"
          title="Installer directement sur votre téléphone, tablette ou ordinateur"
        >
          <span className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Download className="w-3.5 h-3.5 text-white animate-bounce" />
          </span>
          <div className="text-left leading-tight">
            <div className="font-extrabold">{label || "Installer l'Application Directement"}</div>
            <div className="text-[10px] text-white/80 font-normal">Accès 1 clic • Mode hors-ligne</div>
          </div>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-white/25 text-white">
            PWA
          </span>
        </button>
      )}

      {/* Variant: HEADER */}
      {variant === 'header' && (
        <button
          id="btn-install-app-header"
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition active:scale-95 border border-emerald-400/30"
          title="Installer l'application sur votre appareil"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{label || "Installer l'App"}</span>
        </button>
      )}

      {/* Variant: CARD (Used in Step 6 / Project final view) */}
      {variant === 'card' && (
        <button
          id="btn-install-app-card"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 hover:border-emerald-400 text-left transition group shadow-lg shadow-emerald-950/40 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>{label || "Installer directement l'application sur mon appareil"}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Instantané
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Fonctionne sur smartphone Android, iPhone, tablette et ordinateur (PC/Mac). Aucune boutique requise.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shrink-0 group-hover:bg-emerald-400 transition">
            Installer
          </span>
        </button>
      )}

      {/* Variant: FLOATING (Corner button on bottom right) */}
      {variant === 'floating' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            id="btn-install-app-floating"
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-2xl shadow-emerald-500/40 border border-emerald-400/40 hover:scale-105 active:scale-95 transition"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>Installer l'App</span>
          </button>
        </div>
      )}

      {/* MODAL GUIDE DE L'INSTALLATION DIRECTE */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl text-slate-100 space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Installer {appName} Directement
                  </h3>
                  <p className="text-xs text-slate-300">
                    Application Web Progressive (PWA) autonome et instantanée
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct 1-Click trigger if browser supports it */}
            {isInstallable ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                <p className="text-xs text-emerald-300 font-medium">
                  Votre navigateur est prêt pour une installation en un clic !
                </p>
                <button
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Confirmer l'Installation Maintenant</span>
                </button>
              </div>
            ) : null}

            {/* Warning if in iframe preview */}
            {isInIframe && (
              <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Vous êtes actuellement dans l'aperçu intégré</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Certains navigateurs bloquent la fenêtre d'installation native à l'intérieur des cadres. Ouvrez l'application en plein écran pour l'installer directement :
                </p>
                <button
                  onClick={() => {
                    window.open(window.location.href, '_blank');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir en Plein Écran pour Installer</span>
                </button>
              </div>
            )}

            {/* Platform instructions tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Instructions par appareil :
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTab('android')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'android'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Android / Chrome</span>
                </button>

                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'desktop'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PC / Mac</span>
                </button>

                <button
                  onClick={() => setActiveTab('ios')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'ios'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Apple className="w-3.5 h-3.5 text-slate-200" />
                  <span>iPhone / iPad</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3">
                {activeTab === 'android' && (
                  <div className="space-y-2.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Sur Smartphone ou Tablette Android (Google Chrome) :</span>
                    </div>
                    <div className="space-y-2 text-slate-300 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                        <span>Appuyez sur le menu des <strong>trois points (⋮)</strong> en haut à droite de Google Chrome.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                        <span>Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                        <span>L'icône apparaît sur votre écran d'accueil et se lance comme une véritable application native.</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'desktop' && (
                  <div className="space-y-2.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span>Sur Ordinateur (Windows, Mac, Linux - Chrome & Edge) :</span>
                    </div>
                    <div className="space-y-2 text-slate-300 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                        <span>Regardez tout à droite de la <strong>barre d'adresse (URL)</strong> de votre navigateur.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                        <span>Cliquez sur la petite icône <strong>Télécharger / Installer 🖥️ ou ⬇️</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">3</span>
                        <span>Cliquez sur <strong>« Installer »</strong> : l'application s'ouvre dans sa propre fenêtre indépendante !</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ios' && (
                  <div className="space-y-2.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Apple className="w-4 h-4 text-slate-200" />
                      <span>Sur iPhone / iPad (Navigateur Safari) :</span>
                    </div>
                    <div className="space-y-2 text-slate-300 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">1</span>
                        <span>Ouvrez le lien dans <strong>Safari</strong> et touchez le bouton <strong>Partager</strong> (le carré avec une flèche vers le haut).</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">2</span>
                        <span>Faites défiler les options vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">3</span>
                        <span>Touchez <strong>« Ajouter »</strong> en haut à droite. L'application est installée !</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Close */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

