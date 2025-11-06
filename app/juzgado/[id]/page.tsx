"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "src/lib/api";
import { Star } from "lucide-react";
import clsx from "clsx";
import VotarJuzgado from "../../components/VotarJuzgado";
import LoadingScreen from "../../components/LoadingScreen";

export default function JuzgadoDetalle() {
  const { id } = useParams();
  const [juzgado, setJuzgado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string>>({});
  const [puntuacion, setPuntuacion] = useState<number>(0);
  const [success, setSuccess] = useState(false);
  const [miVoto, setMiVoto] = useState<any>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  // Asumiendo que JuzgadoCard tiene acceso a juzgado.juzgado
const direccionCompleta = juzgado?.juzgado?.direccion;
const ciudad = juzgado?.juzgado?.ciudad; // <-- Si la ciudad está disponible

// Construye la cadena de búsqueda completa para Maps
const queryMaps = `${direccionCompleta}${ciudad ? ', ' + ciudad : ''}`;

// ... dentro de tu componente JSX



  // 🔹 Obtener datos del juzgado
  useEffect(() => {
    const fetchJuzgado = async () => {
      try {
        const res = await api.get(`/juzgados/${id}`);
        setJuzgado(res.data);
        console.log(res,"res")

        if (res.data.miVoto) {
          setMiVoto(res.data.miVoto);
          setForm(JSON.parse(res.data.miVoto.comentario || "{}"));
          setPuntuacion(res.data.miVoto.puntuacion || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJuzgado();
  }, [id]);

  const handleSelect = (pregunta: string, valor: string) => {
    setForm((prev) => ({ ...prev, [pregunta]: valor }));
  };

  const handleSubmit = async () => {
    if (!puntuacion) {
      alert("Seleccioná una puntuación con estrellas antes de enviar.");
      return;
    }

    try {
      await api.post(`/juzgados/${id}/votar`, {
        puntuacion,
        comentario: JSON.stringify(form),
      });
      setSuccess(true);
      setModoEdicion(false);
      alert("✅ Evaluación guardada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al enviar evaluación");
    }
  };

  const handleEliminar = async () => {
    if (!confirm("¿Seguro que querés eliminar tu evaluación?")) return;
    try {
      await api.delete(`/juzgados/${id}/voto`);
      setMiVoto(null);
      setForm({});
      setPuntuacion(0);
      alert("✅ Evaluación eliminada");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar evaluación");
    }
  };

  if (loading) return  <LoadingScreen key="loading" />;
  if (!juzgado) return <p className="text-center text-red-500">No se encontró el juzgado.</p>;

  const preguntas = [
    {
      id: "celeridad_escritos",
      texto: "¿Cómo califica la celeridad del juzgado para proveer escritos y resolver peticiones?",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "celeridad_sentencia",
      texto: "¿Cómo califica la celeridad del juzgado para dictar sentencia?",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "atencion",
      texto: "¿Cómo calificarías la atención del juzgado?",
      opciones: ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"],
    },
    {
      id: "telefono",
      texto: "¿Atienden el teléfono?",
      opciones: ["Sí", "No"],
    },
    {
      id: "mails",
      texto: "¿Responden mails?",
      opciones: ["Sí", "No"],
    },
    {
      id: "presencial",
      texto: "¿La atención presencial es suficiente?",
      opciones: ["Sí", "No", "No se encuentran siempre los secretarios"],
    },
    {
      id: "honorarios",
      texto: "¿El juez cumple con la ley de honorarios?",
      opciones: ["Sí", "No", "Sí, pero regula bajos"],
    },
    {
      id: "audiencias",
      texto: "¿Las audiencias son tomadas en debida forma y con profesionalidad?",
      opciones: ["Sí", "No"],
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-black px-4 py-10"
    style={{ marginTop: "70px" }}>
      <div
        style={{
          background: "white",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "1.5rem",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          
        }}
      >
        <h1 className="text-2xl font-bold mb-2">{juzgado.juzgado.nombre}</h1>
        <p className="text-black  mb-4">{juzgado.juzgado.ciudad || "Sin ciudad"}</p>
        <p className="text-black mb-4">Telefono: {juzgado.juzgado.telefono || "Sin ciudad"}</p>
        <p className="text-black  mb-4">Email: {juzgado.juzgado.email || "Sin ciudad"}</p>
        <div className="mb-4">
  <p className="text-black">
    {/* 1. Dirección como texto simple y legible */}
    Dirección: {direccionCompleta || "Sin especificar"}
  </p>

  {/* 2. Enlace de acción "Ver mapa" */}
  {direccionCompleta && (
    <a
    style={{marginTop:"15px"}}
      // CRÍTICO: Usar encodeURIComponent para que la dirección funcione en la URL
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryMaps)}`}
      target="_blank" 
      rel="noopener noreferrer" 
      // Estilo para hacerlo un link visible y atractivo
      className="text-grey hover:text-rojo font-semibold text-sm transition mt-1 inline-block underline"
    >
      Ver mapa
    </a>
  )}
</div>
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-lg font-semibold">
            {juzgado.estadisticas.promedioCalificacion.toFixed(1)} / 5
          </span>
          <span className="text-sm text-gray-600 ">
            ({juzgado.estadisticas.totalVotos} votos)
          </span>
        </div>

        {/* 🔹 Si ya votó */}
        {miVoto && !modoEdicion ? (
          <div className="bg-white p-5 rounded-2xl text-center mb-6">
            <p className="text-green-500 font-semibold mb-3">✅ Ya evaluaste este juzgado</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setModoEdicion(true)}
                className="bg-#1f5691 hover:bg-[#1f5691] hover:text-white px-4 py-2 rounded-xl font-semibold"
              >
                Modificar mi evaluación
              </button>
              <button
                onClick={handleEliminar}
                className="bg-gray-600  hover:bg-gray-700 px-4 text-white py-2 rounded-xl font-semibold"
              >
                Eliminar mi evaluación
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Evaluación</h2>

            {preguntas.map((p) => (
              <div key={p.id} className="mb-6">
                <p className="mb-3 font-medium">{p.texto}</p>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 w-full max-w-lg">
                  {p.opciones.map((op) => (
                    <button
                      style={{cursor:"pointer"}}
                      key={op}
                      type="button"
                      onClick={() => handleSelect(p.id, op)}
                      className={clsx(
                        "p-3 rounded-xl border text-sm transition-all",
                        form[p.id] === op
                          ? "bg-rojo text-black border-#1f5691 text-white"
                          : "bg-white border- hover:border-#1f5691"
                      )}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 mb-4">
              <VotarJuzgado
                puntuacionInicial={puntuacion}
                onChangePuntuacion={setPuntuacion}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{cursor:"pointer"}}
              className="bg-white hover:bg-[#1f5691] hover:text-white text-black font-semibold py-3 rounded-2xl w-full mt-4"
            >
              {miVoto ? "Actualizar evaluación" : "Enviar evaluación"}
            </button>

            {success && (
              <p className="text-green-500 text-center mt-4 font-medium">
                ✅ ¡Evaluación enviada con éxito!
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
