import { useState, useEffect } from 'react';

export type VisualViewportState = {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
  scale: number;
  isSupported: boolean;
};

const SSR_STATE: VisualViewportState = {
  width: 0, height: 0, offsetTop: 0, offsetLeft: 0, scale: 1, isSupported: false,
};

export function useVisualViewport(): VisualViewportState {
  const [state, setState] = useState<VisualViewportState>(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return SSR_STATE;
    const vv = window.visualViewport;
    return {
      width: vv.width, height: vv.height,
      offsetTop: vv.offsetTop, offsetLeft: vv.offsetLeft,
      scale: vv.scale, isSupported: true,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => setState({
      width: vv.width, height: vv.height,
      offsetTop: vv.offsetTop, offsetLeft: vv.offsetLeft,
      scale: vv.scale, isSupported: true,
    });
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return state;
}
