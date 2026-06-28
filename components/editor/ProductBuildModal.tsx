'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { ImagePlus, PackagePlus, Sparkles, X } from 'lucide-react';
import {
  ProductBuilderInput,
  defaultProductBuilderInput,
} from '@/lib/productBuilder/productPageBuilder';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl, storeLocalImage } from '@/lib/assets/localImageStore';

interface ProductBuildModalProps {
  onClose: () => void;
  onCreate: (input: ProductBuilderInput) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function ProductBuildModal({ onClose, onCreate }: ProductBuildModalProps) {
  const [input, setInput] = useState<ProductBuilderInput>(() => defaultProductBuilderInput());
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState('');

  const update = (key: keyof ProductBuilderInput, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleImage = async (key: 'mainImage' | 'mobileImage' | 'backgroundImage', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(key);
    try {
      const stored = await storeLocalImage(file);
      update(key, stored.ref);
    } finally {
      setUploading('');
      event.target.value = '';
    }
  };

  useEffect(() => {
    let alive = true;
    const objectUrls: string[] = [];

    const resolveImages = async () => {
      const next: Record<string, string> = {};
      for (const key of ['mainImage', 'mobileImage', 'backgroundImage'] as const) {
        const value = input[key];
        if (!value) continue;
        if (!isLocalImageRef(value)) {
          next[key] = value;
          continue;
        }
        const resolved = await resolveLocalImageUrl(value);
        if (resolved) {
          objectUrls.push(resolved);
          next[key] = resolved;
        }
      }
      if (alive) setPreviewImages(next);
    };

    void resolveImages();

    return () => {
      alive = false;
      objectUrls.forEach(revokeResolvedLocalImageUrl);
    };
  }, [input.mainImage, input.mobileImage, input.backgroundImage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-5">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">
              <Sparkles size={14} />
              從商品建立
            </div>
            <h2 className="text-2xl font-black text-white">清潔用品爆品頁 Demo</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              輸入商品資料後，會自動套用「水氧潔淨」樣式並產生一組可編輯模組。
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="關閉"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 p-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="mb-4 text-sm font-black text-slate-200">商品基本資料</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="品牌">
                  <input value={input.brand} onChange={(event) => update('brand', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="品名">
                  <input value={input.productName} onChange={(event) => update('productName', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="原價">
                  <input value={input.originalPrice} onChange={(event) => update('originalPrice', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="特價">
                  <input value={input.salePrice} onChange={(event) => update('salePrice', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="mb-4 text-sm font-black text-slate-200">頁面文案</p>
              <div className="space-y-4">
                <Field label="主標">
                  <input value={input.headline} onChange={(event) => update('headline', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="副標">
                  <input value={input.subtitle} onChange={(event) => update('subtitle', event.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="商品說明">
                  <textarea value={input.description} onChange={(event) => update('description', event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-semibold leading-6 text-white outline-none focus:border-cyan-400" />
                </Field>
                <Field label="商品詳情">
                  <textarea value={input.details} onChange={(event) => update('details', event.target.value)} rows={4} className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-semibold leading-6 text-white outline-none focus:border-cyan-400" />
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-5 border-t border-slate-800 bg-slate-950/40 p-6 lg:border-l lg:border-t-0">
            <section className="rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_48%,#dff7ff_100%)] p-5 text-slate-950">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">頁面主題</p>
              <h3 className="mt-2 text-2xl font-black">水氧潔淨</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                為清潔用品設計的清爽主題，適合洗衣精、除菌噴霧、居家清潔、浴廁清潔等爆品頁。
              </p>
              <div className="mt-4 flex gap-2">
                <span className="h-8 w-8 rounded-full bg-cyan-300" />
                <span className="h-8 w-8 rounded-full bg-sky-100" />
                <span className="h-8 w-8 rounded-full bg-white ring-1 ring-slate-200" />
                <span className="h-8 w-8 rounded-full bg-slate-900" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="mb-4 text-sm font-black text-slate-200">圖片素材</p>
              <div className="space-y-3">
                {[
                  ['mainImage', '商品主圖', '1000 x 1000 去背 PNG'] as const,
                  ['mobileImage', 'M 版商品圖', '建議 750 x 850'] as const,
                  ['backgroundImage', 'KV 背景圖', '建議 1920 x 640'] as const,
                ].map(([key, label, hint]) => (
                  <div key={key} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-200">{label}</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{hint}</p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-cyan-400">
                        <ImagePlus size={14} />
                        {uploading === key ? '上傳中' : '上傳'}
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(key, event)} />
                      </label>
                    </div>
                    {input[key] && (
                      <div className="mt-3 h-24 overflow-hidden rounded-lg bg-slate-800">
                        <img src={previewImages[key] || ''} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="mb-4 text-sm font-black text-slate-200">賣點與連結</p>
              <div className="grid gap-3">
                <input value={input.benefitOne} onChange={(event) => update('benefitOne', event.target.value)} className="h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                <input value={input.benefitTwo} onChange={(event) => update('benefitTwo', event.target.value)} className="h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                <input value={input.benefitThree} onChange={(event) => update('benefitThree', event.target.value)} className="h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                <input value={input.ctaText} onChange={(event) => update('ctaText', event.target.value)} className="h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" />
                <input value={input.ctaLink} onChange={(event) => update('ctaLink', event.target.value)} className="h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-400" placeholder="https://..." />
              </div>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-800 px-6 py-4">
          <p className="text-sm font-semibold text-slate-500">
            會產生 KV、錨點、商品展示、核心賣點、商品特色、商品資訊、FAQ 與購買轉換，回到畫布後仍可拖拉編輯。
          </p>
          <button
            onClick={() => onCreate(input)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cyan-500 px-6 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-400"
          >
            <PackagePlus size={18} />
            建立爆品頁
          </button>
        </div>
      </div>
    </div>
  );
}
