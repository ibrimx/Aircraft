import { type JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useAuth, useBreakpoint, useI18n } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

type Project = {
  id: string;
  name: string;
  lastEdited: string;
  thumbnail: string;
};

export function DashboardPage(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (!isAuthenticated) nav('/login', { replace: true });
  }, [isAuthenticated, nav]);

  const projects: Project[] = [];

  return (
    <div style= minHeight: '100vh', background: tk.bg.default, paddingBlock: 48, paddingInline: 24 >
      <div style= maxWidth: 1200, marginInline: 'auto' >
        <div style= display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 32, flexWrap: 'wrap', gap: 16 >
          <h1 style= fontSize: '1.5rem', fontWeight: 700, color: tk.text.primary >
            {t('dashboard.title')}
          </h1>
          <Button variant="primary" onClick={() => nav('/new-project')}>
            {t('dashboard.newProject')}
          </Button>
        </div>

        {projects.length === 0 ? (
          <div style= textAlign: 'center', paddingBlock: 120 >
            <p style= fontSize: '1.125rem', color: tk.text.secondary, marginBlockEnd: 24 >
              {t('dashboard.emptyState')}
            </p>
            <Button variant="primary" size="lg" onClick={() => nav('/new-project')}>
              {t('builder.addPage')}
            </Button>
          </div>
        ) : (
          <div style= display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 >
            {projects.map((project) => (
              <div
                key={project.id}
                style={{ background: tk.bg.surface, border: `1px solid ${tk.border.default}`, borderRadius: 12, overflow: 'hidden' }}
              >
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  style= width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' 
                />
                <div style= padding: 16 >
                  <h3 style= fontSize: '1rem', fontWeight: 600, color: tk.text.primary >
                    {project.name}
                  </h3>
                  <p style= fontSize: '0.75rem', color: tk.text.tertiary, marginBlockStart: 4 >
                    {project.lastEdited}
                  </p>
                  <div style= display: 'flex', gap: 8, marginBlockStart: 12 >
                    <Button variant="secondary" size="sm" onClick={() => nav(`/studio/${project.id}`)}>
                      {t('dashboard.openStudio')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => nav(`/builder/${project.id}`)}>
                      {t('dashboard.openBuilder')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
