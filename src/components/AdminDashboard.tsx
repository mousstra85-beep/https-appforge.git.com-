import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Settings,
  CreditCard,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { UserAccount, PlatformConfig } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: (newConfig: PlatformConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'monetization' | 'apis' | 'security'>('users');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [config, setConfig] = useState<PlatformConfig>({
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

  const [newPin, setNewPin] = useState('');

  if (!isOpen) return null;

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Code PIN invalide.');
      }

      setIsAuthenticated(true);
      setConfig(data.config);
      fetchUsers(pinInput.trim());
    } catch (err: any) {
      setErrorMsg(err.message || 'Code PIN incorrect (par défaut: 1234)');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (pin = pinInput) => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        if (data.config) setConfig(data.config);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/toggle-block-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBlocked: data.user.isBlocked } : u))
        );
        showSuccess(
          data.user.isBlocked
            ? 'Utilisateur bloqué avec succès.'
            : 'Utilisateur débloqué avec succès.'
        );
      }
    } catch (err) {
      setErrorMsg('Erreur lors de la modification du statut utilisateur.');
    }
  };

  const handleUpdateConfig = async (updates: Partial<PlatformConfig>) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour.');
      }

      setConfig(data.config);
      if (onConfigChanged) onConfigChanged(data.config);
      showSuccess('Paramètres de la plateforme mis à jour avec succès !');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Panneau d'Administration</h2>
              <p className="text-[11px] text-slate-400">Gestion des utilisateurs, blocages et mode payant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!isAuthenticated ? (
            /* PIN Form */
            <div className="max-w-sm mx-auto py-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Code Administrateur Requis</h3>
              <p className="text-xs text-slate-400 mb-6">
                Code d'accès par défaut configuré : <code className="text-cyan-400 font-bold bg-slate-800 px-2 py-0.5 rounded">1234</code>
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerifyPin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={10}
                    autoFocus
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Entrez le code (1234)"
                    className="w-full text-center text-xl tracking-widest font-mono bg-slate-800 border border-slate-700 rounded-xl py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !pinInput}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
                >
                  {isLoading ? 'Vérification...' : 'Déverrouiller le panneau'}
                </button>
              </form>
            </div>
          ) : (
            /* Admin Panel Dashboard */
            <div className="space-y-5">
              {/* Notifications */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Status Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70">
                  <div className="text-[11px] text-slate-400 font-medium">Mode de la Plateforme</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        config.isPromoMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-sm font-bold text-white">
                      {config.isPromoMode ? 'Mode Promo (100% Gratuit)' : 'Mode Payant Activé'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70">
                  <div className="text-[11px] text-slate-400 font-medium">Comptes Inscrits</div>
                  <div className="mt-1 text-sm font-bold text-cyan-400">{users.length} Utilisateurs</div>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70">
                  <div className="text-[11px] text-slate-400 font-medium">Comptes Bloqués</div>
                  <div className="mt-1 text-sm font-bold text-rose-400">
                    {users.filter((u) => u.isBlocked).length} Suspendus
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800 gap-2 pb-1">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'users'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Gestion Utilisateurs ({users.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('monetization')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'monetization'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Activation Mode Payant</span>
                </button>
                <button
                  onClick={() => setActiveTab('apis')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'apis'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>APIs Paiement Mobile</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'security'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Sécurité & Code PIN</span>
                </button>
              </div>

              {/* TAB 1: USERS LIST & BLOCK/UNBLOCK */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Utilisateurs Inscrits (Nom, Prénom, Mobile Money)
                    </h4>
                    <button
                      onClick={() => fetchUsers()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Rafraîchir</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-800/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800 text-slate-400 font-semibold border-b border-slate-700">
                        <tr>
                          <th className="p-3">Utilisateur</th>
                          <th className="p-3">Numéro Mobile Money</th>
                          <th className="p-3">Opérateur</th>
                          <th className="p-3">Statut</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-white">
                              {u.nom} {u.prenom}
                            </td>
                            <td className="p-3 font-mono text-cyan-300">{u.mobileMoneyNumber}</td>
                            <td className="p-3 text-slate-300">{u.operator || 'Mobile Money'}</td>
                            <td className="p-3">
                              {u.isBlocked ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                  Bloqué
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Actif
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleToggleBlock(u.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                                  u.isBlocked
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                                }`}
                              >
                                {u.isBlocked ? (
                                  <>
                                    <Unlock className="w-3 h-3" />
                                    <span>Débloquer</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    <span>Bloquer</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: MONETIZATION MODE SWITCH */}
              {activeTab === 'monetization' && (
                <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Mode Promotionnel vs Mode Payant de la Plateforme
                    </h4>
                    <p className="text-xs text-slate-400">
                      Conformément à la consigne : l'application est fournie en <strong>Mode Promo (100% gratuit)</strong>{' '}
                      jusqu'à ce que l'administrateur décide d'activer le mode payant ultérieurement.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div>
                      <div className="text-xs font-bold text-white">Statut du Mode Payant</div>
                      <div className="text-[11px] text-slate-400">
                        {config.isPaidModeActive
                          ? 'Le mode payant est ACTIF : les utilisateurs devront régler les frais via Mobile Money.'
                          : 'Le mode promo est ACTIF : aucun paiement requis pour utiliser et déployer les applications.'}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleUpdateConfig({ isPaidModeActive: !config.isPaidModeActive })
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                        config.isPaidModeActive
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {config.isPaidModeActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span>Désactiver (Revenir au Mode Promo Gratuit)</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span>Activer le Mode Payant</span>
                        </>
                      )}
                    </button>
                  </div>

                  {config.isPaidModeActive && (
                    <div className="p-4 bg-slate-800/90 rounded-xl border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>Tarification par Déploiement / Application</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={config.pricePerAppCFA}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              pricePerAppCFA: Number(e.target.value),
                            }))
                          }
                          className="w-36 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                        />
                        <span className="text-xs text-slate-300 font-semibold">FCFA / application créée</span>
                        <button
                          onClick={() =>
                            handleUpdateConfig({ pricePerAppCFA: config.pricePerAppCFA })
                          }
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                        >
                          Enregistrer le prix
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MOBILE MONEY APIS INTEGRATION */}
              {activeTab === 'apis' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Intégration des APIs de Paiement Mobile
                    </h4>
                    <p className="text-xs text-slate-400">
                      Configurez les clés marchands et secrets pour Orange Money, MTN MoMo, Wave et Moov Money.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Orange Money */}
                    <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-orange-400">Orange Money Web Payment</span>
                        <input
                          type="checkbox"
                          checked={config.mobileMoneyAPIs.orangeMoney.enabled}
                          onChange={(e) =>
                            handleUpdateConfig({
                              mobileMoneyAPIs: {
                                ...config.mobileMoneyAPIs,
                                orangeMoney: {
                                  ...config.mobileMoneyAPIs.orangeMoney,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="accent-orange-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Merchant Key"
                        value={config.mobileMoneyAPIs.orangeMoney.merchantKey}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            mobileMoneyAPIs: {
                              ...prev.mobileMoneyAPIs,
                              orangeMoney: {
                                ...prev.mobileMoneyAPIs.orangeMoney,
                                merchantKey: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>

                    {/* MTN MoMo */}
                    <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-yellow-400">MTN Mobile Money (MoMo)</span>
                        <input
                          type="checkbox"
                          checked={config.mobileMoneyAPIs.mtnMoMo.enabled}
                          onChange={(e) =>
                            handleUpdateConfig({
                              mobileMoneyAPIs: {
                                ...config.mobileMoneyAPIs,
                                mtnMoMo: {
                                  ...config.mobileMoneyAPIs.mtnMoMo,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="accent-yellow-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Subscription Key"
                        value={config.mobileMoneyAPIs.mtnMoMo.subscriptionKey}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            mobileMoneyAPIs: {
                              ...prev.mobileMoneyAPIs,
                              mtnMoMo: {
                                ...prev.mobileMoneyAPIs.mtnMoMo,
                                subscriptionKey: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>

                    {/* Wave */}
                    <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-cyan-400">Wave Checkout API</span>
                        <input
                          type="checkbox"
                          checked={config.mobileMoneyAPIs.wave.enabled}
                          onChange={(e) =>
                            handleUpdateConfig({
                              mobileMoneyAPIs: {
                                ...config.mobileMoneyAPIs,
                                wave: {
                                  ...config.mobileMoneyAPIs.wave,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="accent-cyan-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Wave API Token"
                        value={config.mobileMoneyAPIs.wave.apiToken}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            mobileMoneyAPIs: {
                              ...prev.mobileMoneyAPIs,
                              wave: {
                                ...prev.mobileMoneyAPIs.wave,
                                apiToken: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>

                    {/* Moov Money */}
                    <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-400">Moov Money Flooz</span>
                        <input
                          type="checkbox"
                          checked={config.mobileMoneyAPIs.moovMoney.enabled}
                          onChange={(e) =>
                            handleUpdateConfig({
                              mobileMoneyAPIs: {
                                ...config.mobileMoneyAPIs,
                                moovMoney: {
                                  ...config.mobileMoneyAPIs.moovMoney,
                                  enabled: e.target.checked,
                                },
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="API Secret"
                        value={config.mobileMoneyAPIs.moovMoney.apiSecret}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            mobileMoneyAPIs: {
                              ...prev.mobileMoneyAPIs,
                              moovMoney: {
                                ...prev.mobileMoneyAPIs.moovMoney,
                                apiSecret: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleUpdateConfig({ mobileMoneyAPIs: config.mobileMoneyAPIs })
                    }
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition shadow-sm"
                  >
                    Sauvegarder les clés API de Paiement Mobile
                  </button>
                </div>
              )}

              {/* TAB 4: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-4 max-w-md bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Modifier le Code PIN Administrateur</h4>
                    <p className="text-xs text-slate-400">Code actuel par défaut: 1234</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Nouveau code PIN (min 4 chiffres)"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        if (newPin.trim().length >= 4) {
                          handleUpdateConfig({ adminPin: newPin.trim() } as any);
                          setPinInput(newPin.trim());
                          setNewPin('');
                        } else {
                          setErrorMsg('Le code PIN doit comporter au moins 4 caractères.');
                        }
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition"
                    >
                      Mettre à jour le code PIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
