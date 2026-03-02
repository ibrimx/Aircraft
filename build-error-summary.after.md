# Build Error Summary (After Dependencies)

## UI (`@aircraft/ui`)

### First 60 TypeScript errors
Generated with:

```bash
rg "error TS" ./ui-build.after-deps.log -n | head -n 60
```

Top examples from the output:
- `src/auth/invite-gate.tsx(75,48): error TS2322`
- `src/auth/invite-manager.tsx(1,30): error TS6133`
- `src/cms/record-card.tsx(136,56): error TS2339`
- `src/mobile/bottom-rail-indicator.tsx(5,10): error TS2305`
- `src/mobile/mobile-context-menu.tsx(131,23): error TS7006`

### Error code frequency (top 15)
Generated with:

```bash
rg "error TS[0-9]+:" ./ui-build.after-deps.log \
| sed -n "s/.*error \\(TS[0-9]\\+\\):.*/\\1/p" \
| sort | uniq -c | sort -nr | head -n 15
```

Observed frequency:

| Count | Code |
|---:|---|
| 38 | TS2322 |
| 21 | TS6133 |
| 13 | TS2339 |
| 10 | TS2305 |
| 6 | TS2724 |
| 6 | TS2554 |
| 5 | TS18047 |
| 4 | TS2345 |
| 3 | TS6192 |
| 2 | TS7053 |
| 2 | TS2362 |
| 1 | TS7006 |
| 1 | TS2769 |
| 1 | TS2561 |
| 1 | TS2551 |

## Design Tokens (`@aircraft/design-tokens`)

### Build output (first 120 lines)
Generated with:

```bash
pnpm --filter @aircraft/design-tokens build 2>&1 | tee ./dt-build.after.log || true
sed -n '1,120p' ./dt-build.after.log
```

Observed diagnostics:
- `src/theme-provider.tsx(61,5): error TS2322`
- `src/theme-provider.tsx(66,5): error TS2322`
- `src/theme-provider.tsx(73,5): error TS2322`
- `src/theme-provider.tsx(76,5): error TS2322`

### Error code frequency (top 15)
Generated with:

```bash
rg "error TS[0-9]+:" ./dt-build.after.log \
| sed -n "s/.*error \\(TS[0-9]\\+\\):.*/\\1/p" \
| sort | uniq -c | sort -nr | head -n 15
```

Observed frequency:

| Count | Code |
|---:|---|
| 4 | TS2322 |
