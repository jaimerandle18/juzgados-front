import DependenciasGrid from "@/components/DependenciasGrid";

export default async function Page({
  params,
}: {
  params: Promise<{ fueroId: string }>;
}) {
  const { fueroId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros/${fueroId}/dependencias`,
    { cache: "no-store" }
  );

  const datos = await res.json();

  const tribunalesCriminal = datos.tribunales_orales.filter((t: any) =>
    t.nombre.toLowerCase().includes("criminal")
  );

  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight"> Tribunales Orales en lo Criminal y Correccional</h1>
          <div className="mx-auto mt-3 h-[3px] w-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
        </div>

      <DependenciasGrid items={tribunalesCriminal} />
    </main>
  );
}
