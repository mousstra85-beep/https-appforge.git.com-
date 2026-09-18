import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Code2,
  CheckCircle2,
  Package,
  Rocket,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Send,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Check,
  Zap,
  Terminal,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedAppProject, PipelineStep, UserAccount, PlatformConfig, TechStackSelection } from '../types';
import { AppPreviewFrame } from './AppPreviewFrame';
import { ShareModal } from './ShareModal';
import { TechStackCustomizer } from './TechStackCustomizer';
import { CodeFileExplorer } from './CodeFileExplorer';
import { PWAInstallButton } from './PWAInstallButton';

interface PipelineWizardProps {
  currentUser: UserAccount | null;
  platformConfig: PlatformConfig;
  onRequireAuth: () => void;
}

export const PipelineWizard: React.FC<PipelineWizardProps> = ({
  currentUser,
  platformConfig,
  onRequireAuth,
}) => {
  const [currentStep, setCurrentStep] = useState<PipelineStep>('concept');
  const [promptText, setPromptText] = useState('');
  const [apiKeyChoice, setApiKeyChoice] = useState<'free' | 'custom'>('free');
  const [customApiKey, setCustomApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tech stack customization state
  const [techStack, setTechStack] = useState<TechStackSelection>({
    language: 'typescript',
    framework: 'react',
    databaseType: 'sql',
    databaseEngine: 'postgresql',
    architecturePattern: 'React 19 + TypeScript + Supabase SQL'
  });

  // Step 3 sub-tab switcher: 'preview' (Live Iframe), 'code' (Multi-File Tree), 'audit' (Best Practices)
  const [step3SubTab, setStep3SubTab] = useState<'preview' | 'code' | 'audit'>('preview');

  // Dynamic Database Architecture options returned from server
  const [dbOptions, setDbOptions] = useState<{
    freeDbOptions: any[];
    paidDbOptions: any[];
  }>({
    freeDbOptions: [],
    paidDbOptions: []
  });

  // Adjustment feedback state at each step
  const [adjustmentInput, setAdjustmentInput] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

  // Project state
  const [project, setProject] = useState<GeneratedAppProject | null>(null);

  // Share Modal for generated app
  const [showShareApp, setShowShareApp] = useState(false);

  // Template suggestions
  const templates = [
    {
      title: 'Boutique & Vente Mobile Money',
      prompt: 'Une application e-commerce pour vendre des vêtements et accessoires en Côte d\'Ivoire avec panier, gestion des stocks et paiement par Orange Money / Wave / MTN.',
    },
    {
      title: 'Gestion Restaurant & Livraison',
      prompt: 'Un site web et application mobile de commande de plats locaux (Attiéké, Alloco, Garba), suivi des livreurs en direct et confirmation par WhatsApp.',
    },
    {
      title: 'Clinique & Rendez-vous Médicaux',
      prompt: 'Une plateforme de prise de rendez-vous pour consultations médicales, carnet de santé digital hors-ligne et rappels par notification.',
    },
    {
      title: 'Gestion Tontine & Épargne Mobile',
      prompt: 'Une application de suivi des cotisations de tontine entre amis et commerçants, calcul des tours de table et historique des versements.',
    },
  ];

  // ==========================================
  // ÉTAPE 1 : CONCEPTION & ARCHITECTURE
  // ==========================================
  const handleStartConcept = async () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!promptText.trim()) {
      setErrorMsg('Veuillez décrire le projet que vous souhaitez créer.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate/step1-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText.trim(),
          customApiKey: apiKeyChoice === 'custom' ? customApiKey : undefined,
          techStack,
        }),
      });

      const conceptData = await res.json();

      const newProj: GeneratedAppProject = {
        id: 'proj_' + Date.now(),
        title: conceptData.title || 'Mon Application',
        tagline: conceptData.tagline || 'Solution moderne et performante',
        description: conceptData.description || promptText,
        category: conceptData.category || 'Général',
        targetPlatforms: conceptData.targetPlatforms || ['mobile', 'tablet', 'desktop'],
        features: conceptData.features || [
          'Interface tactile optimisée',
          'Base de données locale intégrée',
          'Mode hors-ligne PWA',
        ],
        techStack: conceptData.techStack || techStack,
        databaseChoice: {
          name: conceptData.databaseSchemaProposal?.name || (techStack.databaseType === 'sql' ? 'PostgreSQL Cloud & Local (SQL)' : 'IndexedDB / MongoDB (NoSQL)'),
          type: 'free',
          description: conceptData.databaseSchemaProposal?.description || 'Base rapide intégrée et adaptée à votre pile technologique.',
          schemaSqlOrJson: conceptData.databaseSchemaProposal?.schemaSqlOrJson || 'CREATE TABLE items (id TEXT PRIMARY KEY, title TEXT, created_at TIMESTAMP);',
        },
        appCode: '',
        projectFiles: [],
        bestPractices: [],
        testResults: [],
        pwaManifest: {},
        apkConfig: {
          packageName: 'com.app.forge',
          version: '1.0.0',
          appName: conceptData.title || 'MonApp',
          minSdkVersion: 22,
          targetSdkVersion: 34,
        },
        aabConfig: {
          bundleVersion: '1.0.0',
          playStoreTrack: 'Production',
          assetPackSupported: true,
        },
        deploymentOptions: {
          free: [
            {
              name: 'Vercel (Gratuit)',
              urlPrefix: 'https://votre-app.vercel.app',
              description: 'Hébergement mondial instantané avec nom de domaine gratuit.',
              setupGuide: 'Glissez le fichier .zip généré sur vercel.com',
            },
            {
              name: 'Netlify Drop (Gratuit)',
              urlPrefix: 'https://votre-app.netlify.app',
              description: 'Déploiement en 5 secondes sans compte requis.',
              setupGuide: 'Déposez simplement le dossier web sur app.netlify.com/drop',
            },
            {
              name: 'Cloudflare Pages (Gratuit)',
              urlPrefix: 'https://votre-app.pages.dev',
              description: 'Bande passante 100% gratuite et illimitée.',
              setupGuide: 'Connexion Git ou upload direct via le dashboard.',
            },
          ],
          paid: [
            {
              name: 'Google Play Store (Publication Pro)',
              pricing: 'Frais unique de 25$ Google',
              description: 'Rendez votre application téléchargeable pour des milliards d\'utilisateurs.',
              setupGuide: 'Téléversez le fichier .aab généré à l\'étape 5 sur Google Play Console.',
            },
            {
              name: 'Nom de Domaine Personnalisé (.com / .ci)',
              pricing: 'À partir de 10$ / an',
              description: 'Associez votre propre nom de marque avec certificat HTTPS automatique.',
              setupGuide: 'Configurez les DNS A/CNAME vers votre hébergement.',
            },
          ],
        },
        demoLiveUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProject(newProj);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la conception.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ÉTAPE 2 : CONFIGURATION BASE DE DONNÉES
  // ==========================================
  const handleProceedToDatabase = async () => {
    if (!project) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate/step2-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: project,
          techStack: project.techStack || techStack,
          customApiKey: apiKeyChoice === 'custom' ? customApiKey : undefined,
        }),
      });

      const dbData = await res.json();
      if (dbData.freeDbOptions && dbData.paidDbOptions) {
        setDbOptions({
          freeDbOptions: dbData.freeDbOptions,
          paidDbOptions: dbData.paidDbOptions
        });
      }
      if (dbData.recommended) {
        setProject((prev) => (prev ? { ...prev, databaseChoice: dbData.recommended } : prev));
      }
      setCurrentStep('database');
    } catch (err) {
      setCurrentStep('database');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ÉTAPE 3 : GÉNÉRATION DU CODE & LIVE PREVIEW
  // ==========================================
  const handleProceedToCode = async () => {
    if (!project) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate/step3-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          concept: project,
          techStack: project.techStack || techStack,
          databaseChoice: project.databaseChoice,
          customApiKey: apiKeyChoice === 'custom' ? customApiKey : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de génération de code');

      setProject((prev) =>
        prev
          ? {
              ...prev,
              appCode: data.appCode || prev.appCode,
              projectFiles: data.projectFiles || prev.projectFiles || [],
              bestPractices: data.bestPractices || prev.bestPractices || [],
            }
          : prev
      );
      setCurrentStep('code');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la génération du code.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RÉAJUSTEMENT EN DIRECT DU PREVIEW
  // ==========================================
  const handleApplyAdjustment = async () => {
    if (!project || !adjustmentInput.trim()) return;
    setIsAdjusting(true);
    setAdjustmentNotice(null);

    try {
      const res = await fetch('/api/generate/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCode: project.appCode,
          projectFiles: project.projectFiles,
          techStack: project.techStack || techStack,
          feedback: adjustmentInput.trim(),
          customApiKey: apiKeyChoice === 'custom' ? customApiKey : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Impossible d\'ajuster');

      setProject((prev) =>
        prev
          ? {
              ...prev,
              appCode: data.appCode || prev.appCode,
              projectFiles: data.projectFiles || prev.projectFiles,
            }
          : prev
      );
      setAdjustmentNotice('Réajustement appliqué avec succès dans le code et les fichiers !');
      setAdjustmentInput('');
      setTimeout(() => setAdjustmentNotice(null), 3500);
    } catch (err: any) {
      setAdjustmentNotice('Erreur lors de l\'ajustement : ' + err.message);
    } finally {
      setIsAdjusting(false);
    }
  };

  // ==========================================
  // ÉTAPE 4 : AUDIT & TESTS AUTOMATISÉS
  // ==========================================
  const handleProceedToTesting = async () => {
    if (!project) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate/step4-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appCode: project.appCode,
          concept: project,
        }),
      });

      const testData = await res.json();
      setProject((prev) => (prev ? { ...prev, testResults: testData.testResults } : prev));
      setCurrentStep('testing');
    } catch (err) {
      setCurrentStep('testing');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ÉTAPE 5 : PACKAGING APK, AAB, PWA
  // ==========================================
  const handleProceedToPackaging = async () => {
    if (!project) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate/step5-packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: project,
        }),
      });

      const packData = await res.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              pwaManifest: packData.pwaManifest,
              apkConfig: packData.apkConfig,
              aabConfig: packData.aabConfig,
            }
          : prev
      );
      setCurrentStep('packaging');
    } catch (err) {
      setCurrentStep('packaging');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ÉTAPE 6 : DÉPLOIEMENT & PUBLICATION
  // ==========================================
  const handleProceedToDeployment = () => {
    setCurrentStep('deployment');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  // ==========================================
  // TÉLÉCHARGEMENT ZIP COMPLET DU PROJET
  // ==========================================
  const handleDownloadProjectZip = async () => {
    if (!project) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/export/project-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });

      if (!res.ok) throw new Error('Erreur lors du téléchargement du bundle.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_complet_a_z.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message || 'Erreur export');
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicator info
  const stepList = [
    { id: 'concept', label: '1. Conception', icon: Sparkles },
    { id: 'database', label: '2. Base de Données', icon: Database },
    { id: 'code', label: '3. Code & Preview', icon: Code2 },
    { id: 'testing', label: '4. Tests & Audit', icon: CheckCircle2 },
    { id: 'packaging', label: '5. Packaging APK/AAB', icon: Package },
    { id: 'deployment', label: '6. Déploiement', icon: Rocket },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* Step Progress Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 scrollbar-none">
          {stepList.map((st, idx) => {
            const Icon = st.icon;
            const isDone =
              stepList.findIndex((s) => s.id === currentStep) > idx;
            const isCurrent = currentStep === st.id;

            return (
              <div
                key={st.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl shrink-0 text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                    : isDone
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-500 bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : isDone ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">&times;</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: CONCEPTION & ANALYSE DE L'EXPLICATION ÉCRITE */}
      {/* ========================================================================= */}
      {currentStep === 'concept' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Étape 1 : Décrivez votre Application ou Site Web
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Expliquez en langage naturel ce que doit faire votre application. Notre moteur génère l'architecture complète pour Mobile, Tablette et Ordinateur.
                </p>
              </div>
            </div>

            {/* Prompt textarea */}
            <div className="space-y-3">
              <textarea
                rows={5}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Exemple : Crée une application pour un restaurant avec commande en ligne de plats africains, réservation de table, panier d'achat, paiement Mobile Money et suivi des commandes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
              />

              {/* Template quick pills */}
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-2">Idées rapides de projet :</div>
                <div className="flex flex-wrap gap-2">
                  {templates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPromptText(tpl.prompt)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    >
                      + {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack Customizer (Langages, Frameworks, Bases de Données SQL & NoSQL) */}
              <div className="pt-3 border-t border-slate-800/80">
                <TechStackCustomizer
                  value={techStack}
                  onChange={(newStack) => {
                    setTechStack(newStack);
                    if (project) {
                      setProject({ ...project, techStack: newStack });
                    }
                  }}
                />
              </div>

              {/* API Key choice */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setApiKeyChoice('free')}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    apiKeyChoice === 'free'
                      ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Clé API Gratuite par Défaut
                    </span>
                    {apiKeyChoice === 'free' && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Modèle d'IA haute vitesse inclus sans frais pour tous les utilisateurs de la plateforme.
                  </p>
                </div>

                <div
                  onClick={() => setApiKeyChoice('custom')}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    apiKeyChoice === 'custom'
                      ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Clé API Personnalisée (Pro)
                    </span>
                    {apiKeyChoice === 'custom' && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optionnel : Utilisez votre propre clé Gemini pour des quotas étendus.
                  </p>
                </div>
              </div>

              {apiKeyChoice === 'custom' && (
                <div className="mt-2">
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="Entrez votre clé API Gemini (AIza...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}

              {/* Submit button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleStartConcept}
                  disabled={isLoading || !promptText.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Conception du projet en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Concevoir l'Application & Générer la Démo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* If project concept was generated, show Preview and ask for adjustments */}
          {project && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    Aperçu de la Conception
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
                  <p className="text-xs text-cyan-400 font-medium">{project.tagline}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mobile, Tablette & PC</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Description & Rôle</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Fonctionnalités Clés Prévues</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {project.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
                  <h4 className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Pile Tech & Architecture
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Langage :</span>
                      <span className="font-mono text-white font-semibold">{project.techStack?.language.toUpperCase() || techStack.language.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Framework :</span>
                      <span className="font-mono text-cyan-300 font-semibold">{project.techStack?.framework.toUpperCase() || techStack.framework.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Base de données :</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {(project.techStack?.databaseType || techStack.databaseType).toUpperCase()} ({project.techStack?.databaseEngine || techStack.databaseEngine})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ask for adjustments before continuing */}
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    Avez-vous des réajustements à faire avant de continuer ?
                  </span>
                  <span className="text-[11px] text-slate-400">Optionnel</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={adjustmentInput}
                    onChange={(e) => setAdjustmentInput(e.target.value)}
                    placeholder="Ex: Change le titre, ajoute une option de livraison express, etc."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (adjustmentInput.trim()) {
                        setProject({
                          ...project,
                          description: project.description + ' (Note: ' + adjustmentInput.trim() + ')',
                        });
                        setAdjustmentInput('');
                        alert('Réajustement pris en compte pour la génération !');
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white transition shrink-0"
                  >
                    Appliquer
                  </button>
                </div>
              </div>

              {/* Continue to Step 2 */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleProceedToDatabase}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
                >
                  <span>Valider & Configurer la Base de Données</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: BASE DE DONNÉES & ARCHITECTURE */}
      {/* ========================================================================= */}
      {currentStep === 'database' && project && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Étape 2 : Choix de la Base de Données & Schéma
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Prévoyez une solution gratuite ou payante selon les besoins de stockage de votre projet.
              </p>
            </div>
          </div>

          {/* Selected Tech Stack Reminder */}
          {(project.techStack || techStack) && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Architecture BDD sélectionnée :</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {(project.techStack || techStack).databaseType.toUpperCase()} ({(project.techStack || techStack).databaseEngine})
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Langage : <strong className="text-white font-mono">{(project.techStack || techStack).language}</strong> • Framework : <strong className="text-white font-mono">{(project.techStack || techStack).framework}</strong>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Database option */}
            <div
              onClick={() =>
                setProject({
                  ...project,
                  databaseChoice: {
                    name: dbOptions.freeDbOptions?.[0]?.name || ((project.techStack || techStack).databaseType === 'sql' ? 'PostgreSQL Local / Supabase Free (SQL)' : 'IndexedDB / MongoDB Local (NoSQL)'),
                    type: 'free',
                    description: dbOptions.freeDbOptions?.[0]?.description || 'Stockage optimisé pour le développement et la production gratuite sans frais.',
                    schemaSqlOrJson: dbOptions.freeDbOptions?.[0]?.schemaSqlOrJson || `CREATE TABLE items (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  status TEXT DEFAULT 'active',\n  created_at TIMESTAMP\n);`,
                  },
                })
              }
              className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 ${
                project.databaseChoice.type === 'free'
                  ? 'bg-emerald-950/30 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40'
                  : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Solution Gratuite ({(project.techStack || techStack).databaseType.toUpperCase()})
                </span>
                {project.databaseChoice.type === 'free' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <h4 className="text-sm font-bold text-white">
                {dbOptions.freeDbOptions?.[0]?.name || ((project.techStack || techStack).databaseType === 'sql' ? 'PostgreSQL Local / Supabase Free' : 'IndexedDB & MongoDB Local')}
              </h4>
              <p className="text-xs text-slate-300">
                {dbOptions.freeDbOptions?.[0]?.description || 'Solution autonome 100% opérationnelle sans frais d\'hébergement de base de données.'}
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl text-emerald-300/90 overflow-x-auto">
                {(project.techStack || techStack).databaseType === 'sql'
                  ? 'CREATE TABLE records (id SERIAL PRIMARY KEY, payload JSONB);'
                  : 'db.collection("records").createIndex({ id: 1 }, { unique: true });'}
              </div>
            </div>

            {/* Paid Database option */}
            <div
              onClick={() =>
                setProject({
                  ...project,
                  databaseChoice: {
                    name: dbOptions.paidDbOptions?.[0]?.name || ((project.techStack || techStack).databaseType === 'sql' ? 'Google Cloud SQL / Managed PostgreSQL (Payant)' : 'MongoDB Atlas / Firestore Enterprise (Payant)'),
                    type: 'paid',
                    description: dbOptions.paidDbOptions?.[0]?.description || 'Haute disponibilité cloud, sauvegardes automatisées pour millions d\'utilisateurs.',
                    schemaSqlOrJson: dbOptions.paidDbOptions?.[0]?.schemaSqlOrJson || `-- Scalable Cluster\nCREATE TABLE app_users (id SERIAL, email TEXT);\nCREATE TABLE app_orders (id SERIAL, total NUMERIC);`,
                  },
                })
              }
              className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 ${
                project.databaseChoice.type === 'paid'
                  ? 'bg-amber-950/30 border-amber-500/80 shadow-lg shadow-amber-950/50 ring-1 ring-amber-500/40'
                  : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Solution Cloud Scalable ({(project.techStack || techStack).databaseType.toUpperCase()})
                </span>
                {project.databaseChoice.type === 'paid' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <h4 className="text-sm font-bold text-white">
                {dbOptions.paidDbOptions?.[0]?.name || ((project.techStack || techStack).databaseType === 'sql' ? 'Google Cloud SQL / Managed PostgreSQL' : 'MongoDB Atlas / Cloud Firestore')}
              </h4>
              <p className="text-xs text-slate-300">
                {dbOptions.paidDbOptions?.[0]?.description || 'Pour les projets d\'entreprise avec des centaines de milliers d\'utilisateurs simultanés et réplication multi-régions.'}
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl text-amber-300/90 overflow-x-auto">
                {(project.techStack || techStack).databaseType === 'sql'
                  ? '-- Cluster Scalable PostgreSQL 99.99% SLA'
                  : '// Replica Set Cloud NoSQL Auto-sharding'}
              </div>
            </div>
          </div>

          {/* Ask for adjustments */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Avez-vous des réajustements à faire sur la base de données avant de générer le code ?
              </span>
              <span className="text-[11px] text-slate-400">Optionnel</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adjustmentInput}
                onChange={(e) => setAdjustmentInput(e.target.value)}
                placeholder="Ex: Ajouter une table pour les factures ou les avis clients..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (adjustmentInput.trim()) {
                    setProject({
                      ...project,
                      databaseChoice: {
                        ...project.databaseChoice,
                        description: project.databaseChoice.description + ' + ' + adjustmentInput.trim(),
                      },
                    });
                    setAdjustmentInput('');
                    alert('Réajustement pris en compte !');
                  }
                }}
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white transition shrink-0"
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep('concept')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={handleProceedToCode}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Génération du code complet...</span>
                </>
              ) : (
                <>
                  <span>Générer le Code & Ouvrir le Live Preview</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3 : CODE & LIVE PREVIEW MULTI-DEVICE AVEC RÉAJUSTEMENTS */}
      {/* ========================================================================= */}
      {currentStep === 'code' && project && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Étape 3 : Code Généré & Aperçu Multi-Device
                    </h2>
                    {project.techStack && (
                      <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                        {project.techStack.language.toUpperCase()} • {project.techStack.framework.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Testez l'application en direct ou explorez les fichiers sources structurés selon les meilleures pratiques.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowShareApp(true)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Partager (QR / WhatsApp)</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Live Preview vs Multi-File Source Explorer vs Best Practices */}
            <div className="flex items-center justify-between border-b border-slate-800 mt-4 pb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setStep3SubTab('preview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    step3SubTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Démo Live Interactive</span>
                </button>

                <button
                  onClick={() => setStep3SubTab('code')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    step3SubTab === 'code'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Fichiers Sources ({project.projectFiles?.length || 0})</span>
                </button>

                <button
                  onClick={() => setStep3SubTab('audit')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    step3SubTab === 'audit'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audit Bonnes Pratiques ({project.bestPractices?.length || 0})</span>
                </button>
              </div>

              <div className="hidden sm:block text-[11px] text-slate-400 font-mono">
                {project.techStack?.databaseType.toUpperCase()} ({project.techStack?.databaseEngine})
              </div>
            </div>

            {/* Sub-Tab View 1: Interactive Live Preview Frame */}
            {step3SubTab === 'preview' && (
              <div className="mt-4">
                <AppPreviewFrame
                  htmlCode={project.appCode}
                  appName={project.title}
                  defaultDevice="mobile"
                  heightClass="h-[620px]"
                />
              </div>
            )}

            {/* Sub-Tab View 2 & 3: Source Files & Best Practice Audit Explorer */}
            {(step3SubTab === 'code' || step3SubTab === 'audit') && (
              <div className="mt-4">
                <CodeFileExplorer
                  files={
                    project.projectFiles && project.projectFiles.length > 0
                      ? project.projectFiles
                      : [
                          {
                            path: 'index.html',
                            name: 'index.html',
                            language: 'html',
                            content: project.appCode || '<!DOCTYPE html><html><body><h1>App</h1></body></html>',
                            description: 'Fichier principal interactif'
                          }
                        ]
                  }
                  bestPractices={project.bestPractices || []}
                  techStack={project.techStack}
                  appName={project.title}
                />
              </div>
            )}

            {/* Interactive Adjustment Box */}
            <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950/50 rounded-2xl border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 text-cyan-400 ${isAdjusting ? 'animate-spin' : ''}`} />
                    Avez-vous des réajustements à faire avant de continuer ?
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tapez vos souhaits de modifications (ex: "ajoute un bouton de contact WhatsApp", "change le thème en mode sombre", "ajoute des filtres") et l'IA réécrit l'application instantanément.
                  </p>
                </div>
              </div>

              {adjustmentNotice && (
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{adjustmentNotice}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={adjustmentInput}
                  onChange={(e) => setAdjustmentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyAdjustment();
                  }}
                  placeholder="Écrivez votre réajustement ici..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                />
                <button
                  onClick={handleApplyAdjustment}
                  disabled={isAdjusting || !adjustmentInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {isAdjusting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Appliquer le réajustement</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
              <button
                onClick={() => setCurrentStep('database')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour BDD</span>
              </button>
              <button
                onClick={handleProceedToTesting}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>Passer à la Phase de Test & Validation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4 : PHASE DE TEST & AUDIT AUTOMATISÉ */}
      {/* ========================================================================= */}
      {currentStep === 'testing' && project && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Étape 4 : Phase de Test, Sécurité & Validation Qualité
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Vérification de la compatibilité sur téléphones mobiles, tablettes, ordinateurs et mode hors-ligne.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {project.testResults.map((t, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-800/70 border border-slate-700/80 rounded-xl flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">{t.details}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
                    {t.score} / 100
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ask for adjustments */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Avez-vous des réajustements à faire suite aux tests avant d'empaqueter l'APK et l'AAB ?
              </span>
              <span className="text-[11px] text-slate-400">Optionnel</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adjustmentInput}
                onChange={(e) => setAdjustmentInput(e.target.value)}
                placeholder="Ex: Optimiser les boutons pour les petits écrans tactiles..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (adjustmentInput.trim()) {
                    setCurrentStep('code');
                    handleApplyAdjustment();
                  }
                }}
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white transition shrink-0"
              >
                Réajuster le code
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep('code')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au Code</span>
            </button>
            <button
              onClick={handleProceedToPackaging}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <span>Empaqueter l'Application (APK, AAB, PWA)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5 : PACKAGING APK, AAB, PWA */}
      {/* ========================================================================= */}
      {currentStep === 'packaging' && project && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Étape 5 : Empaquetage & Création d'APK, AAB et PWA
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Formats natifs prêts à installer sur Android, iOS et Ordinateur sans dépendance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* APK Android Card */}
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                APK
              </div>
              <h4 className="text-sm font-bold text-white">Fichier APK Installable Android</h4>
              <p className="text-xs text-slate-300">
                Package Android autonome installable directement sur tout téléphone ou tablette sans Play Store.
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl text-slate-300 space-y-1">
                <div>Package: {project.apkConfig.packageName}</div>
                <div>Min SDK: Android 5.1+ (API 22)</div>
                <div>Target SDK: Android 14 (API 34)</div>
              </div>
            </div>

            {/* AAB Play Store Card */}
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                AAB
              </div>
              <h4 className="text-sm font-bold text-white">Android App Bundle (.aab)</h4>
              <p className="text-xs text-slate-300">
                Format obligatoire exigé par Google pour la publication officielle sur le Google Play Store.
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl text-slate-300 space-y-1">
                <div>Version: {project.aabConfig.bundleVersion}</div>
                <div>Format: Google Play Bundle</div>
                <div>Asset Packs: Pris en charge</div>
              </div>
            </div>

            {/* PWA Direct Card */}
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                PWA
              </div>
              <h4 className="text-sm font-bold text-white">Progressive Web App (PWA)</h4>
              <p className="text-xs text-slate-300">
                Installable directement depuis le navigateur sur iPhone, iPad, Windows, Mac et Android.
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded-xl text-slate-300 space-y-1">
                <div>Affichage: Standalone</div>
                <div>Service Worker: Cache Hors-ligne</div>
                <div>Multi-plateforme: 100%</div>
              </div>
              <div className="pt-1">
                <PWAInstallButton variant="header" label="Installer sur cet appareil" appName={project.title} />
              </div>
            </div>
          </div>

          {/* Ask for adjustments */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Avez-vous des réajustements à faire avant la publication et le déploiement ?
              </span>
              <span className="text-[11px] text-slate-400">Optionnel</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adjustmentInput}
                onChange={(e) => setAdjustmentInput(e.target.value)}
                placeholder="Ex: Modifier le nom du package Android ou la version..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (adjustmentInput.trim()) {
                    setProject({
                      ...project,
                      apkConfig: { ...project.apkConfig, appName: adjustmentInput.trim() },
                    });
                    setAdjustmentInput('');
                    alert('Réajustement pris en compte !');
                  }
                }}
                className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-white transition shrink-0"
              >
                Appliquer
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep('testing')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour Tests</span>
            </button>
            <button
              onClick={handleProceedToDeployment}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
            >
              <span>Valider & Déployer l'Application de A à Z</span>
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6 : DÉPLOIEMENT DE A À Z & TÉLÉCHARGEMENT DU PACKAGE COMPLET */}
      {/* ========================================================================= */}
      {currentStep === 'deployment' && project && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Déploiement Terminé de A à Z
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {project.title} est Prête à l'Emploi !
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Tous les livrables sont générés et prêts pour une utilisation instantanée.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <PWAInstallButton variant="header" label="Installer directement" appName={project.title} />
              <button
                onClick={() => setShowShareApp(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Code QR & WhatsApp</span>
              </button>
              <button
                onClick={handleDownloadProjectZip}
                disabled={isLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/30"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Pack Complet (.ZIP)</span>
              </button>
            </div>
          </div>

          {/* Carte d'Installation Directe de l'Application sur Téléphone / PC */}
          <PWAInstallButton
            variant="card"
            label={`Installer directement ${project.title} sur mon appareil (Mobile & PC)`}
            appName={project.title}
          />

          {/* Solutions de Déploiement : Gratuites & Payantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gratuites */}
            <div className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                  Hébergements 100% Gratuits
                </span>
                <h3 className="text-sm font-bold text-white">Solutions de Déploiement Gratuites</h3>
              </div>

              <div className="space-y-3">
                {project.deploymentOptions.free.map((sol, i) => (
                  <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-xs text-white">
                      <span>{sol.name}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-normal">
                        {sol.urlPrefix}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{sol.description}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-medium bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                      💡 {sol.setupGuide}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payantes */}
            <div className="p-5 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase">
                  Solutions Pro & Stores
                </span>
                <h3 className="text-sm font-bold text-white">Solutions de Déploiement Payantes</h3>
              </div>

              <div className="space-y-3">
                {project.deploymentOptions.paid.map((sol, i) => (
                  <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between font-bold text-xs text-white">
                      <span>{sol.name}</span>
                      <span className="text-[11px] text-amber-400 font-semibold">{sol.pricing}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{sol.description}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-medium bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                      💡 {sol.setupGuide}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direct Live Preview in Modal/Tab */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Aperçu Actif du Projet Déployé
              </h4>
              <button
                onClick={() => {
                  const blob = new Blob([project.appCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir dans un nouvel onglet plein écran</span>
              </button>
            </div>

            <AppPreviewFrame
              htmlCode={project.appCode}
              appName={project.title}
              defaultDevice="mobile"
              heightClass="h-[480px]"
            />
          </div>

          {/* Reset / New Project */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (confirm('Voulez-vous créer une nouvelle application ?')) {
                  setProject(null);
                  setCurrentStep('concept');
                  setPromptText('');
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              + Créer une autre application
            </button>
            <button
              onClick={handleDownloadProjectZip}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Bundle Déployable</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Modal for generated app */}
      {showShareApp && project && (
        <ShareModal
          isOpen={showShareApp}
          onClose={() => setShowShareApp(false)}
          title={project.title}
        />
      )}
    </div>
  );
};
