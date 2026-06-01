export const dynamic = "force-dynamic";

import RankingsClient from "./RankingsClient";

interface Fuero {
  id: number;
  nombre: string;
  tipo: string;
}

export default async function RankingsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros`, {
    next: { revalidate: 300 },
  });
  const fueros: Fuero[] = await res.json();

  return <RankingsClient fueros={fueros} />;
}
