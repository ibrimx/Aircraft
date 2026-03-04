import dynamic from 'next/dynamic'

const BuilderApp = dynamic(
  () => import('../shell/app-shell').then((m) => m.AppShell),
  { ssr: false }
)

export default function BuilderPage() {
  return (
    <BuilderApp
      projectName="My Design"
      defaultSidebarOpen={true}
      defaultInspectorOpen={true}
    />
  )
}
