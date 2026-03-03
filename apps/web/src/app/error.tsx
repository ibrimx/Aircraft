'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>App crashed</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {String(error?.stack || error?.message || error)}
        </pre>
        <button onClick={() => reset()}>Retry</button>
      </body>
    </html>
  );
}
