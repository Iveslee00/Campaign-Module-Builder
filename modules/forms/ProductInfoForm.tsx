'use client';

import { ProductInfoData, ProductInfoItem } from '@/types/modules';
import { ColorSection, FormField, SegmentedField } from '@/components/ui/FormField';
import { generateId } from '@/lib/utils';

interface Props { data: ProductInfoData; onChange: (data: ProductInfoData) => void }

const styleOptions = [
  { value: 'ingredients', label: '成分' },
  { value: 'technology', label: '技術' },
  { value: 'specs', label: '規格' },
  { value: 'contents', label: '內容物' },
];

const createItem = (): ProductInfoItem => ({
  id: generateId(),
  label: '項目',
  value: '內容',
  description: '補充說明',
});

export function ProductInfoForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductInfoData>(key: K, val: ProductInfoData[K]) => onChange({ ...data, [key]: val });
  const updateItem = (id: string, patch: Partial<ProductInfoItem>) => {
    set('items', data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={styleOptions} onChange={(v) => set('style', v as ProductInfoData['style'])} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} />
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">資訊項目</p>
          <button type="button" onClick={() => set('items', [...data.items, createItem()])} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">+ 新增</button>
        </div>
        {data.items.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">資訊 {index + 1}</p>
              {data.items.length > 1 && (
                <button type="button" onClick={() => set('items', data.items.filter((next) => next.id !== item.id))} className="text-xs text-slate-500 hover:text-red-300">刪除</button>
              )}
            </div>
            <FormField label="項目" value={item.label} onChange={(v) => updateItem(item.id, { label: v })} />
            <FormField label="內容" value={item.value} onChange={(v) => updateItem(item.id, { value: v })} />
            <FormField label="補充說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={2} />
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
