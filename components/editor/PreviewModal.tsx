'use client';

import React, { useRef, useState, useCallback } from 'react';
import { PageModule } from '@/types/modules';
import { EmailPageModule } from '@/types/emailModules';
import { ModulePreviewRenderer } from '@/modules/preview/ModulePreviewRenderer';
import { EmailModulePreviewRenderer } from '@/modules/email/preview/EmailModulePreviewRenderer';
import { DeviceContext } from '@/contexts/DeviceContext';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';
import { PageMode } from '@/app/page';
import { X, Camera, Monitor, Smartphone } from 'lucide-react';

type DeviceMode = 'desktop' | 'mobile';

interface Props {
  pageMode: PageMode;
  modules: PageModule[];
  emailModules: EmailPageModule[];
  onClose: () => void;
}

export function PreviewModal({ pageMode, modules, emailModules, onClose }: Props) {
  const { pageBackgroundColor } = useGlobalSettings();
  const emailSettings = useEmailSettings();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [capturing, setCapturing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isEmail = pageMode === 'email';
  const isMobile = deviceMode === 'mobile';

  const handleScreenshot = useCallback(async () => {
    if (!contentRef.current || capturing) return;
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: isEmail
          ? (emailSettings.backgroundColor || '#f4f4f4')
          : (pageBackgroundColor || '#ffffff'),
        logging: false,
        scrollY: -window.scrollY,
        windowHeight: contentRef.current.scrollHeight,
        height: contentRef.current.scrollHeight,
      });
      const link = document.createElement('a');
      link.download = `preview-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
    } catch (e) {
      console.error('Screenshot failed', e);
    } finally {
      setCapturing(false);
    }
  }, [capturing, isEmail, emailSettings.backgroundColor, pageBackgroundColor]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-200">
            {isEmail ? '電子報預覽' : '活動頁面預覽'}
          </span>
          {!isEmail && (
            <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${!isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Monitor size={13} /><span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${isMobile ? 'bg-slate-600 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Smartphone size={13} /><span>Mobile</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScreenshot}
            disabled={capturing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-wait text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Camera size={14} />
            {capturing ? '截圖中…' : '截圖 JPG'}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className={`flex-1 overflow-y-auto ${isEmail ? '' : isMobile ? 'bg-slate-800' : 'bg-slate-950'}`}
        style={isEmail ? { backgroundColor: emailSettings.backgroundColor || '#f4f4f4' } : {}}>
        {isEmail ? (
          <div className="flex justify-center py-8 px-4">
            <div ref={contentRef} className="w-full" style={{ maxWidth: '600px', backgroundColor: emailSettings.contentBgColor || '#ffffff' }}>
              {emailModules.map((module) => (
                <EmailModulePreviewRenderer key={module.id} module={module} />
              ))}
            </div>
          </div>
        ) : (
          <DeviceContext.Provider value={{ isMobile }}>
            {isMobile ? (
              <div className="flex justify-center py-6 px-4">
                <div style={{ width: '390px' }} className="shadow-2xl rounded-2xl overflow-hidden border border-slate-600">
                  {/* Mobile status bar */}
                  <div className="flex items-center justify-between px-5 py-2 bg-slate-900 text-slate-400 text-xs border-b border-slate-700">
                    <span className="font-medium">9:41</span>
                    <div className="flex gap-1 items-center">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="3" width="3" height="7" rx="1"/><rect x="4" y="2" width="3" height="8" rx="1"/><rect x="8" y="0" width="3" height="10" rx="1"/><rect x="12" y="4" width="2" height="6" rx="1" opacity=".4"/></svg>
                    </div>
                  </div>
                  <div ref={contentRef} style={pageBackgroundColor ? { backgroundColor: pageBackgroundColor } : {}}>
                    {modules.map((module) => (
                      <ModulePreviewRenderer key={module.id} module={module} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div ref={contentRef} style={pageBackgroundColor ? { backgroundColor: pageBackgroundColor } : {}}>
                {modules.map((module) => (
                  <ModulePreviewRenderer key={module.id} module={module} />
                ))}
              </div>
            )}
          </DeviceContext.Provider>
        )}
      </div>
    </div>
  );
}
