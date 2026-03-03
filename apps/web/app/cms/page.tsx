import CmsPage from '../../src/screens/cms-page';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sourceId?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  return <CmsPage sourceId={params.sourceId} />;
}
