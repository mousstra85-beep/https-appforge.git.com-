import React, { useState } from 'react';
import {
  Code,
  Layers,
  Database,
  CheckCircle2,
  Sparkles,
  Sliders,
  Terminal,
  ShieldAlert,
  Zap,
  Check
} from 'lucide-react';
import {
  TechStackSelection,
  ProgrammingLanguage,
  FrameworkOption,
  DatabaseType,
  DatabaseEngine
} from '../types';
import {
  PROGRAMMING_LANGUAGES,
  FRAMEWORKS,
  DATABASE_ENGINES,
  TECH_STACK_PRESETS
} from '../data/techStacks';

interface TechStackCustomizerProps {
  value: TechStackSelection;
  onChange: (newStack: TechStackSelection) => void;
}

export const TechStackCustomizer: React.FC<TechStackCustomizerProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Selected language object
  const currentLang = PROGRAMMING_LANGUAGES.find((l) => l.id === value.language) || PROGRAMMING_LANGUAGES[0];

  // Available frameworks for current language
  const compatibleFrameworks = FRAMEWORKS.filter((f) => currentLang.compatibleFrameworks.includes(f.id));

  // Current framework object
  const currentFramework = FRAMEWORKS.find((f) => f.id === value.framework) || compatibleFrameworks[0] || FRAMEWORKS[0];

  // Available database engines for current type (sql vs nosql)
  const availableDbs = DATABASE_ENGINES.filter((d) => d.type === value.databaseType);

  // Current database engine object
  const currentDb = DATABASE_ENGINES.find((d) => d.id === value.databaseEngine) || availableDbs[0] || DATABASE_ENGINES[0];

  const handleSelectPreset = (presetStack: TechStackSelection) => {
    onChange(presetStack);
  };

  const handleLanguageChange = (langId: ProgrammingLanguage) => {
    const langDef = PROGRAMMING_LANGUAGES.find((l) => l.id === langId);
    const validFramework = langDef?.compatibleFrameworks[0] || 'react';
    const fwDef = FRAMEWORKS.find((f) => f.id === validFramework);
    const recommendedDb = fwDef?.recommendedDatabases[0] || 'postgresql';
    const dbDef = DATABASE_ENGINES.find((d) => d.id === recommendedDb);

    onChange({
      ...value,
      language: langId,
      framework: validFramework,
      databaseEngine: recommendedDb,
      databaseType: dbDef?.type || 'sql',
      architecturePattern: `${langDef?.name} ${fwDef?.name} + ${dbDef?.name}`
    });
  };

  const handleFrameworkChange = (fwId: FrameworkOption) => {
    const fwDef = FRAMEWORKS.find((f) => f.id === fwId);
    let lang = value.language;
    if (fwDef && !currentLang.compatibleFrameworks.includes(fwId)) {
      lang = fwDef.languageId;
    }

    onChange({
      ...value,
      language: lang,
      framework: fwId,
      architecturePattern: `${fwDef?.name} Architecture`
    });
  };

  const handleDatabaseTypeChange = (type: DatabaseType) => {
    const dbs = DATABASE_ENGINES.filter((d) => d.type === type);
    const defaultEngine = dbs[0]?.id || (type === 'sql' ? 'postgresql' : 'indexeddb');
    onChange({
      ...value,
      databaseType: type,
      databaseEngine: defaultEngine
    });
  };

  const handleDatabaseEngineChange = (engineId: DatabaseEngine) => {
    const dbDef = DATABASE_ENGINES.find((d) => d.id === engineId);
    onChange({
      ...value,
      databaseEngine: engineId,
      databaseType: dbDef?.type || value.databaseType
    });
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Personnalisation de la Pile Technologique (Tech Stack)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sélectionnez vos langages, frameworks et types de base de données préférés. Le code généré respectera scrupuleusement les meilleures pratiques de l'industrie.
          </p>
        </div>

        {/* Preset vs Custom Mode switch */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Packs Recommandés</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Personnalisation Fine</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TECH_STACK_PRESETS.map((preset) => {
              const isSelected =
                value.language === preset.stack.language &&
                value.framework === preset.stack.framework &&
                value.databaseEngine === preset.stack.databaseEngine;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.stack)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-500/60'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {preset.badge}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mt-2 leading-tight">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {preset.stack.language}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      {preset.stack.framework}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono">
                      {preset.stack.databaseType.toUpperCase()} ({preset.stack.databaseEngine})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM FINE-TUNING */}
      {activeTab === 'custom' && (
        <div className="space-y-5">
          {/* 1. Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>1. Langage de Programmation Préféré</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {PROGRAMMING_LANGUAGES.map((lang) => {
                const isSelected = value.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{lang.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                      {lang.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Framework Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Framework Applicatif (Optimisé pour {currentLang.name})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                {compatibleFrameworks.length} framework(s) disponible(s)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {compatibleFrameworks.map((fw) => {
                const isSelected = value.framework === fw.id;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => handleFrameworkChange(fw.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {fw.name}
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal uppercase">
                          {fw.category}
                        </span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{fw.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Database Type (SQL vs NoSQL) & Engine Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Type de Base de Données & Moteur</span>
              </label>

              {/* SQL vs NoSQL Toggle */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => handleDatabaseTypeChange('sql')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    value.databaseType === 'sql'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Relationnelle (SQL)
                </button>
                <button
                  type="button"
                  onClick={() => handleDatabaseTypeChange('nosql')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    value.databaseType === 'nosql'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Orientée Documents (NoSQL)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {availableDbs.map((db) => {
                const isSelected = value.databaseEngine === db.id;
                return (
                  <button
                    key={db.id}
                    type="button"
                    onClick={() => handleDatabaseEngineChange(db.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{db.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-slate-300 mt-1 line-clamp-2">{db.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Best Practices & Quality Assurance Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Bonnes Pratiques de l'Industrie Garanties pour cette Stack :</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
            {currentLang.name} + {currentFramework.name} + {currentDb.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
            <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1">
              <Terminal className="w-3 h-3" />
              <span>Standard {currentLang.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {currentLang.bestPractices[0]}
            </p>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
            <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Architecture {currentFramework.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {currentFramework.bestPractices[0]}
            </p>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
            <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Intégrité {currentDb.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {currentDb.bestPractices[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
