'use client';
import { EmailPageModule } from '@/types/emailModules';
import { EmailKvForm } from './EmailKvForm';
import { EmailProductsForm } from './EmailProductsForm';
import { EmailImageProductsForm } from './EmailImageProductsForm';
import { EmailBankInfoForm } from './EmailBankInfoForm';
import { EmailArticleForm } from './EmailArticleForm';
import { EmailCouponForm } from './EmailCouponForm';

interface Props {
  module: EmailPageModule;
  onChange: (data: EmailPageModule['data']) => void;
}

export function EmailFormRenderer({ module, onChange }: Props) {
  switch (module.type) {
    case 'email-kv':
      return <EmailKvForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-products':
      return <EmailProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-image-products':
      return <EmailImageProductsForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-bank-info':
      return <EmailBankInfoForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-article':
      return <EmailArticleForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    case 'email-coupon':
      return <EmailCouponForm data={module.data} onChange={onChange as (d: typeof module.data) => void} />;
    default:
      return null;
  }
}
