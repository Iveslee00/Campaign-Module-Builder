'use client';

import type React from 'react';
import { PageModule } from '@/types/modules';
import { TitleForm } from './TitleForm';
import { HeroForm } from './HeroForm';
import { SplitSectionForm } from './SplitSectionForm';
import { ProductGridForm } from './ProductGridForm';
import { BannerProductsForm } from './BannerProductsForm';
import { ProductBannerForm } from './ProductBannerForm';
import { ProductCarouselForm } from './ProductCarouselForm';
import { LogoWallForm } from './LogoWallForm';
import { CtaForm } from './CtaForm';
import { FaqForm } from './FaqForm';
import { StickySidebarForm } from './StickySidebarForm';
import { ArticleTextForm } from './ArticleTextForm';
import { ArticleImageForm } from './ArticleImageForm';
import { HeroCarouselForm } from './HeroCarouselForm';
import { BankPromoForm } from './BankPromoForm';
import { AnchorNavForm } from './AnchorNavForm';
import { ProductFeaturesForm } from './ProductFeaturesForm';
import { ProductShowcaseForm } from './ProductShowcaseForm';
import { ProductScenesForm } from './ProductScenesForm';
import { ProductInfoForm } from './ProductInfoForm';
import {
  ProductBenefitsForm,
  ProductComparisonForm,
  ProductProofForm,
  ProductPurchaseForm,
  ProductStepsForm,
} from './ProductAdvancedForms';
import { FormField, FormSection } from '@/components/ui/FormField';

interface Props {
  module: PageModule;
  modules: PageModule[];
  onChange: (data: PageModule['data']) => void;
}

export function FormRenderer({ module, modules, onChange }: Props) {
  if (module.type === 'anchor-nav') {
    return <AnchorNavForm data={module.data} moduleId={module.id} modules={modules} onChange={onChange as (d: typeof module.data) => void} />;
  }

  const anchorName = 'anchorName' in module.data ? module.data.anchorName ?? '' : '';
  const updateAnchorName = (value: string) => onChange({ ...module.data, anchorName: value } as PageModule['data']);
  const anchorField = (
    <FormSection title="進階設定" description="錨點名稱填寫後，可被錨點導覽列為跳轉目標。">
      <FormField label="錨點名稱" value={anchorName} onChange={updateAnchorName} placeholder="例如：熱銷商品、活動說明" />
    </FormSection>
  );
  const checkField = (
    <FormSection title="檢查" description="下一階段會在這裡顯示缺圖、空連結、尺寸與匯出風險。">
      <p className="text-xs leading-relaxed text-slate-500">目前可正常編輯。匯出前檢查會在 BQ-005 / BQ-006 補上。</p>
    </FormSection>
  );

  let form: React.ReactNode = null;
  switch (module.type) {
    case 'title':
      form = <TitleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'hero':
      form = <HeroForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'split-section':
      form = <SplitSectionForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-grid':
      form = <ProductGridForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'banner-products':
      form = <BannerProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-banner':
      form = <ProductBannerForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-carousel':
      form = <ProductCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'logo-wall':
      form = <LogoWallForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'cta':
      form = <CtaForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'faq':
      form = <FaqForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'sticky-sidebar':
      form = <StickySidebarForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'article-text':
      form = <ArticleTextForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'article-image':
      form = <ArticleImageForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'hero-carousel':
      form = <HeroCarouselForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'bank-promo':
      form = <BankPromoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-features':
      form = <ProductFeaturesForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-showcase':
      form = <ProductShowcaseForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-scenes':
      form = <ProductScenesForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-info':
      form = <ProductInfoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-benefits':
      form = <ProductBenefitsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-steps':
      form = <ProductStepsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-comparison':
      form = <ProductComparisonForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-proof':
      form = <ProductProofForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    case 'product-purchase':
      form = <ProductPurchaseForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
      break;
    default:
      return null;
  }

  return <div className="space-y-4">{checkField}{form}{anchorField}</div>;
}
