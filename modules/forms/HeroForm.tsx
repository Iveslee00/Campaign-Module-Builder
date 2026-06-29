'use client';

import { HeroData } from '@/types/modules';
import { FormField, FormSection, SegmentedField, ToggleField, ColorSection, ImageField } from '@/components/ui/FormField';
import { getKvImageSpecs } from '@/lib/assets/imageSpecs';

interface Props { data: HeroData; onChange: (data: HeroData) => void }

const heightOptions = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

export function HeroForm({ data, onChange }: Props) {
  const set = <K extends keyof HeroData>(key: K, val: HeroData[K]) => onChange({ ...data, [key]: val });
  const showText = data.showText !== false;
  const imageSpecs = getKvImageSpecs(data.height, showText);

  return (
    <div className="space-y-4">
      <FormSection title="樣式" description="控制 KV 高度與文字區顯示方式。">
        <SegmentedField label="高度" value={data.height ?? 'medium'} onChange={(v) => set('height', v as HeroData['height'])} options={heightOptions} />
        <ToggleField label="顯示文字區" description="關閉後會成為純 Banner" value={data.showText ?? true} onChange={(v) => set('showText', v)} />
        <ColorSection
          backgroundColor={data.backgroundColor}
          onBackgroundColorChange={(v) => set('backgroundColor', v)}
          titleColor={data.titleColor}
          textColor={data.textColor}
          onTitleColorChange={(v) => set('titleColor', v)}
          onTextColorChange={(v) => set('textColor', v)}
          titleDefaultColor="#ffffff"
          textDefaultColor="#ffffff"
          titlePlaceholder="使用預設 #ffffff"
          textPlaceholder="使用預設 #ffffff"
          backgroundLabel="M 端文字底色"
          titleLabel="標題文字色"
          textLabel="內文 / 小標文字色"
        />
      </FormSection>

      {showText && (
        <FormSection title="內容" description="KV 上的活動文字。">
          <FormField label="小標" value={data.kicker} onChange={(v) => set('kicker', v)} placeholder="活動主打" />
          <FormField label="主標" value={data.title} onChange={(v) => set('title', v)} type="textarea" rows={2} placeholder="夏日限定優惠開跑" />
          <FormField label="副標" value={data.subtitle} onChange={(v) => set('subtitle', v)} type="textarea" rows={3} placeholder="用一句話說明活動利益點" />
        </FormSection>
      )}

      <FormSection title="行動" description={showText ? '設定按鈕文字與點擊連結。' : '純 Banner 會用整張圖片作為點擊區。'}>
        {showText && (
          <FormField label="按鈕文字" value={data.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即看優惠" />
        )}
        <FormField label={showText ? '按鈕 / Banner 連結' : '整張 Banner 連結'} value={data.buttonLink} onChange={(v) => set('buttonLink', v)} type="url" placeholder="https://" />
      </FormSection>

      <FormSection title="圖片" description="PC 與手機尺寸會依高度與是否顯示文字區切換。">
        <ImageField label={showText ? 'KV 圖片（PC 右側）' : 'KV 圖片（PC 整張）'} value={data.image} onChange={(v) => set('image', v)} spec={imageSpecs.desktop} />
        <button type="button" onClick={() => set('mobileImage', data.image)} className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300">
          同 PC 視覺
        </button>
        <ImageField label={showText ? 'KV 圖片（M 上方）' : 'KV 圖片（M 整張）'} value={data.mobileImage ?? ''} onChange={(v) => set('mobileImage', v)} spec={imageSpecs.mobile} />
      </FormSection>
    </div>
  );
}
