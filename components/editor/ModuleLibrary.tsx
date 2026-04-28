'use client';

import { ModuleSchemaItem } from '@/types/modules';
import { moduleSchemas } from '@/data/moduleSchemas';
import {
  Layout, Columns2, Grid2X2, Image as ImageIcon,
  Megaphone, HelpCircle, Plus, Package,
  Type, GalleryHorizontal, LayoutPanelLeft, Pin, FileText, FileImage,
} from 'lucide-react';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';

const iconMap: Record<string, React.ReactNode> = {
  layout: <Layout size={18} />,
  columns: <Columns2 size={18} />,
  grid: <Grid2X2 size={18} />,
  package: <Package size={18} />,
  image: <ImageIcon size={18} />,
  megaphone: <Megaphone size={18} />,
  'help-circle': <HelpCircle size={18} />,
  type: <Type size={18} />,
  'gallery-horizontal': <GalleryHorizontal size={18} />,
  'layout-panel-left': <LayoutPanelLeft size={18} />,
  pin: <Pin size={18} />,
  'file-text': <FileText size={18} />,
  'file-image': <FileImage size={18} />,
};

const categories = ['Layout', 'Content', 'Commerce', 'Brand', 'Conversion', 'Float'];

interface Props {
  onAdd: (schema: ModuleSchemaItem) => void;
}

export function ModuleLibrary({ onAdd }: Props) {
  const { buttonColor, setButtonColor, pageBackgroundColor, setPageBackgroundColor } = useGlobalSettings();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Modules</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {categories.map((cat) => {
          const items = moduleSchemas.filter((s) => s.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest px-1 mb-2">{cat}</p>
              <div className="space-y-1">
                {items.map((schema) => (
                  <button
                    key={schema.key}
                    onClick={() => onAdd(schema)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800 active:bg-slate-700 transition-colors group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      {iconMap[schema.icon] ?? <Layout size={18} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 leading-tight">{schema.label}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{schema.description}</p>
                    </div>
                    <Plus size={14} className="flex-shrink-0 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global settings — 常住左下角 */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-800 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">全站設定</p>

        {/* Page background */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500">底色</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={pageBackgroundColor || '#ffffff'}
                onChange={(e) => setPageBackgroundColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-7 h-7 rounded-md border border-slate-600 overflow-hidden"
                style={{ background: pageBackgroundColor || 'transparent' }}
              >
                {!pageBackgroundColor && (
                  <svg width="28" height="28" viewBox="0 0 28 28" className="text-slate-600">
                    <line x1="0" y1="0" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            </div>
            <input
              type="text"
              value={pageBackgroundColor}
              onChange={(e) => setPageBackgroundColor(e.target.value)}
              placeholder="無底色"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
            {pageBackgroundColor && (
              <button
                onClick={() => setPageBackgroundColor('')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Button color */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500">按鈕色</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-7 h-7 rounded-md border border-slate-600"
                style={{ background: buttonColor }}
              />
            </div>
            <input
              type="text"
              value={buttonColor}
              onChange={(e) => setButtonColor(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="#6366f1"
            />
            <button
              onClick={() => setButtonColor('#6366f1')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
              title="Reset"
            >
              ↺
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
