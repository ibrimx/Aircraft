import JoinPage from '../../src/screens/join-page';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  return <JoinPage token={params.token} />;
}
