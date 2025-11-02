import fs from "fs";
import fetch from "node-fetch";

const endpoints = [
  // Nacionales
  "https://www.pjn.gov.ar/api/dependencia/codigo/347",
  "https://www.pjn.gov.ar/api/dependencia/codigo/228",
  "https://www.pjn.gov.ar/api/dependencia/codigo/477",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1723",
  // Federales
  "https://www.pjn.gov.ar/api/dependencia/codigo/946",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1724",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1721",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1086",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1737",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1739",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1742",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1744",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1751",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1754",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1756",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1759",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1761",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1763",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1765",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1768",
  "https://www.pjn.gov.ar/api/dependencia/codigo/1770",
];

const extraerJuzgados = async () => {
  const resultados = [];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      const agregarDependencia = (dep) => {
        const info = dep.dependenciaInfo || {};
        const domicilio = info.domicilio || {};
        resultados.push({
          id: dep.id,
          nombre: info.nombre || "",
          ciudad: domicilio.localidad?.nombre || "",
          direccion: domicilio.domicilio || "",
          telefono: info.telefono || "",
          email: info.email || "",
        });
      };

      // Dependencia principal
      if (data.dependencia) agregarDependencia(data.dependencia);

      // Subdependencias (juzgados específicos)
      if (Array.isArray(data.subDependencias)) {
        data.subDependencias.forEach(agregarDependencia);
      }

      console.log(`✅ Procesado: ${url}`);
    } catch (err) {
      console.error("❌ Error con", url, "→", err.message);
    }
  }

  // 🔹 Eliminar duplicados (nombre + ciudad)
  const unicos = new Map();
  for (const r of resultados) {
    const clave = `${r.nombre.toLowerCase()}-${r.ciudad.toLowerCase()}`;
    if (!unicos.has(clave)) unicos.set(clave, r);
  }
  const finales = Array.from(unicos.values());

  console.log(`✅ Total juzgados obtenidos: ${resultados.length}`);
  console.log(`✅ Total juzgados únicos: ${finales.length}`);

  // 🔹 Generar CSV
  const csv = [
    "id,nombre,ciudad,direccion,telefono,email",
    ...finales.map((r) =>
      [
        r.id,
        `"${r.nombre.replace(/"/g, '""')}"`,
        `"${r.ciudad}"`,
        `"${r.direccion}"`,
        `"${r.telefono}"`,
        `"${r.email}"`,
      ].join(",")
    ),
  ].join("\n");

  fs.writeFileSync("juzgados_pjn.csv", csv);
  console.log("📄 Archivo generado: juzgados_pjn.csv");
};

extraerJuzgados();
