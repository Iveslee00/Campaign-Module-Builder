'use client';

import React from 'react';
import type { GlobalSettings } from '@/types/modules';
import { isLocalImageRef, resolveLocalImageUrl, revokeResolvedLocalImageUrl } from '@/lib/assets/localImageStore';
import { generatePageCSS } from '@/lib/export/cssGenerator';

interface CampaignExportStylesProps {
  settings: Partial<GlobalSettings>;
  forceMobile?: boolean;
}

const MOBILE_PREVIEW_SCOPE = '.nexora-preview-mobile-scope';

function findMatchingBrace(css: string, openBraceIndex: number) {
  let depth = 0;
  for (let index = openBraceIndex; index < css.length; index += 1) {
    const char = css[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function prefixRuleSelectors(css: string, scope: string) {
  let output = '';
  let index = 0;

  while (index < css.length) {
    const openBraceIndex = css.indexOf('{', index);
    if (openBraceIndex === -1) {
      output += css.slice(index);
      break;
    }

    const selector = css.slice(index, openBraceIndex).trim();
    const closeBraceIndex = findMatchingBrace(css, openBraceIndex);
    if (closeBraceIndex === -1) {
      output += css.slice(index);
      break;
    }

    const body = css.slice(openBraceIndex + 1, closeBraceIndex);
    if (selector.startsWith('@')) {
      output += `${selector} {${prefixRuleSelectors(body, scope)}}`;
    } else {
      const scopedSelector = selector
        .split(',')
        .map((part) => `${scope} ${part.trim()}`)
        .join(', ');
      output += `${scopedSelector} {${body}}`;
    }

    index = closeBraceIndex + 1;
  }

  return output;
}

function extractForcedMobileCSS(css: string) {
  let output = '';
  let index = 0;

  while (index < css.length) {
    const mediaIndex = css.indexOf('@media', index);
    if (mediaIndex === -1) break;

    const openBraceIndex = css.indexOf('{', mediaIndex);
    if (openBraceIndex === -1) break;

    const mediaHeader = css.slice(mediaIndex, openBraceIndex);
    const closeBraceIndex = findMatchingBrace(css, openBraceIndex);
    if (closeBraceIndex === -1) break;

    if (/max-width:\s*(768|640)px/.test(mediaHeader)) {
      output += prefixRuleSelectors(css.slice(openBraceIndex + 1, closeBraceIndex), MOBILE_PREVIEW_SCOPE);
    }

    index = closeBraceIndex + 1;
  }

  return output ? `\n/* Forced mobile rules for builder preview canvas */\n${output}` : '';
}

export function CampaignExportStyles({ settings, forceMobile = false }: CampaignExportStylesProps) {
  const [resolvedBackgroundImage, setResolvedBackgroundImage] = React.useState(settings.pageBackgroundImage ?? '');

  React.useEffect(() => {
    let alive = true;
    let objectUrl = '';
    const backgroundImage = settings.pageBackgroundImage ?? '';

    if (!backgroundImage || !isLocalImageRef(backgroundImage)) {
      setResolvedBackgroundImage(backgroundImage);
      return () => undefined;
    }

    resolveLocalImageUrl(backgroundImage)
      .then((resolved) => {
        objectUrl = resolved;
        if (alive) setResolvedBackgroundImage(resolved || backgroundImage);
      })
      .catch(() => {
        if (alive) setResolvedBackgroundImage(backgroundImage);
      });

    return () => {
      alive = false;
      revokeResolvedLocalImageUrl(objectUrl);
    };
  }, [settings.pageBackgroundImage]);

  const css = React.useMemo(() => {
    const exportCss = generatePageCSS({
      ...settings,
      pageBackgroundImage: resolvedBackgroundImage,
    });
    return forceMobile ? `${exportCss}${extractForcedMobileCSS(exportCss)}` : exportCss;
  }, [
    settings.buttonColor,
    settings.buttonTextColor,
    settings.pageBackgroundColor,
    resolvedBackgroundImage,
    forceMobile,
  ]);

  return <style data-nexora-export-preview-css dangerouslySetInnerHTML={{ __html: css }} />;
}
