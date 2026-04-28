'use client';

import { PageModule } from '@/types/modules';
import { FormRenderer } from '@/modules/forms/FormRenderer';
import { ColorField } from '@/components/ui/FormField';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { Settings } from 'lucide-react';

const moduleLabels: Record<string, string> = {
  'title': '標題區塊',
  'hero': 'Hero',
  'split-section': 'Split Content',
  'product-grid': 'Product Grid',
  'banner-products': 'Banner + Products',
  'product-banner': 'Product Banner',
  'product-carousel': 'Product Carousel',
  'logo-wall': 'Logo Wall',
  'cta': 'CTA Banner',
  'faq': 'FAQ',
  'sticky-sidebar': 'Sticky Bar',
  'article-text': '文章（純文字）',
  'article-image': '文章（帶圖片）',
};

const moduleColors: Record<string, string> = {
  'title': 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  'hero': 'bg-violet-600/20 text-violet-400 border-violet-600/30',
  'split-section': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  'product-grid': 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  'banner-products': 'bg-teal-600/20 text-teal-400 border-teal-600/30',
  'product-banner': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'product-carousel': 'bg-green-600/20 text-green-400 border-green-600/30',
  'logo-wall': 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  'cta': 'bg-rose-600/20 text-rose-400 border-rose-600/30',
  'faq': 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
  'sticky-sidebar': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  'article-text': 'bg-sky-600/20 text-sky-400 border-sky-600/30',
  'article-image': 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
};

interface Props {
  module: PageModule | null;
  onChange: (data: PageModule['data']) => void;
}

export function InspectorPanel({ module, onChange }: Props) {
  const { buttonColor, setButtonColor, pageBackgroundColor, setPageBackgroundColor } = useGlobalSettings();

  if (!module) {
    return (
      <aside className="w-72 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
            <Settings size={13} className="text-slate-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Page Settings</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          <div className="space-y-1.5">
            <p className="text-xs text-slate-500 leading-relaxed">
              全站設定會套用到所有模組與匯出的 CSS。
            </p>
          </div>

          <div className="h-px bg-slate-800" />

          <ColorField
            label="Page Background"
            value={pageBackgroundColor}
            onChange={setPageBackgroundColor}
            placeholder="無底色"
          />

          <ColorField
            label="Button Color"
            value={buttonColor}
            onChange={setButtonColor}
          />

          <div className="h-px bg-slate-800" />

          <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-3 space-y-1.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Export Tip</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Page Background 會寫入 <code className="bg-slate-700 px-1 rounded text-slate-300">.cb-page</code> 的 <code className="bg-slate-700 px-1 rounded text-slate-300">background-color</code>。
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const label = moduleLabels[module.type] ?? module.type;
  const colorClass = moduleColors[module.type] ?? 'bg-slate-700 text-slate-300 border-slate-600';

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colorClass}`}>
          {label}
        </span>
        <span className="text-xs text-slate-500">Properties</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <FormRenderer module={module} onChange={onChange} />
      </div>
    </aside>
  );
}
