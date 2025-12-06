import { api } from "../../src/lib/api";

interface Fuero {
    id: number;
    nombre: string;
    tipo: string;
  }
  
  export default async function Home() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pjn/fueros`, {
        cache: "no-store",
      });
      const fueros: Fuero[] = await res.json();
      
  
    return (
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">Data Jury</h1>
        <p className="text-gray-600 mb-8">Buscá, evaluá y compará juzgados.</p>
  
        <div className="max-w-md mx-auto grid gap-4">
          {fueros.map((f: Fuero) => (
            <a
              key={f.id}
              href={`/fueros/${f.id}`}
              className="block p-4 bg-white shadow rounded hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">{f.nombre}</h2>
              <p className="text-gray-500 capitalize">{f.tipo}</p>
            </a>
          ))}
        </div>
      </div>
    );
  }
