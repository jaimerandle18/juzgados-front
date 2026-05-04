export default function TerminosPage() {
  return (
    <main className="pt-10 pb-20 px-6 max-w-3xl mx-auto text-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Términos y Condiciones
        </h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        <p className="text-sm text-gray-500 mt-3">Última actualización: 11 de mayo de 2025</p>
      </div>

      <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-8 space-y-8 text-[15px] leading-relaxed">

        <p>
          Los presentes Términos y Condiciones (en adelante, los &quot;Términos&quot;) regulan el acceso y uso de la aplicación móvil DATA JURY (en adelante, la &quot;Aplicación&quot; o &quot;Data Jury&quot;), desarrollada y operada por el Dr. Santiago Vedoya, en conjunto con Gobierno Abierto Asociación Civil y FORES (Foro de Estudios sobre la Administración de Justicia) (en adelante, los &quot;Responsables&quot;).
        </p>
        <p>
          Al registrarse, acceder o utilizar la Aplicación, el usuario (en adelante, el &quot;Usuario&quot;) acepta quedar obligado por estos Términos, la Política de Privacidad y toda normativa vigente aplicable. Si no está de acuerdo con estos Términos, deberá abstenerse de utilizar la Aplicación.
        </p>

        <Section title="1. DEFINICIONES">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Usuario:</strong> Abogado matriculado en el Colegio Público de Abogados de la Capital Federal (CPACF) que se registra y utiliza la Aplicación.</li>
            <li><strong>Evaluación:</strong> Calificación y opinión que el Usuario realiza sobre un juzgado mediante las preguntas estructuradas proporcionadas por la Aplicación.</li>
            <li><strong>Datos Personales:</strong> Información que permite identificar directa o indirectamente a una persona física, conforme lo establecido por la Ley 25.326.</li>
          </ul>
        </Section>

        <Section title="2. OBJETO Y ALCANCE DE LA APLICACIÓN">
          <p>
            Data Jury es una plataforma digital diseñada para mejorar la transparencia y el acceso a información sobre el funcionamiento del sistema judicial argentino. La Aplicación permite a los abogados matriculados en el CPACF acceder a diversas funcionalidades, que incluyen actualmente, de manera enunciativa y no taxativa:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Evaluar y calificar el funcionamiento de juzgados federales y nacionales mediante encuestas estructuradas.</li>
            <li>Consultar la Guía Judicial completa de la Justicia Federal y Nacional.</li>
            <li>Planificar recorridos eficientes entre múltiples juzgados y agregar notas personales para cada visita.</li>
          </ul>
          <p className="mt-3">
            Los Responsables se reservan el derecho de incorporar nuevas funcionalidades, modificar las existentes o discontinuar servicios en cualquier momento, notificando a los Usuarios cuando dichas modificaciones sean sustanciales. El uso continuado de la Aplicación tras la incorporación de nuevas funcionalidades implica la aceptación de las mismas.
          </p>
        </Section>

        <Section title="3. REQUISITOS DE REGISTRO Y VERIFICACIÓN">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Requisito de matrícula.</strong> El acceso a Data Jury está reservado exclusivamente a abogados matriculados en el CPACF. Al registrarse, el Usuario declara bajo juramento que posee matrícula vigente.</li>
            <li><strong>Proceso de verificación.</strong> La Aplicación verificará la información proporcionada por el Usuario mediante consulta automática al sistema de consulta pública del CPACF. Esta consulta se realiza exclusivamente para validar la existencia de la matrícula profesional declarada y no implica recopilación, almacenamiento ni uso posterior de datos adicionales del CPACF.</li>
            <li><strong>Veracidad de la información.</strong> El Usuario se compromete a proporcionar información veraz, exacta y actualizada. Los Responsables se reservan el derecho de suspender o cancelar cuentas que presenten información falsa, inexacta o fraudulenta.</li>
          </ul>
        </Section>

        <Section title="4. RECOPILACIÓN Y USO DE DATOS PERSONALES">
          <h4 className="font-bold text-gray-800 mb-2">4.1. Datos que se recopilan</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Datos de registro:</strong> Nombre y apellido, dirección de correo electrónico, Tomo y Folio de matrícula del CPACF.</li>
            <li><strong>Datos de evaluación:</strong> Calificaciones, opiniones y respuestas a encuestas sobre juzgados.</li>
            <li><strong>Datos de uso:</strong> Información técnica sobre el uso de la Aplicación, incluyendo fecha y hora de acceso, funcionalidades utilizadas y datos de geolocalización cuando el Usuario active la función de recorrido.</li>
          </ul>

          <h4 className="font-bold text-gray-800 mb-2 mt-4">4.2. Finalidad del tratamiento</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verificar la identidad del Usuario y su habilitación profesional.</li>
            <li>Permitir el acceso a las funcionalidades de la Aplicación.</li>
            <li>Gestionar y procesar las evaluaciones realizadas por el Usuario.</li>
            <li>Elaborar estadísticas, reportes y análisis agregados sobre el funcionamiento del sistema judicial.</li>
            <li>Comunicar novedades, actualizaciones y mejoras de la Aplicación.</li>
            <li>Cumplir con obligaciones legales y requerimientos de autoridades competentes.</li>
          </ul>

          <h4 className="font-bold text-gray-800 mb-2 mt-4">4.3. Base legal del tratamiento</h4>
          <p>
            El tratamiento de datos personales se fundamenta en el consentimiento libre, expreso e informado del Usuario al aceptar estos Términos y registrarse en la Aplicación, conforme lo dispuesto por la Ley 25.326 de Protección de Datos Personales.
          </p>
        </Section>

        <Section title="5. PROTECCIÓN Y SEGURIDAD DE DATOS">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Medidas de seguridad.</strong> Los Responsables implementan medidas técnicas y organizativas razonables para proteger los datos personales contra acceso no autorizado, pérdida, alteración o divulgación.</li>
            <li><strong>Confidencialidad de evaluaciones individuales.</strong> Las evaluaciones realizadas por cada Usuario son confidenciales. La identidad del Usuario que realiza una evaluación no será divulgada públicamente ni asociada a sus calificaciones en los resultados agregados.</li>
            <li><strong>Datos agregados y anonimizados.</strong> Data Jury podrá publicar, compartir o comercializar datos agregados y anonimizados (promedios, tendencias, estadísticas) que no permitan identificar a usuarios individuales.</li>
          </ul>
        </Section>

        <Section title="6. DERECHOS DEL USUARIO">
          <p className="mb-3">En cumplimiento de la Ley 25.326, el Usuario tiene derecho a:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Acceso:</strong> Solicitar información sobre qué datos personales suyos se encuentran almacenados.</li>
            <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o desactualizados.</li>
            <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos personales, salvo que exista obligación legal de conservarlos.</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para finalidades específicas.</li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, el Usuario debe enviar una solicitud a: <strong>datajury.juznac@gmail.com</strong>
          </p>
        </Section>

        <Section title="7. USO DE LA APLICACIÓN Y OBLIGACIONES DEL USUARIO">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Un voto por juzgado.</strong> Cada Usuario podrá evaluar cada juzgado una sola vez. Una vez emitida la evaluación, esta no podrá modificarse.</li>
            <li><strong>Uso responsable.</strong> El Usuario se compromete a utilizar la Aplicación de buena fe, proporcionando evaluaciones honestas basadas en su experiencia profesional directa. Queda prohibido:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Crear cuentas falsas o utilizar identidades ajenas.</li>
                <li>Realizar evaluaciones fraudulentas, maliciosas o sin fundamento real.</li>
                <li>Utilizar la Aplicación para difamar, injuriar o realizar manifestaciones discriminatorias.</li>
                <li>Intentar vulnerar la seguridad, realizar ingeniería inversa o modificar el código de la Aplicación.</li>
              </ul>
            </li>
            <li><strong>Consecuencias del incumplimiento.</strong> El incumplimiento de estas obligaciones podrá resultar en la suspensión o cancelación inmediata de la cuenta del Usuario, sin perjuicio de las acciones legales que pudieran corresponder.</li>
          </ul>
        </Section>

        <Section title="8. PROPIEDAD INTELECTUAL">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Titularidad.</strong> Todos los contenidos, diseños, logotipos, código fuente, bases de datos y demás elementos que componen la Aplicación son de propiedad exclusiva de los Responsables o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad intelectual vigentes.</li>
            <li><strong>Licencia de uso.</strong> Los Responsables otorgan al Usuario una licencia personal, no exclusiva, intransferible y revocable para utilizar la Aplicación conforme a estos Términos. Esta licencia no implica cesión de derechos de propiedad intelectual.</li>
          </ul>
        </Section>

        <Section title="9. TRANSFERENCIA DE DATOS EN CASO DE REORGANIZACIÓN EMPRESARIAL">
          <p className="mb-3">
            En caso de venta, fusión, adquisición, reorganización societaria o transferencia sustancial de activos de los Responsables, los datos personales de los Usuarios podrán ser transferidos al adquirente o entidad resultante, siempre que se cumplan las siguientes condiciones:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Notificación previa.</strong> Los Usuarios serán notificados con al menos 30 días de anticipación mediante correo electrónico y/o publicación destacada en la Aplicación.</li>
            <li><strong>Compromiso del adquirente.</strong> El adquirente o entidad resultante deberá comprometerse a respetar la presente Política de Privacidad y los derechos de los Usuarios conforme a la legislación vigente.</li>
            <li><strong>Derecho de oposición.</strong> Los Usuarios tendrán derecho a solicitar la eliminación de sus datos personales antes de la transferencia. En tal caso, sus datos no serán transferidos y su cuenta será cancelada.</li>
          </ul>
          <p className="mt-3">
            Esta cláusula no se aplica a datos agregados y anonimizados, que podrán ser transferidos libremente por constituir información estadística que no permite la identificación individual de usuarios.
          </p>
        </Section>

        <Section title="10. LIMITACIÓN DE RESPONSABILIDAD">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Naturaleza de las evaluaciones.</strong> Las calificaciones y opiniones publicadas en Data Jury son percepciones subjetivas de los Usuarios basadas en sus experiencias individuales. Los Responsables no garantizan la exactitud, veracidad o representatividad de dichas evaluaciones.</li>
            <li><strong>Uso de la información.</strong> La información proporcionada por la Aplicación tiene carácter informativo y no constituye asesoramiento jurídico. Las decisiones que el Usuario tome basándose en dicha información son de su exclusiva responsabilidad.</li>
            <li><strong>Disponibilidad.</strong> Los Responsables no garantizan la disponibilidad ininterrumpida de la Aplicación y no serán responsables por interrupciones, errores técnicos, fallas del sistema o cualquier circunstancia fuera de su control razonable.</li>
            <li><strong>Exclusión de daños indirectos.</strong> En ningún caso los Responsables serán responsables por daños indirectos, lucro cesante, pérdida de datos o cualquier otro perjuicio derivado del uso o imposibilidad de uso de la Aplicación.</li>
          </ul>
        </Section>

        <Section title="11. MODIFICACIONES A LOS TÉRMINOS">
          <p>
            Los Responsables se reservan el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigencia a partir de su publicación en la Aplicación. El uso continuado de la Aplicación después de la publicación de cambios implica la aceptación de los nuevos Términos. En caso de modificaciones sustanciales que afecten el tratamiento de datos personales, se notificará a los Usuarios con al menos 10 días de anticipación.
          </p>
        </Section>

        <Section title="12. TERMINACIÓN">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Por el Usuario.</strong> El Usuario podrá cancelar su cuenta en cualquier momento mediante la funcionalidad habilitada en la Aplicación o solicitándolo por correo electrónico.</li>
            <li><strong>Por los Responsables.</strong> Los Responsables podrán suspender o cancelar cuentas que incumplan estos Términos, sin necesidad de preaviso ni justificación adicional.</li>
            <li><strong>Conservación de datos.</strong> Tras la cancelación de la cuenta, los datos personales del Usuario serán eliminados dentro de los 30 días, salvo que exista obligación legal de conservarlos. Las evaluaciones ya realizadas permanecerán en forma agregada y anonimizada.</li>
          </ul>
        </Section>

        <Section title="13. JURISDICCIÓN Y LEY APLICABLE">
          <p>
            Estos Términos se rigen por las leyes de la República Argentina. Para cualquier controversia derivada de la interpretación, cumplimiento o ejecución de estos Términos, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponderles.
          </p>
        </Section>

        <Section title="14. DATOS DE CONTACTO">
          <p>
            Para consultas, reclamos o ejercicio de derechos relacionados con estos Términos o con el tratamiento de datos personales, el Usuario puede contactar a los Responsables mediante: <strong>datajury.juznac@gmail.com</strong>
          </p>
        </Section>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            Al registrarse en Data Jury, el Usuario declara haber leído, comprendido y aceptado la totalidad de estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      {children}
    </section>
  );
}
