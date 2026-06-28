'use client';

import { ProductShowcaseData } from '@/types/modules';
import { ColorSection, FormField, ImageField, SegmentedField, ToggleField } from '@/components/ui/FormField';
import { IMAGE_SPECS } from '@/lib/assets/imageSpecs';

interface Props { data: ProductShowcaseData; onChange: (data: ProductShowcaseData) => void }

const styleOptions = [
  { value: 'full-bleed', label: '滿版形象' },
  { value: 'spacious', label: '留白展示' },
  { value: 'split', label: '左右分欄' },
  { value: 'luxury', label: '精品卡片' },
];

export function ProductShowcaseForm({ data, onChange }: Props) {
  const set = <K extends keyof ProductShowcaseData>(key: K, val: ProductShowcaseData[K]) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-4">
      <SegmentedField label="樣式" value={data.style} options={styleOptions} onChange={(v) => set('style', v as ProductShowcaseData['style'])} />
      <ToggleField label="左右對調" description="左右排版時可交換圖片與文字" value={data.reverse} onChange={(v) => set('reverse', v)} />
      <div className="h-px bg-slate-700/60" />
      <FormField label="Eyebrow" value={data.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <FormField label="標題" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} />
      <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={2} />
      <FormField label="說明" value={data.description} onChange={(v) => set('description', v)} type="textarea" rows={4} />
      <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} />
      <FormField label="按鈕連結" value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" />
      <div className="h-px bg-slate-700/60" />
      <ImageField label="展示圖片（PC）" value={data.image} onChange={(v) => set('image', v)} spec={IMAGE_SPECS.productShowcase} />
      <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">同 PC 視覺</button>
      <ImageField label="展示圖片（M）" value={data.mobileImage} onChange={(v) => set('mobileImage', v)} spec={IMAGE_SPECS.productShowcaseMobile} />
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
