'use client';

import { ProductSceneItem, ProductScenesData } from '@/types/modules';
import { ColorSection, FormField, ImageField, SegmentedField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';
import { generateId } from '@/lib/utils';

interface Props { data: ProductScenesData; onChange: (data: ProductScenesData) => void }

const styleOptions = [
  { value: 'left-image', label: '左圖右文' },
  { value: 'right-image', label: '右圖左文' },
  { value: 'full-bleed', label: '滿版情境' },
  { value: 'double-image', label: '雙圖情境' },
];

const createItem = (): ProductSceneItem => ({
  id: generateId(),
  title: '情境標題',
  description: '描述使用場景與使用後感受。',
  image: '',
  mobileImage: '',
});

export function ProductScenesForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductScenesData>(key: K, val: ProductScenesData[K]) => onChange({ ...data, [key]: val });
  const updateItem = (id: string, patch: Partial<ProductSceneItem>) => {
    set('items', data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={styleOptions} onChange={(v) => set('style', v as ProductScenesData['style'])} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} />
      <div className="h-px bg-slate-700/60" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">情境內容</p>
          <button type="button" onClick={() => set('items', [...data.items, createItem()])} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">+ 新增</button>
        </div>
        {data.items.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">情境 {index + 1}</p>
              {data.items.length > 1 && (
                <button type="button" onClick={() => set('items', data.items.filter((next) => next.id !== item.id))} className="text-xs text-slate-500 hover:text-red-300">刪除</button>
              )}
            </div>
            <FormField label="標題" value={item.title} onChange={(v) => updateItem(item.id, { title: v })} />
            <FormField label="說明" value={item.description} onChange={(v) => updateItem(item.id, { description: v })} type="textarea" rows={3} />
            <ImageField label="情境圖片（PC）" value={item.image} onChange={(v) => updateItem(item.id, { image: v })} spec={IMAGE_SPECS.productScene} />
            <button type="button" onClick={() => updateItem(item.id, { mobileImage: item.image })} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">同 PC 視覺</button>
            <ImageField label="情境圖片（M）" value={item.mobileImage} onChange={(v) => updateItem(item.id, { mobileImage: v })} spec={IMAGE_SPECS.productSceneMobile} />
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
