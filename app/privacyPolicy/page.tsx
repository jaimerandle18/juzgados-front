export default function PrivacyPolicyPage() {
    return (
      <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
        <h1>Política de Privacidad – Data Jury</h1>
        <p>Última actualización: {new Date().toLocaleDateString()}</p>
  
        <h2>1. Información que recopilamos</h2>
        <p>
          Data Jury recopila información básica como nombre, apellido y correo
          electrónico con el único fin de permitir el acceso a la plataforma.
        </p>
  
        <h2>2. Uso de la información</h2>
        <p>
          La información se utiliza exclusivamente para autenticar usuarios y
          brindar las funcionalidades del servicio.
        </p>
  
        <h2>3. Almacenamiento y seguridad</h2>
        <p>
          Los datos se almacenan de forma segura y no se comparten con terceros.
        </p>
  
        <h2>4. Contacto</h2>
        <p>
          Para consultas sobre esta política podés contactarnos desde la
          aplicación.
        </p>
      </main>
    );
  }
  