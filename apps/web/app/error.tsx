'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }): React.JSX.Element {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>App crashed</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.stack || error?.message || error)}</pre>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
