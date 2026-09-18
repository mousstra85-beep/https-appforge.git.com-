import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  CheckCircle2,
  ShieldCheck,
  Terminal,
  FileText,
  FileJson,
  Database,
  ExternalLink
} from 'lucide-react';
import { GeneratedProjectFile, BestPracticeCheck, TechStackSelection } from '../types';

interface CodeFileExplorerProps {
  files: GeneratedProjectFile[];
  bestPractices: BestPracticeCheck[];
  techStack?: TechStackSelection;
  appName?: string;
}

export const CodeFileExplorer: React.FC<CodeFileExplorerProps> = ({
  files,
  bestPractices,
  techStack,
  appName = 'Application'
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'audit'>('editor');

  const currentFile = files[selectedFileIndex] || files[0];

  const getFileName = (f?: GeneratedProjectFile): string =>
    f?.filename || f?.name || f?.path?.split('/').pop() || 'file';

  const handleCopyCode = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleDownloadFile = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getFileName(currentFile);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getFileIcon = (filename: string = '') => {
    if (filename.endsWith('.py')) return <Terminal className="w-4 h-4 text-emerald-400" />;
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-amber-400" />;
    if (filename.endsWith('.sql')) return <Database className="w-4 h-4 text-cyan-400" />;
    if (filename.endsWith('.json')) return <FileJson className="w-4 h-4 text-yellow-400" />;
    if (filename.endsWith('.md')) return <FileText className="w-4 h-4 text-slate-400" />;
    return <FileCode className="w-4 h-4 text-indigo-400" />;
  };

  if (!files || files.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
        Aucun fichier source disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Bar: Tabs & Stack Details */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
            <FolderTree className="w-4 h-4" />
          </span>
          <span className="font-bold text-white">Explorateur de Code Source Multi-Fichiers</span>
          {techStack && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {techStack.language.toUpperCase()} • {techStack.framework.toUpperCase()} • {techStack.databaseType.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activeTab === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fichiers & Code
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'audit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Bonnes Pratiques ({bestPractices.filter(b => b.passed).length}/{bestPractices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="flex flex-col lg:flex-row min-h-[520px]">
          {/* File sidebar / tree */}
          <div className="w-full lg:w-72 bg-slate-900/80 border-r border-slate-800 p-3 space-y-1.5 shrink-0 overflow-y-auto max-h-56 lg:max-h-[600px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Arborescence du Projet</span>
              <span className="text-[10px] font-mono text-cyan-400">{files.length} fichiers</span>
            </div>
            {files.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-2.5 transition ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  {getFileIcon(getFileName(file))}
                  <div className="flex-1 truncate">
                    <div className="font-semibold truncate">{getFileName(file)}</div>
                    <div className="text-[10px] text-slate-400 truncate">{file.path}</div>
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>}
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File info and actions */}
            <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(getFileName(currentFile))}
                <span className="font-mono text-xs font-bold text-white">{currentFile.path}</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">— {currentFile.description}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
                  title="Copier le code dans le presse-papier"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
                  title="Télécharger ce fichier individuel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Télécharger</span>
                </button>
              </div>
            </div>

            {/* Code Body with line numbers */}
            <div className="flex-1 p-4 overflow-auto max-h-[540px] font-mono text-xs leading-relaxed text-slate-200 bg-slate-950/90 selection:bg-indigo-500 selection:text-white">
              <pre className="overflow-x-auto whitespace-pre">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: BEST PRACTICES AUDIT */
        <div className="p-6 space-y-4 bg-slate-950">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>
                Conformité aux Bonnes Pratiques
                {techStack ? ` pour ${techStack.language.toUpperCase()} & ${techStack.framework.toUpperCase()}` : ''}
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Le code généré a été soumis à une validation d'architecture et de sécurité conforme aux standards officiels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestPractices.map((check, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{check.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono">
                      {check.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
