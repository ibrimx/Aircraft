// P64 — adaptive-input.tsx
import {
  type ReactNode,
  type CSSProperties,
  type InputHTMLAttributes,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { EASING, DURATION } from '@brimair/design-tokens';
import { AdaptiveInputToolbar } from './adaptive-input-toolbar';

/* ── Types ─────────────────────────────────────────────── */

export type ToolbarAction = {
  id: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
};

export type AdaptiveInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> & {
  label?: string;
  error?: string;
  toolbarActions?: ToolbarAction[];
};

/* ── Constants ───────────────────────────────────────────── */

const FOCUS_TRANSITION = `border-color ${DURATION.fast}ms ${EASING.easeOut}`;

/* ── Component ───────────────────────────────────────────── */

export function AdaptiveInput(props: AdaptiveInputProps) {
  const { label, error, toolbarActions = [], onFocus, onBlur, ...inputProps } = props;
  const tokens = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const borderColor = error
    ? tokens.errorText
    : focused
      ? tokens.accentPrimary
      : tokens.border;

  const inputStyle: CSSProperties = useMemo(
    () => ({
      inlineSize: '100%',
      blockSize: 48,
      paddingInline: 14,
      fontSize: 16,
      color: tokens.textPrimary,
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${borderColor}`,
      borderRadius: 10,
      outline: 'none',
      transition: FOCUS_TRANSITION,
      WebkitAppearance: 'none' as const,
    }),
    [borderColor, tokens.textPrimary],
  );

  const labelStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      fontWeight: 500,
      color: tokens.textSecondary,
      marginBlockEnd: 6,
    }),
    [tokens.textSecondary],
  );

  const errorStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      color: tokens.errorText,
      marginBlockStart: 4,
    }),
    [tokens.errorText],
  );

  return (
    <div>
      {label && <div style={labelStyle}>{label}</div>}
      <input
        ref={inputRef}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...inputProps}
      />
      {error && <div style={errorStyle}>{error}</div>}
      <AnimatePresence>
        {focused && toolbarActions.length > 0 && (
          <AdaptiveInputToolbar actions={toolbarActions} />
        )}
      </AnimatePresence>
    </div>
  );
}
