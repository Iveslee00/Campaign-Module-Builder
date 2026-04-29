export type EmailModuleType =
  | 'email-kv'
  | 'email-products'
  | 'email-image-products'
  | 'email-bank-info'
  | 'email-article'
  | 'email-coupon';

export interface EmailBaseModule {
  id: string;
  type: EmailModuleType;
}

// ── KV Banner ─────────────────────────────────────────────────────────────────
export interface EmailKvData {
  image: string;
  link: string;
  altText: string;
  backgroundColor: string;
}
export interface EmailKvModule extends EmailBaseModule { type: 'email-kv'; data: EmailKvData; }

// ── Products ──────────────────────────────────────────────────────────────────
export type EmailProductsLayout = '1col' | '2col' | '3col' | 'featured' | '1+2';

export interface EmailProductItem {
  id: string;
  image: string;
  name: string;
  brand: string;
  originalPrice: string;
  salePrice: string;
  link: string;
  badgeText: string;
  showBadge: boolean;
}

export interface EmailProductsData {
  layout: EmailProductsLayout;
  products: EmailProductItem[];
  title: string;
  buttonText: string;
  backgroundColor: string;
}
export interface EmailProductsModule extends EmailBaseModule { type: 'email-products'; data: EmailProductsData; }

// ── Image + Products ──────────────────────────────────────────────────────────
export interface EmailImageProductsData {
  bannerImage: string;
  bannerLink: string;
  bannerTitle: string;
  bannerSubtitle: string;
  products: EmailProductItem[];
  buttonText: string;
  backgroundColor: string;
}
export interface EmailImageProductsModule extends EmailBaseModule { type: 'email-image-products'; data: EmailImageProductsData; }

// ── Bank Info ─────────────────────────────────────────────────────────────────
export interface EmailBankItem {
  id: string;
  cardName: string;
  benefit: string;
  condition: string;
  note: string;
  accentColor: string;
  logo: string;
}
export interface EmailBankInfoData {
  title: string;
  subtitle: string;
  items: EmailBankItem[];
  disclaimer: string;
  linkText: string;
  linkUrl: string;
  backgroundColor: string;
}
export interface EmailBankInfoModule extends EmailBaseModule { type: 'email-bank-info'; data: EmailBankInfoData; }

// ── Article ───────────────────────────────────────────────────────────────────
export interface EmailArticleData {
  eyebrow: string;
  title: string;
  content: string;
  image: string;
  buttonText: string;
  link: string;
  backgroundColor: string;
  titleColor: string;
  textColor: string;
}
export interface EmailArticleModule extends EmailBaseModule { type: 'email-article'; data: EmailArticleData; }

// ── Coupon ────────────────────────────────────────────────────────────────────
export interface EmailCouponData {
  title: string;
  code: string;
  description: string;
  validity: string;
  buttonText: string;
  link: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
}
export interface EmailCouponModule extends EmailBaseModule { type: 'email-coupon'; data: EmailCouponData; }

// ── Union & Settings ──────────────────────────────────────────────────────────
export type EmailPageModule =
  | EmailKvModule
  | EmailProductsModule
  | EmailImageProductsModule
  | EmailBankInfoModule
  | EmailArticleModule
  | EmailCouponModule;

export interface EmailSettings {
  backgroundColor: string;
  contentBgColor: string;
  primaryColor: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  trackingPixel: string;
  previewText: string;
}

export interface EmailModuleSchemaItem {
  type: EmailModuleType;
  key: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  defaultData: EmailPageModule['data'];
}
