'use client';

import { useState } from 'react';
import { ExportedCode } from '@/types/modules';
import { copyToClipboard } from '@/lib/utils';
import { X, Copy, Check, Code2, Palette, FileCode2 } from 'lucide-react';

interface Props {
  code: ExportedCode;
  onClose: () => void;
}

type Tab = 'html' | 'css';

export function ExportModal({ code, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('html');
  const [copied, setCopied] = useState<Tab | null>(null);

  const handleCopy = async (type: Tab) => {
    const text = type === 'html' ? code.html : code.css;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const activeCode = activeTab === 'html' ? code.html : code.css;
  const lineCount = activeCode.split('\n').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <FileCode2 size={16} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-slate-100 font-semibold text-base">Export Code</h2>
              <p className="text-slate-500 text-xs mt-0.5">Copy and paste into your CMS or project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Usage note */}
        <div className="px-6 py-3 bg-indigo-950/40 border-b border-slate-800">
          <p className="text-xs text-indigo-300/80 leading-relaxed">
            <strong className="text-indigo-300">How to use:</strong> Paste the <code className="bg-indigo-900/50 px-1 rounded">HTML</code> where your content goes, and add the <code className="bg-indigo-900/50 px-1 rounded">CSS</code> to your stylesheet or a <code className="bg-indigo-900/50 px-1 rounded">&lt;style&gt;</code> tag in <code className="bg-indigo-900/50 px-1 rounded">&lt;head&gt;</code>. All classes are prefixed with <code className="bg-indigo-900/50 px-1 rounded">cb-</code> to avoid conflicts.
          </p>
        </div>

        {/* Tabs + Copy */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
          <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'html'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 size={14} />
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'css'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette size={14} />
              CSS
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{lineCount} lines</span>
            <button
              onClick={() => handleCopy(activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                copied === activeTab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copied === activeTab ? (
                <>
                  <Check size={13} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy {activeTab.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code area */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 rounded-b-2xl">
          <pre className="p-5 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre overflow-x-auto">
            <code>{activeCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
