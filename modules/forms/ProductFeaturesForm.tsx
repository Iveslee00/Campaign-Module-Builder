'use client';

import { ProductFeatureItem, ProductFeaturesData } from '@/types/modules';
import { ColorSection, FormField, SegmentedField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';

interface Props { data: ProductFeaturesData; onChange: (data: ProductFeaturesData) => void }

const styleOptions = [
  { value: 'grid-4', label: '四宮格' },
  { value: 'grid-6', label: '六宮格' },
  { value: 'icon-text', label: 'Icon文字' },
  { value: 'cards', label: '卡片式' },
];

const styleDescriptions: Record<ProductFeaturesData['style'], string> = {
  'grid-4': '四宮格：適合 4 個核心特色，短標題、短說明，讓使用者快速掃描。',
  'grid-6': '六宮格：適合較多功能點，資訊密度高，但每格文字要更短。',
  'icon-text': 'Icon文字：適合清單式賣點，節奏較輕，像功能摘要。',
  cards: '卡片式：適合較長文字，每張卡片空間更大，可放情境或利益說明。',
};

const createItem = (): ProductFeatureItem => ({
  id: generateId(),
  icon: '✨',
  title: '特色標題',
  description: '用一句話說明商品特色。',
});

export function ProductFeaturesForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductFeaturesData>(key: K, val: ProductFeaturesData[K]) => onChange({ ...data, [key]: val });
  const updateItem = (id: string, patch: Partial<ProductFeatureItem>) => {
    set('items', data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={styleOptions} onChange={(v) => set('style', v as ProductFeaturesData['style'])} />
      <p className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 px-3 py-2 text-xs leading-5 text-cyan-100/80">{styleDescriptions[data.style]}</p>
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} />
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">特色項目</p>
          <button type="button" onClick={() => set('items', [...data.items, createItem()])} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">+ 新增</button>
        </div>
        {data.items.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">特色 {index + 1}</p>
              {data.items.length > 1 && (
                <button type="button" onClick={() => set('items', data.items.filter((next) => next.id !== item.id))} className="text-xs text-slate-500 hover:text-red-300">刪除</button>
              )}
            </div>
            <FormField label="Icon" value={item.icon} onChange={(v) => updateItem(item.id, { icon: v })} />
            <FormField label="標題" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <FormField label="說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={3} />
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-700/60" />
      <ColorSection
        backgroundColor={data.backgroundColor}
        onBackgroundColorChange={(v) => set('backgroundColor', v)}
        titleColor={data.titleColor}
        textColor={data.textColor}
        onTitleColorChange={(v) => set('titleColor', v)}
        onTextColorChange={(v) => set('textColor', v)}
      />
    </div>
  );
}
