import React, { useState, useRef } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, ExternalLink, Maximize2, Minimize2, Download } from 'lucide-react';
import { PlatformDevice } from '../types';

interface AppPreviewFrameProps {
  htmlCode: string;
  appName?: string;
  defaultDevice?: PlatformDevice;
  heightClass?: string;
}

export const AppPreviewFrame: React.FC<AppPreviewFrameProps> = ({
  htmlCode,
  appName = 'Application Démo',
  defaultDevice = 'mobile',
  heightClass = 'h-[580px]',
}) => {
  const [device, setDevice] = useState<PlatformDevice>(defaultDevice);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      className={`flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/98 shadow-2xl' : ''
      }`}
    >
      {/* Top Device & Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              device === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Aperçu Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              device === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Aperçu Tablette (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablette</span>
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              device === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Aperçu Ordinateur (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bureau</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            {device === 'mobile' ? '375 x 667' : device === 'tablet' ? '768 x 1024' : 'Plein Écran'}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Recharger la démo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
            title="Ouvrir dans un nouvel onglet pour installer directement sur votre appareil"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Tester / Installer</span>
          </button>
          <button
            onClick={handleOpenNewTab}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Frame Viewer Body */}
      <div className={`flex-1 bg-slate-900/60 p-2 sm:p-4 flex items-center justify-center overflow-auto ${heightClass}`}>
        <div
          className={`${getDeviceWidth()} h-full transition-all duration-300 flex flex-col ${
            device === 'mobile'
              ? 'border-4 border-slate-700 rounded-[32px] shadow-2xl overflow-hidden bg-slate-900 ring-1 ring-slate-600/40'
              : device === 'tablet'
              ? 'border-4 border-slate-700 rounded-2xl shadow-2xl overflow-hidden bg-slate-900'
              : 'w-full rounded-xl overflow-hidden border border-slate-800'
          }`}
        >
          {/* Mock Mobile notch/speaker when on mobile mode */}
          {device === 'mobile' && (
            <div className="bg-slate-900 h-5 w-full flex items-center justify-center shrink-0 border-b border-slate-800/80">
              <div className="w-16 h-2.5 bg-slate-800 rounded-full"></div>
            </div>
          )}

          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={htmlCode}
            title={appName}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
