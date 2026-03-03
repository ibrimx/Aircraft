/**
 * Mobile Layout — Framer 2025 + Canva-style bottom bar
 * @package apps/web
 */

import { useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { BottomSheet } from '@aircraft/ui'
import { MobileToolbar } from './mobile-toolbar'
import { MobileBottomBar, type BottomBarCategory } from './mobile-bottom-bar'
import { MobileCategoryPanels } from './mobile-category-panels'
import { MobileInspector } from './mobile-inspector'

export type MobileLayoutProps = {
  toolbar?: ReactNode
  workspace: ReactNode
  statusBar?: ReactNode
  projectName?: string
  selectedElement?: boolean
}

export function MobileLayout({
  toolbar,
  workspace,
  statusBar,
  projectName = 'Untitled',
  selectedElement = false,
}: MobileLayoutProps) {
  const theme = useThemeTokens()
  const [activeCategory, setActiveCategory] = useState<BottomBarCategory | null>(null)
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [inspectorSheetOpen, setInspectorSheetOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCategoryPress = useCallback((category: BottomBarCategory) => {
    if (activeCategory === category && categorySheetOpen) {
      setCategorySheetOpen(false)
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
      setCategorySheetOpen(true)
      setInspectorSheetOpen(false)
    }
  }, [activeCategory, categorySheetOpen])

  const handleCloseCategory = useCallback(() => {
    setCategorySheetOpen(false)
    setActiveCategory(null)
  }, [])

  const handleElementSelect = useCallback(() => {
    setInspectorSheetOpen(true)
    setCategorySheetOpen(false)
    setActiveCategory(null)
  }, [])

  const handleCloseInspector = useCallback(() => {
    setInspectorSheetOpen(false)
  }, [])

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    background: theme.colors.surface.default,
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  }

  const workspaceStyle: CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  }

  return (
    <div style={containerStyle}>
      {/* Top Bar */}
      {toolbar || (
        <MobileToolbar
          projectName={projectName}
          onMenuOpen={() => setMenuOpen(true)}
        />
      )}

      {/* Workspace */}
      <div style={workspaceStyle}>
        {workspace}
      </div>

      {/* Category Bottom Sheet */}
      <BottomSheet
        open={categorySheetOpen}
        onClose={handleCloseCategory}
        snapPoints={[0.4, 0.6, 0.9]}
        initialSnap={0}
        backdrop={false}
        handle={true}
      >
        {activeCategory && (
          <MobileCategoryPanels activeCategory={activeCategory} />
        )}
      </BottomSheet>

      {/* Inspector Bottom Sheet (when element selected) */}
      <BottomSheet
        open={inspectorSheetOpen && selectedElement}
        onClose={handleCloseInspector}
        snapPoints={[0.35, 0.5, 0.8]}
        initialSnap={0}
        backdrop={false}
        handle={true}
      >
        <MobileInspector
          onDelete={handleCloseInspector}
          onDuplicate={() => {}}
          onMore={() => {}}
        />
      </BottomSheet>

      {/* Bottom Tools Bar — Always visible */}
      <MobileBottomBar
        activeCategory={activeCategory}
        onCategoryPress={handleCategoryPress}
      />

      {/* Status Bar */}
      {statusBar}
    </div>
  )
}
