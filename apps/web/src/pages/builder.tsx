/**
 * Builder Page — Canvas Editor
 * @package apps/web
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppShell } from '../shell/app-shell'

export function BuilderPage() {
  const router = useRouter()
  const { projectId } = router.query

  useEffect(() => {
    if (projectId) {
      console.log('Loading project:', projectId)
      // TODO: Load project from storage
    }
  }, [projectId])

  return (
    <AppShell
      projectName="My Design"
      defaultSidebarOpen={true}
      defaultInspectorOpen={true}
    />
  )
}

export default BuilderPage
