import { useMemo } from 'react';

export type PlatformInfo = {
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown';
  isMobile: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
};

const SSR_PLATFORM: PlatformInfo = {
  os: 'unknown', browser: 'unknown',
  isMobile: false, isDesktop: false,
  isIOS: false, isAndroid: false, isSafari: false,
};

function detectPlatform(): PlatformInfo {
  if (typeof navigator === 'undefined') return SSR_PLATFORM;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0);
  const isAndroid = /Android/i.test(ua);
  const isMacOS = /Macintosh/i.test(ua) && !isIOS;
  const isWindows = /Windows/i.test(ua);
  const isLinux = /Linux/i.test(ua) && !isAndroid;

  const os = isIOS ? 'ios' : isAndroid ? 'android' : isMacOS ? 'macos'
    : isWindows ? 'windows' : isLinux ? 'linux' : 'unknown';

  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isEdge = /Edg\//i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !isEdge;
  const browser = isSafari ? 'safari' : isEdge ? 'edge' : isFirefox ? 'firefox'
    : isChrome ? 'chrome' : 'unknown';

  const isMobile = isIOS || isAndroid;
  return { os, browser, isMobile, isDesktop: !isMobile, isIOS, isAndroid, isSafari };
}

export function usePlatform(): PlatformInfo {
  return useMemo(detectPlatform, []);
}
