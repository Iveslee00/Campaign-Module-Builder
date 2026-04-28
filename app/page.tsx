'use client';

import { useState, useCallback } from 'react';
import { PageModule, ModuleSchemaItem, ExportedCode } from '@/types/modules';
import { generateId } from '@/lib/utils';
import { generatePageHTML } from '@/lib/export/htmlGenerator';
import { generatePageCSS } from '@/lib/export/cssGenerator';
import { arrayMove } from '@dnd-kit/sortable';

import { GlobalSettingsContext } from '@/contexts/GlobalSettingsContext';
import { ModuleLibrary } from '@/components/editor/ModuleLibrary';
import { PreviewCanvas } from '@/components/editor/PreviewCanvas';
import { InspectorPanel } from '@/components/editor/InspectorPanel';
import { ExportModal } from '@/components/editor/ExportModal';

import { Download, Layers } from 'lucide-react';

type DeviceMode = 'desktop' | 'mobile';

export default function Page() {
  const [modules, setModules] = useState<PageModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exportCode, setExportCode] = useState<ExportedCode | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [buttonColor, setButtonColor] = useState('#6366f1');
  const [pageBackgroundColor, setPageBackgroundColor] = useState('');

  const selectedModule = modules.find((m) => m.id === selectedId) ?? null;

  const addModule = useCallback((schema: ModuleSchemaItem) => {
    const newModule = {
      id: generateId(),
      type: schema.type,
      data: JSON.parse(JSON.stringify(schema.defaultData)),
    } as PageModule;
    setModules((prev) => [...prev, newModule]);
    setSelectedId(newModule.id);
  }, []);

  const updateModule = useCallback((id: string, data: PageModule['data']) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? ({ ...m, data } as PageModule) : m))
    );
  }, []);

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const duplicateModule = useCallback((id: string) => {
    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const copy = { ...prev[idx], id: generateId(), data: JSON.parse(JSON.stringify(prev[idx].data)) } as PageModule;
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  const reorderModules = useCallback((activeId: string, overId: string) => {
    setModules((prev) => {
      const oldIndex = prev.findIndex((m) => m.id === activeId);
      const newIndex = prev.findIndex((m) => m.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleExport = () => {
    const html = generatePageHTML(modules);
    const css = generatePageCSS({ buttonColor, pageBackgroundColor });
    setExportCode({ html, css });
  };

  return (
    <GlobalSettingsContext.Provider value={{ buttonColor, setButtonColor, pageBackgroundColor, setPageBackgroundColor }}>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 z-20">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Layers size={14} className="text-white" />
            </div>
            <span className="text-slate-100 font-semibold text-sm tracking-tight">Campaign Builder</span>
            {modules.length > 0 && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {modules.length} module{modules.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            onClick={handleExport}
            disabled={modules.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Download size={14} />
            Export Code
          </button>
        </header>

        {/* Three-column layout */}
        <div className="flex flex-1 overflow-hidden">
          <ModuleLibrary onAdd={addModule} />

          <PreviewCanvas
            modules={modules}
            selectedId={selectedId}
            deviceMode={deviceMode}
            onDeviceChange={setDeviceMode}
            onSelect={setSelectedId}
            onDelete={deleteModule}
            onDuplicate={duplicateModule}
            onReorder={reorderModules}
          />

          <InspectorPanel
            module={selectedModule}
            onChange={(data) => selectedId && updateModule(selectedId, data)}
          />
        </div>

        {exportCode && (
          <ExportModal code={exportCode} onClose={() => setExportCode(null)} />
        )}
      </div>
    </GlobalSettingsContext.Provider>
  );
}
