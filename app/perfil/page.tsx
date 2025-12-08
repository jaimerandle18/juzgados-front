"use client";


export default async function Page() {
  const token =  sessionStorage.getItem("auth_token")
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Backend error:", await res.text());
    throw new Error("Falló la API");
  }

  const user = await res.json();

  return (
    <main className="pt-24 pb-20 px-6 max-w-xl mx-auto text-gray-900">

      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Mi Perfil</h1>
        <div className="mx-auto mt-3 h-[3px] w-36 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* CARD DEL PERFIL */}
      <div
        className="
          bg-white/70 backdrop-blur-lg 
          border border-gray-200 
          shadow-xl rounded-2xl p-8 
          transition-all hover:shadow-2xl
        "
      >
        {/* NOMBRE */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-1">
            Nombre completo
          </p>
          <p className="text-xl font-bold text-gray-900">
            {user.nombre} {user.apellido}
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold mb-1">
            Email
          </p>
          <p className="text-lg text-gray-800">{user.email}</p>
        </div>

        {/* BOTÓN LOGOUT */}
        <a
          href="/logout"
          className="
            inline-block w-full text-center 
            px-6 py-3 
            font-semibold rounded-xl 
            text-red-600 border border-red-500
            hover:bg-red-50 hover:shadow-md transition-all
          "
        >
          Cerrar sesión
        </a>
      </div>
    </main>
  );
}
