import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import logo from "../../public/dataJury1.png";

// Destino del QR de descarga: en el celular redirige directo a la tienda
// que corresponde; en desktop (o si no hay link para esa tienda) muestra
// los dos botones.
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.datajury.app";
// Sin código de país, así Apple abre la tienda del país del usuario.
const APP_STORE_URL = "https://apps.apple.com/app/id6758679680";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Descargá Data Jury",
  description: "Descargá la app de Data Jury para iPhone y Android",
};

export default async function DescargarPage() {
  const ua = (await headers()).get("user-agent") ?? "";

  if (/iPhone|iPad|iPod/i.test(ua) && APP_STORE_URL) redirect(APP_STORE_URL);
  if (/Android/i.test(ua) && PLAY_STORE_URL) redirect(PLAY_STORE_URL);

  return (
    <main className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-6 pb-10 text-center">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-8">
        <Image src={logo} alt="Data Jury" className="mx-auto h-16 w-auto" priority />
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Descargá la app</h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        <p className="mt-4 text-gray-600">
          Evaluá juzgados, consultá rankings y planificá tus recorridos desde el celular.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {APP_STORE_URL && (
            <StoreButton href={APP_STORE_URL} small="Descargalo en el" big="App Store" />
          )}
          <StoreButton href={PLAY_STORE_URL} small="Disponible en" big="Google Play" />
        </div>
      </div>
    </main>
  );
}

function StoreButton({ href, small, big }: { href: string; small: string; big: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center rounded-xl bg-gray-900 px-6 py-3 text-white shadow-md transition hover:bg-gray-800"
    >
      <span className="text-xs opacity-80">{small}</span>
      <span className="text-lg font-semibold leading-tight">{big}</span>
    </a>
  );
}
