'use client';
import AccordionComponent from "@/app/ui/shared/custom/components/accordion/AccordionComponent";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.75rem' }} textAlign={'start'}>PROTECCIÓN DE DATOS</Typography>
        <Typography variant="body1" component={'p'} textAlign={'justify'}>
          CONDUPRO, S.L. (en adelante, CONDUPRO) pone a tu disposición, a través de su página web www.condupro.es, esta política de protección de datos con el objetivo de informarte de manera detallada sobre el tratamiento de tus datos personales y cómo protegemos tu privacidad y la información que nos facilitas. En caso de que se realicen modificaciones futuras en esta política, te lo comunicaremos a través de la página web u otros medios, para que puedas estar al tanto de las nuevas condiciones de privacidad establecidas.
        </Typography>
        <Typography variant="body1" component={'p'} textAlign={'justify'}>
          En cumplimiento del Reglamento (UE) 2016/679, General de Protección de Datos y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales le informamos de lo siguiente:
        </Typography>
        <AccordionComponent title="1. Responsabilidad sobre el tratamiento de tus datos." expandedDefault={false}>
          <Typography component={'p'}>
            CONDUPRO, S.L., con CIF B-12345678, ubicada en C/ Olivo nº 9 bis 1º, 06400, Don Benito (Badajoz), y con teléfonos de contacto +34 948 154 267 y +34 679 886 590, 
            así como correo electrónico info@condupro.es, ha designado de manera voluntaria y como muestra de su responsabilidad proactiva, un Delegado de Protección de Datos. 
            Esta figura tiene como función garantizar el derecho fundamental a la protección de datos personales y asegurar el cumplimiento de la normativa vigente en esta materia. 
            Para contactar con el Delegado de Protección de Datos de CONDUPRO, puedes enviar un correo electrónico a info@condupro.es, indicando en el asunto "PROTECCIÓN DE DATOS". 
            <br></br>
            <br></br>
            De acuerdo con el artículo 37.1 de la LOPDGDD, puedes dirigirte al Delegado de Protección de Datos antes de presentar una reclamación contra CONDUPRO ante la Agencia Española de Protección de Datos. El Delegado te informará de la decisión tomada respecto a tu reclamación en un plazo máximo de dos meses desde su recepción.
          </Typography>
        </AccordionComponent>
        <AccordionComponent title="2. Que información se recopila sobre usted y con que finalidad." expandedDefault={false}>
          <Typography variant="body1" paragraph>
            En CONDUPRO tratamos la información personal que nos proporciona directamente la persona usuaria.
          </Typography>

          <Typography variant="body1" paragraph>
            En general, manejamos datos identificativos (como nombre, apellidos, NIF, teléfono, dirección postal, correo electrónico, nacionalidad, dirección IP) y datos profesionales (experiencia laboral, licencias de conducir, títulos académicos o profesionales, entre otros).
          </Typography>

          <Typography variant="body1" paragraph>
            La persona usuaria garantiza que la información proporcionada es auténtica, exacta y veraz, comprometiéndose a mantener sus datos personales actualizados para que reflejen su situación real en todo momento. Será la única responsable de cualquier información falsa o inexacta, así como de los perjuicios que esto pueda ocasionar.
          </Typography>

          <Typography variant="body1" paragraph>
            Los datos personales que nos facilite son obligatorios y constituyen el mínimo necesario para gestionar las ofertas de trabajo. Estos datos podrán ser utilizados para una o varias de las siguientes finalidades, determinadas por factores como su relación con CONDUPRO o el medio utilizado para enviar la información.
          </Typography>

          {/* Sección de tratamientos de datos */}
          <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
            Tratamientos de Datos
          </Typography>
          <Grid container spacing={3}>
            {/* Acordeón para cada tratamiento */}
            <Grid size={{xs: 12}}>
              <AccordionComponent title="2.1. Cumplimiento de obligaciones legales" expandedDefault={false}>
                <Typography>
                  Puede ser necesario tratar los datos personales para cumplir con requisitos legales aplicables, como normativas en materia de protección de datos, tributaria, estadística, seguros, entre otras.
                </Typography>
              </AccordionComponent>
            </Grid>
            <Grid size={{xs: 12}}>
              <AccordionComponent title="2.2. Formalización y ejecución del contrato" expandedDefault={false}>
                <Typography>
                  Los datos personales se tratan para gestionar la relación contractual, cumplir con los términos del contrato y nuestras obligaciones fiscales, así como para controlar y ejecutar las prestaciones garantizadas en el contrato. Los datos proporcionados al crear una cuenta o perfil se utilizan para inscribirte en ofertas de empleo y comunicar tus datos a los empleadores.
                </Typography>
              </AccordionComponent>
            </Grid>
            <Grid size={{xs: 12}}>
              <AccordionComponent title="2.3. Comunicación y contacto" expandedDefault={false}>
                <Typography>
                  Te enviaremos comunicaciones, incluyendo recordatorios, confirmaciones de inscripción a ofertas, actualizaciones sobre el estado de tus candidaturas, avisos técnicos, alertas de seguridad y mensajes de soporte. También podremos informarte sobre mejoras o novedades en nuestros productos y servicios, así como ofrecerte consejos para mejorar tu currículum vitae o buscar empleo de manera eficiente. Los datos enviados por correo electrónico, aplicaciones de mensajería o reclamaciones se utilizarán para responder a las solicitudes planteadas.
                </Typography>
                </AccordionComponent>
            </Grid>
            <Grid size={{xs: 12}}>
              <AccordionComponent title="2.4. Envío de comunicaciones comerciales con consentimiento adicional" expandedDefault={false}>
                <Typography>
                  Si otorgas tu consentimiento explícito, tus datos podrán ser cedidos a entidades colaboradoras para informarte, por cualquier medio, sobre servicios, productos o eventos promocionales y publicitarios organizados o participados por CONDUPRO.
                </Typography>
              </AccordionComponent>
            </Grid>
            <Grid size={{xs: 12}}>
              <AccordionComponent title="2.5. Bolsa de empleo" expandedDefault={false}>
                <Typography>
                  Tus datos se tratarán para incluirlos en nuestra plataforma de ofertas de empleo en línea. Al inscribirte en una oferta, tus datos se almacenarán en nuestra bolsa de empleo para hacerte partícipe de ofertas que se ajusten a tu perfil. Trataremos tus datos para evaluar y gestionar tu solicitud de empleo, permitiendo que las empresas visualicen tu currículum vitae. Los datos de tu currículum solo serán visibles cuando te inscribas en una oferta publicada por una empresa. Si una empresa muestra interés en tu perfil, podrá contactarte para verificar tu interés en su oferta de empleo.
                </Typography>
              </AccordionComponent>
            </Grid>
          </Grid>
        </AccordionComponent>
        <AccordionComponent title="3. ¿Cómo obtenemos tus datos?" expandedDefault={false}>
          <Typography component={'p'}>
            Sólo conservamos tu información por el periodo de tiempo necesario para cumplir con la finalidad para la que fue recogida, dar cumplimiento a las obligaciones legales que nos vienen impuestas y atender las posibles responsabilidades que pudieran derivar del cumplimiento de la finalidad por la que los datos fueron recabados. Tus datos personales se conservarán durante la vigencia de la relación jurídica y/o contractual y, posteriormente, siempre que no hayas ejercitado su derecho de supresión, serán conservados teniendo en cuenta los plazos legales que resulten de aplicación en cada caso concreto, teniendo en cuenta la tipología de datos, así como la finalidad del tratamiento.
            <br></br>
            En caso de que ejercites un derecho de supresión y sea procedente el mismo, en cumplimiento del art. 32 LOPDGDD procederá su bloqueo, estando disponibles tan solo a solicitud de los Juzgados y Tribunales, Defensoría del Pueblo, Ministerio Fiscal o las Administraciones Públicas competentes durante el plazo de prescripción de las acciones que pudieran derivar y, transcurrido éste, se procederá a su completa eliminación.
            <br></br>
            Tratamos tus datos de manera lícita, leal, transparente, adecuada, pertinente, limitada, exacta y actualizada. Es por ello que nos comprometemos a adoptar todas las medidas razonables para que estos se supriman o rectifiquen sin dilación cuando sean inexactos.
          </Typography>  
        </AccordionComponent>
        <AccordionComponent title="4. ¿Por cuanto tiempo conservamos tus datos?" expandedDefault={false}>
          <Typography component={'p'}>
            Recabamos tu información personal a través de diferentes medios, pero siempre serás informada en el momento de la recogida mediante cláusulas informativas sobre la persona responsable del tratamiento, la finalidad, así como la forma en que puedes ejercer los derechos que te asisten en materia de protección de datos.
            <br></br>
            <br></br>
            A través de nuestra página web recabamos información personal relacionada con su navegación a través del uso de cookies. Para conocer de manera clara y precisa las cookies que utilizamos, cuáles son sus finalidades y cómo puedes configurarlas o deshabilitarlas, consulta nuestra Política de Cookies Política de Cookies
          </Typography>  
        </AccordionComponent>
        <AccordionComponent title="5. ¿Cuál es la legislación para el tratamiento de tus datos?" expandedDefault={false}>
          <Typography component={'div'}>
            Dependiendo de la relación que mantengamos y por ende de la finalidad del tratamiento, la base jurídica puede ser diferente. A continuación, te exponemos las distintas bases aplicables en función del tratamiento realizado:
            <br></br>
            <br></br>
            <ul>
              <li><strong>RELACIÓN CONTRACTUAL:</strong> Para la prestación de nuestros servicios contratada.</li>
              <li><strong>INTERÉS LEGÍTIMO:</strong> Entre otras, para la realización de perfiles, encuestas de calidad u opinión, mantenimiento de la web o la atención telefónica.</li>
              <li><strong>OBLIGACIÓN LEGAL:</strong> Para el cumplimiento de las obligaciones establecidas en cualquier otra normativa aplicable.</li>
              <li><strong>CONSENTIMIENTO</strong> Cuando nos facilita sus datos a través de los formularios de contacto de la web, incorporación a nuestra plataforma on line de empleo como conductor o para el envío de nuestra newsletter.</li>
              <li><strong>RELACIÓN CONTRACTUAL:</strong> Para la prestación de nuestros servicios contratada.</li>
            </ul>
            Debes saber que en aquellos tratamientos en se te solicite el consentimiento, su no otorgamiento o eventual retirada con posterioridad no tendrá consecuencias negativas para ti.
            En el caso de que se suministren datos de terceros, declaras contar con el consentimiento de los titulares de los mismos para la citada comunicación de datos o en su caso ostentar su representación legal, eximiendo de toda responsabilidad a CONDUPRO y al resto de sus socios.
          </Typography>  
        </AccordionComponent>
        <AccordionComponent title="6. ¿Qué tipos de datos tratamos?" expandedDefault={false}>
          <Typography component={'div'}>
            Las categorías de datos que se tratamos son
            <br></br>
            <ul>
              <li><strong>CONTACTO:</strong> Para la prestación de nuestros servicios contratada.</li>
              <li><strong>PROCESOS DE SELECCIÓN:</strong> Datos identificativos, datos de características personales, datos de circunstancias sociales, datos académicos y profesionales, datos de detalles de empleo (profesión, puesto de trabajo, datos no económicos de nómina, historial del trabajador), datos de salud o minusvalías.</li>
            </ul>
          </Typography>  
        </AccordionComponent>
        <AccordionComponent title="7. ¿Cómo protegemos su información?" expandedDefault={false}>
          <Typography component={'p'}>
            En CONDUPRO nos comprometemos a proteger tu información personal. Utilizamos medidas, controles y procedimientos de carácter físico, organizativo y tecnológico, razonablemente fiables y efectivos, orientados a preservar la integridad y la seguridad de sus datos y garantizar su privacidad.
            Además, todo el personal con acceso a los datos personales ha sido formado y tiene conocimiento de sus obligaciones con relación a los tratamientos de tus datos personales.
            Todas estas medidas de seguridad son revisadas de forma periódica para garantizar su adecuación y efectividad.
            Sin embargo, la seguridad absoluta no se puede garantizar y no existe ningún sistema de seguridad que sea impenetrable por lo que, en el caso de cualquier información objeto de tratamiento y bajo nuestro control se viese comprometida como consecuencia de una brecha de seguridad, tomaremos las medidas adecuadas para investigar el incidente, notificarlo a la Autoridad de Control y, en su caso, a aquellas personas usuarias que se hubieran podido ver afectados para que tomen las medidas adecuadas.
          </Typography>  
        </AccordionComponent>
        <AccordionComponent title="8. Actualización de la política de privacidad" expandedDefault={false}>
          <Typography component={'p'}>
            CONDUPRO se reserva el derecho de modificar su política de privacidad o condiciones de uso de sus servicios por motivos de adaptación a la legislación vigente, 
            u otros motivos, cuando esto ocurra, te avisaremos de cualquier cambio y te pediremos que vuelvas a leer la versión más reciente de nuestra política 
            y en su caso que confirmes su aceptación. Se asegura la absoluta confidencialidad y privacidad de los datos personales recogidos y 
            por ello se han adoptado medidas de seguridad a fin de evitar la alteración, pérdida, tratamiento o acceso no autorizado, y garantizar así su integridad, 
            disponibilidad y seguridad. Sin embargo, CONDUPRO no será responsable de las incidencias que puedan surgir en torno a datos personales cuando estas se deriven: 
            bien de un ataque o acceso no autorizado a los sistemas de tal forma que resulte imposible detectarlo o impedirlo aun adoptándose las medidas según el estado 
            de la tecnología actual.
          </Typography>  
        </AccordionComponent>
        <Typography component={'p'}>
          Si tiene alguna duda sobre esta Política de Cookies, puede contactar con nosotros en <a href="mailto:info@condupro.es">info@condupro.es</a>.
        </Typography>
      </Box>
    </Container>
  )
}