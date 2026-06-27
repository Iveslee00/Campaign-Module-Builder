import { PageModule, Product } from '@/types/modules';
import { generateId } from '@/lib/utils';

export type ProductPageTheme = 'cleanFresh';

export interface ProductBuilderInput {
  productName: string;
  brand: string;
  headline: string;
  subtitle: string;
  description: string;
  details: string;
  originalPrice: string;
  salePrice: string;
  ctaText: string;
  ctaLink: string;
  mainImage: string;
  mobileImage: string;
  backgroundImage: string;
  benefitOne: string;
  benefitTwo: string;
  benefitThree: string;
  theme: ProductPageTheme;
}

export const defaultProductBuilderInput = (): ProductBuilderInput => ({
  productName: '高效植萃洗衣精',
  brand: 'NEXORA CLEAN',
  headline: '讓日常清潔變得更輕鬆',
  subtitle: '溫和配方、強效去污，適合全家每日使用。',
  description: '以清爽潔淨感為核心，主打衣物、居家與日常使用場景。可用於清潔用品、洗衣精、除菌噴霧、浴廁清潔等商品頁。',
  details: '容量：1.8L\n香調：清新皂香\n適用：日常衣物、毛巾、寢具\n特色：低泡易沖洗、溫和不刺鼻、瓶身好握好倒。',
  originalPrice: '$399',
  salePrice: '$299',
  ctaText: '立即選購',
  ctaLink: '#',
  mainImage: '',
  mobileImage: '',
  backgroundImage: '',
  benefitOne: '強效去污',
  benefitTwo: '溫和不刺鼻',
  benefitThree: '清爽留香',
  theme: 'cleanFresh',
});

const productFromInput = (input: ProductBuilderInput, name = input.productName): Product => ({
  id: generateId(),
  image: input.mainImage,
  brand: input.brand,
  name,
  originalPrice: input.originalPrice,
  salePrice: input.salePrice,
  link: input.ctaLink || '#',
  showBadge: true,
  badgeText: '推薦',
  showSpecialTag: true,
  specialTag: '清潔用品',
});

export function createProductLandingModules(input: ProductBuilderInput): PageModule[] {
  const normalized = {
    ...defaultProductBuilderInput(),
    ...input,
  };
  const heroImage = normalized.backgroundImage || normalized.mainImage;
  const product = productFromInput(normalized);

  return [
    {
      id: generateId(),
      type: 'hero',
      data: {
        anchorName: '商品主視覺',
        showText: true,
        height: 'medium',
        kicker: normalized.brand,
        title: normalized.headline,
        subtitle: normalized.subtitle,
        buttonText: normalized.ctaText,
        buttonLink: normalized.ctaLink,
        image: heroImage,
        mobileImage: normalized.mobileImage || heroImage,
        layout: 'left-text-right-image',
        backgroundStyle: 'light',
        backgroundColor: 'linear-gradient(135deg, #e8f8ff 0%, #ffffff 44%, #d7f0f8 100%)',
        titleColor: '#0f2f3f',
        textColor: '#35586a',
      },
    },
    {
      id: generateId(),
      type: 'anchor-nav',
      data: {
        hiddenTargetIds: [],
        backgroundColor: '#ffffff',
        buttonColor: '#0ea5c6',
        textColor: '#ffffff',
      },
    },
    {
      id: generateId(),
      type: 'title',
      data: {
        anchorName: '清潔亮點',
        titleCn: '三個理由，讓清潔更省力',
        titleEn: 'Clean Fresh',
        alignment: 'center',
        titleColor: '#0f2f3f',
        backgroundColor: '#ffffff',
      },
    },
    {
      id: generateId(),
      type: 'product-banner',
      data: {
        anchorName: '立即購買',
        height: 'medium',
        kicker: '主打商品',
        headline: normalized.productName,
        tagline: normalized.description,
        brand: normalized.brand,
        productName: normalized.productName,
        originalPrice: normalized.originalPrice,
        salePrice: normalized.salePrice,
        showBadge: true,
        badgeText: '熱銷',
        buttonText: normalized.ctaText,
        buttonLink: normalized.ctaLink,
        image: normalized.mainImage,
        mobileImage: normalized.mobileImage || normalized.mainImage,
        backgroundStyle: 'light',
        backgroundColor: '#f3fbfd',
        reverse: false,
        titleColor: '#0f2f3f',
        textColor: '#35586a',
      },
    },
    {
      id: generateId(),
      type: 'split-section',
      data: {
        anchorName: '商品賣點',
        height: 'medium',
        title: `${normalized.benefitOne}，也保留衣物清爽感`,
        description: `${normalized.benefitTwo}、${normalized.benefitThree}，讓使用者快速理解這款清潔用品的核心優勢。此區可替換成使用情境、配方特色或清潔前後差異。`,
        image: normalized.mainImage,
        mobileImage: normalized.mobileImage || normalized.mainImage,
        buttonText: normalized.ctaText,
        buttonLink: normalized.ctaLink,
        reverse: true,
        backgroundColor: '#ffffff',
        titleColor: '#0f2f3f',
        textColor: '#4f6b78',
      },
    },
    {
      id: generateId(),
      type: 'article-text',
      data: {
        anchorName: '商品詳情',
        eyebrow: 'Product Detail',
        title: '商品規格與使用說明',
        subtitle: '把容量、適用範圍、使用方式與注意事項整理清楚，減少購買前疑問。',
        content: normalized.details,
        author: '',
        date: '',
        alignment: 'center',
        backgroundColor: '#eefaff',
        titleColor: '#0f2f3f',
        textColor: '#4f6b78',
      },
    },
    {
      id: generateId(),
      type: 'faq',
      data: {
        anchorName: '常見問題',
        backgroundColor: '#ffffff',
        titleColor: '#0f2f3f',
        textColor: '#4f6b78',
        items: [
          { id: generateId(), question: '這款清潔用品適合每天使用嗎？', answer: '適合日常清潔使用。可依照實際商品配方補充適用材質、衣物類型或居家場景。' },
          { id: generateId(), question: '味道會不會太刺激？', answer: '可在這裡說明香調、是否低刺激、是否有植萃或溫和配方等資訊。' },
          { id: generateId(), question: '優惠活動到什麼時候？', answer: '請依照實際檔期填寫，若售完或活動調整，以頁面與購物車顯示為準。' },
        ],
      },
    },
    {
      id: generateId(),
      type: 'product-grid',
      data: {
        anchorName: '推薦搭配',
        backgroundColor: '#f7fbfd',
        titleColor: '#0f2f3f',
        textColor: '#4f6b78',
        products: [
          product,
          productFromInput(normalized, '補充包組合'),
          productFromInput(normalized, '居家清潔搭配組'),
          productFromInput(normalized, '家庭號優惠組'),
        ],
      },
    },
  ];
}
