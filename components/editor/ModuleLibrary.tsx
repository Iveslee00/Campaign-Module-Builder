'use client';

import { ModuleSchemaItem } from '@/types/modules';
import { EmailModuleSchemaItem } from '@/types/emailModules';
import { moduleSchemas } from '@/data/moduleSchemas';
import { emailModuleSchemas } from '@/data/emailModuleSchemas';
import { PageMode } from '@/app/page';
import {
  Layout, Columns2, Grid2X2, Image as ImageIcon,
  Megaphone, HelpCircle, Plus, Package, Star,
  Type, GalleryHorizontal, LayoutPanelLeft, Pin, FileText, FileImage,
  CreditCard, Tag, GalleryHorizontalEnd,
} from 'lucide-react';
import { useGlobalSettings } from '@/contexts/GlobalSettingsContext';
import { useEmailSettings } from '@/contexts/EmailSettingsContext';

const iconMap: Record<string, React.ReactNode> = {
  layout: <Layout size={18} />,
  columns: <Columns2 size={18} />,
  'columns-2': <Columns2 size={18} />,
  grid: <Grid2X2 size={18} />,
  package: <Package size={18} />,
  image: <ImageIcon size={18} />,
  megaphone: <Megaphone size={18} />,
  'help-circle': <HelpCircle size={18} />,
  type: <Type size={18} />,
  'gallery-horizontal': <GalleryHorizontal size={18} />,
  'gallery-horizontal-end': <GalleryHorizontalEnd size={18} />,
  'layout-panel-left': <LayoutPanelLeft size={18} />,
  pin: <Pin size={18} />,
  'file-text': <FileText size={18} />,
  'file-image': <FileImage size={18} />,
  'credit-card': <CreditCard size={18} />,
  tag: <Tag size={18} />,
  star: <Star size={18} />,
};

const campaignCategories = ['Layout', 'Content', 'Commerce', 'Brand', 'Conversion', 'Float'];
const emailCategories = ['KV', '商品', '圖片帶商品', '銀行資訊', '文章', '折價券'];

// Small inline color picker
function ColorPicker({ label, value, onChange, allowEmpty, resetLabel, onReset }: {
  label: string; value: string; onChange: (v: string) => void;
  allowEmpty?: boolean; resetLabel?: string; onReset?: () => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div className="w-7 h-7 rounded-md border border-slate-600 overflow-hidden" style={{ background: value || 'transparent' }}>
            {!value && allowEmpty && (
              <svg width="28" height="28" viewBox="0 0 28 28" className="text-slate-600">
                <line x1="0" y1="0" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        </div>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={allowEmpty ? '無底色' : '#000000'} className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 placeholder-slate-600" />
        {allowEmpty && value && <button onClick={() => onChange('')} className="text-xs text-slate-500 hover:text-slate-300 px-1" title="Clear">✕</button>}
        {!allowEmpty && onReset && <button onClick={onReset} className="text-xs text-slate-500 hover:text-slate-300 px-1" title="Reset">↺</button>}
      </div>
    </div>
  );
}

interface Props {
  pageMode: PageMode;
  onAdd: (schema: ModuleSchemaItem) => void;
  onAddEmail: (schema: EmailModuleSchemaItem) => void;
}

export function ModuleLibrary({ pageMode, onAdd, onAddEmail }: Props) {
  const { buttonColor, setButtonColor, pageBackgroundColor, setPageBackgroundColor } = useGlobalSettings();
  const emailSettings = useEmailSettings();

  const isEmail = pageMode === 'email';

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {isEmail ? 'Email Modules' : 'Modules'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {isEmail ? (
          // ── Email modules ─────────────────────────────────────────────
          emailCategories.map((cat) => {
            const items = emailModuleSchemas.filter((s) => s.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest px-1 mb-2">{cat}</p>
                <div className="space-y-1">
                  {items.map((schema) => (
                    <button key={schema.key} onClick={() => onAddEmail(schema)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800 active:bg-slate-700 transition-colors group">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 group-hover:bg-amber-600/20 text-slate-400 group-hover:text-amber-400 transition-colors">
                        {iconMap[schema.icon] ?? <Layout size={18} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 leading-tight">{schema.label}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{schema.description}</p>
                      </div>
                      <Plus size={14} className="flex-shrink-0 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // ── Campaign modules ──────────────────────────────────────────
          campaignCategories.map((cat) => {
            const items = moduleSchemas.filter((s) => s.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest px-1 mb-2">{cat}</p>
                <div className="space-y-1">
                  {items.map((schema) => (
                    <button key={schema.key} onClick={() => onAdd(schema)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-slate-800 active:bg-slate-700 transition-colors group">
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
          })
        )}
      </div>

      {/* Global settings — always visible at bottom */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-800 space-y-3">
        {isEmail ? (
          // ── Email settings ────────────────────────────────────────────
          <>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">電子報設定</p>
            <ColorPicker label="信件背景色" value={emailSettings.backgroundColor} onChange={(v) => emailSettings.update({ backgroundColor: v })} />
            <ColorPicker label="內容底色" value={emailSettings.contentBgColor} onChange={(v) => emailSettings.update({ contentBgColor: v })} />
            <ColorPicker label="主色（按鈕）" value={emailSettings.primaryColor} onChange={(v) => emailSettings.update({ primaryColor: v })} onReset={() => emailSettings.update({ primaryColor: '#6366f1' })} />
            <div className="h-px bg-slate-700/60" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">全站追蹤碼</p>
            <div className="space-y-2">
              {(['utmSource', 'utmMedium', 'utmCampaign'] as const).map((key) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs text-slate-500">{key === 'utmSource' ? 'UTM Source' : key === 'utmMedium' ? 'UTM Medium' : 'UTM Campaign'}</p>
                  <input type="text" value={emailSettings[key]} onChange={(e) => emailSettings.update({ [key]: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500" placeholder={key === 'utmSource' ? 'email' : key === 'utmMedium' ? 'newsletter' : 'campaign-name'} />
                </div>
              ))}
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Tracking Pixel HTML</p>
                <textarea value={emailSettings.trackingPixel} onChange={(e) => emailSettings.update({ trackingPixel: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 resize-none" placeholder='<img src="https://..." width="1" height="1">' />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">預覽文字（收件匣顯示）</p>
                <input type="text" value={emailSettings.previewText} onChange={(e) => emailSettings.update({ previewText: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500" placeholder="本週精選優惠，最高折扣…" />
              </div>
            </div>
          </>
        ) : (
          // ── Campaign settings ─────────────────────────────────────────
          <>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">全站設定</p>
            <ColorPicker label="底色" value={pageBackgroundColor} onChange={setPageBackgroundColor} allowEmpty />
            <ColorPicker label="按鈕色" value={buttonColor} onChange={setButtonColor} onReset={() => setButtonColor('#6366f1')} />
          </>
        )}
      </div>
    </aside>
  );
}
