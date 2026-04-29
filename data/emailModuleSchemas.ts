import { EmailModuleSchemaItem, EmailProductItem } from '@/types/emailModules';
import { generateId } from '@/lib/utils';

const mkP = (overrides: Partial<EmailProductItem> = {}): EmailProductItem => ({
  id: generateId(),
  image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=Product',
  name: 'Product Name',
  brand: 'Brand',
  originalPrice: '$99.00',
  salePrice: '$69.00',
  link: '#',
  badgeText: '特賣',
  showBadge: false,
  ...overrides,
});

export const emailModuleSchemas: EmailModuleSchemaItem[] = [
  // ── KV ────────────────────────────────────────────────────────────────────
  {
    type: 'email-kv',
    key: 'email-kv',
    label: 'KV 主視覺',
    description: '電子報頂部 Banner 圖片',
    icon: 'image',
    category: 'KV',
    defaultData: {
      image: 'https://placehold.co/600x240/1a1a2e/6366f1?text=Email+Banner',
      link: '#',
      altText: 'Banner',
      backgroundColor: '#1a1a2e',
    },
  },

  // ── Products ──────────────────────────────────────────────────────────────
  {
    type: 'email-products',
    key: 'email-products-1col',
    label: '商品 — 單欄精選',
    description: '1 件商品，大圖全寬展示',
    icon: 'package',
    category: '商品',
    defaultData: {
      layout: '1col',
      title: '',
      buttonText: '立即選購',
      backgroundColor: '#ffffff',
      products: [mkP({ image: 'https://placehold.co/600x400/f0f0f8/6366f1?text=Product', showBadge: true, badgeText: '精選' })],
    },
  },
  {
    type: 'email-products',
    key: 'email-products-2col',
    label: '商品 — 雙欄',
    description: '2 件商品並排',
    icon: 'columns-2',
    category: '商品',
    defaultData: {
      layout: '2col',
      title: '',
      buttonText: '選購',
      backgroundColor: '#ffffff',
      products: [
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P1', name: 'Product One' }),
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P2', name: 'Product Two', showBadge: true, badgeText: 'NEW' }),
      ],
    },
  },
  {
    type: 'email-products',
    key: 'email-products-3col',
    label: '商品 — 三欄',
    description: '3 件商品一排',
    icon: 'grid',
    category: '商品',
    defaultData: {
      layout: '3col',
      title: '',
      buttonText: '選購',
      backgroundColor: '#ffffff',
      products: [
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P1', name: 'Product One' }),
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P2', name: 'Product Two' }),
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P3', name: 'Product Three', showBadge: true, badgeText: '特賣' }),
      ],
    },
  },
  {
    type: 'email-products',
    key: 'email-products-featured',
    label: '商品 — 主推款',
    description: '大圖文字左右排列，突顯重點商品',
    icon: 'star',
    category: '商品',
    defaultData: {
      layout: 'featured',
      title: '',
      buttonText: '立即選購',
      backgroundColor: '#ffffff',
      products: [mkP({ image: 'https://placehold.co/400x400/1a1a2e/6366f1?text=Featured', name: 'Signature Product', brand: 'Premium Brand', originalPrice: '$299.00', salePrice: '$199.00' })],
    },
  },
  {
    type: 'email-products',
    key: 'email-products-1plus2',
    label: '商品 — 1+2 組合',
    description: '1 件大圖 + 2 件小圖',
    icon: 'layout-panel-left',
    category: '商品',
    defaultData: {
      layout: '1+2',
      title: '',
      buttonText: '選購',
      backgroundColor: '#ffffff',
      products: [
        mkP({ image: 'https://placehold.co/400x300/1a1a2e/6366f1?text=Main', name: 'Main Product', showBadge: true, badgeText: '主推' }),
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P2', name: 'Product Two' }),
        mkP({ image: 'https://placehold.co/300x300/f0f0f8/6366f1?text=P3', name: 'Product Three' }),
      ],
    },
  },

  // ── 圖片帶商品 ─────────────────────────────────────────────────────────────
  {
    type: 'email-image-products',
    key: 'email-image-products',
    label: '圖片帶商品',
    description: '左側 Banner + 右側商品列表',
    icon: 'layout-panel-left',
    category: '圖片帶商品',
    defaultData: {
      bannerImage: 'https://placehold.co/220x360/1a1a2e/6366f1?text=Banner',
      bannerLink: '#',
      bannerTitle: '',
      bannerSubtitle: '',
      buttonText: '選購',
      backgroundColor: '#ffffff',
      products: [
        mkP({ image: 'https://placehold.co/280x280/f0f0f8/6366f1?text=P1', name: 'Product One' }),
        mkP({ image: 'https://placehold.co/280x280/f0f0f8/6366f1?text=P2', name: 'Product Two', showBadge: true, badgeText: '特賣' }),
      ],
    },
  },

  // ── 銀行資訊 ──────────────────────────────────────────────────────────────
  {
    type: 'email-bank-info',
    key: 'email-bank-info',
    label: '銀行贈獎資訊',
    description: '信用卡優惠說明區塊',
    icon: 'credit-card',
    category: '銀行資訊',
    defaultData: {
      title: '信用卡優惠說明',
      subtitle: '活動期間：即日起至 2024/12/31',
      disclaimer: '謹慎理財 信用至上',
      linkText: '查看更多 ›',
      linkUrl: '#',
      backgroundColor: '#f8f8fc',
      items: [
        { id: generateId(), cardName: '台新 Richart 卡', benefit: '最高 3.8% 回饋', condition: 'Pay 著刷', note: '每月上限 NT$500', accentColor: '#e53e3e', logo: '' },
        { id: generateId(), cardName: '玉山 Pi 拍錢包', benefit: '無上限 2.8%', condition: '一般消費', note: '國內外皆適用', accentColor: '#6366f1', logo: '' },
      ],
    },
  },

  // ── 文章 ──────────────────────────────────────────────────────────────────
  {
    type: 'email-article',
    key: 'email-article',
    label: '文章內容',
    description: '圖文並茂的文章段落',
    icon: 'file-text',
    category: '文章',
    defaultData: {
      eyebrow: '品牌故事',
      title: '文章標題',
      content: '在這裡輸入文章內容。你可以撰寫品牌故事、活動說明或任何想與讀者分享的資訊。',
      image: '',
      buttonText: '閱讀更多',
      link: '#',
      backgroundColor: '#ffffff',
      titleColor: '#1a1a2e',
      textColor: '#4a4a6a',
    },
  },

  // ── 折價券 ────────────────────────────────────────────────────────────────
  {
    type: 'email-coupon',
    key: 'email-coupon',
    label: '折價券',
    description: '專屬優惠碼與折扣說明',
    icon: 'tag',
    category: '折價券',
    defaultData: {
      title: '專屬折扣碼',
      code: 'SAVE300',
      description: '指定商品單筆滿 NT$1,000 可使用，享 NT$300 折扣',
      validity: '2024/12/31 前有效',
      buttonText: '立即使用',
      link: '#',
      backgroundColor: '#f0f4ff',
      accentColor: '#6366f1',
      textColor: '#1a1a2e',
    },
  },
];
