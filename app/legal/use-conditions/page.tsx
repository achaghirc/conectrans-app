'use client';
import AccordionComponent from "@/app/ui/shared/custom/components/accordion/AccordionComponent";
import SubscriptionCard from "@/app/ui/shared/custom/components/subscription/SubscriptionCard";
import { getAllPlans } from "@/lib/data/plan";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PlanDTO } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['plans'], 
    queryFn: (): Promise<PlanDTO[] | undefined> => getAllPlans(),
  });


  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Condiciones de uso</Typography>
        <Typography component={'p'}>
          Las presentes Condiciones de Uso regulan el acceso y el uso por parte de los Candidatos Profesionales del sector logístico y del transporte (en adelante Candidatos) y de las Empresas a los servicios de nuestra plataforma de empleo on line. La finalidad de CONDUPRO es la de proporcionar una plataforma que permite el encuentro entre Empresas y Candidatos en un entorno online, para que generen nuevos puestos de trabajo y contacten, aumenten y mejoren sus relaciones profesionales en el sector logístico y del transporte por carretera. En este sentido, a través de la página <a href="www.condupro.es">www.condupro.es</a>, CONDUPRO tiene como objeto facilitar al Candidato que pueda acceder a ofertas de empleo y a las Empresas que puedan acceder al perfiles de los Profesionales registrados en CONDUPRO.
          <br></br>
          CONDUPRO se encuentra en continua evolución y desarrollo de nuevas herramientas que aporten valor a los usuarios registrados en CONDUPRO. El uso de nuestra Plataforma implica la plena aceptación por parte de los Usuarios Registrados de las disposiciones incluidas en nuestras Condiciones Legales en la versión publicada por CONDUPRO en el momento en que éstos acceden al Sitio Web así como las características y reglas de uso del mismo. Por ello, CONDUPRO recomienda leer periódicamente las presentes Condiciones Legales
        </Typography>
        <AccordionComponent title="1. CONDICIONES DE USO PARA PROFESIONALES" expandedDefault>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography component={'p'}>
                Las reglas de uso que aquí describimos se aplican a los profesionales que estáis registrados en CONDUPRO y buscáis empleo a través de nuestra plataforma. Antes de haberte registrado por completo, como usuario tienes que estar de acuerdo con estas condiciones de uso. ¡Échales un vistazo antes de poner en marcha tu búsqueda de empleo!
              </Typography>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <strong>1.1. Veracidad de la información</strong>
                <Typography component={'p'}>
                  La información que incorpores y suministres en el formulario de creación de tu cuenta tiene que ser verídica. Para CONDUPRO resulta complicado controlar todos los datos que se publican, así que no podemos asumir la responsabilidad de todos estos contenidos. De todas maneras, revisamos las ofertas y los datos periódicamente para asegurarnos de que estas reglas de uso se cumplen.
                  <br></br>No obstante, si ves que algún contenido de CONDUPRO es inapropiado o no cumple con estas reglas, te pediremos que contactes con nosotros a través de la cuenta de correo electrónico <a href="mailto:info@condupro.es)">info@condupro.es.</a>  Las fotografías que te solicitamos sirven para identificarte claramente con respecto al resto de usuarios de la web y para mejorar tu perfil si bien no es obligatoria su aportación. 
                  <br></br>Desde CONDUPRO te recomendamos insertar fotos personales de calidad. Y dado que no podemos revisarlas todas, no asumimos la responsabilidad de los contenidos ni confirmamos la propiedad de los derechos de autor de las imágenes que se suben. De este modo, es tu responsabilidad tener los derechos y permisos necesarios para publicarlas.
                  No obstante, y para asegurar el nivel de calidad, en CONDUPRO nos reservamos el derecho de revisar y eliminar las fotos que no consideremos oportunas o que otros usuarios hayan denunciado. Tampoco están permitidos los contenidos ofensivos, eróticos, sexuales o de mal gusto que bajo nuestro criterio no cumplan con la función curricular, así que una vez detectados, los eliminaremos.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <strong>1.2. Buen uso de la plataforma</strong>
              <Typography component={'p'}>
                En primer lugar, si eres candidato a una de las ofertas de trabajo que publican las empresas registradas en nuestra plataforma, debes tener claro que CONDUPRO no interviene en los procesos de selección, únicamente pone en contacto a profesionales que buscan trabajo con empresas que tienen vacantes disponibles. 
                <br></br>Cuando te inscribas en ofertas o utilices otros servicios de CONDUPRO, emplea un lenguaje apropiado y no faltes al respeto de los demás.
                CONDUPRO condiciona la utilización de la mayoría de sus servicios a la previa creación de una cuenta. El Usuario debe seleccionar el identificador (ID o login) y la contraseña, información que se compromete a conservar y a usar con la diligencia debida.
                El uso de la contraseña es personal e intransferible, no estando permitida la cesión, ni siquiera temporal, a terceros. En tal sentido, el Candidato deberá adoptar las medidas necesarias para la custodia de la contraseña por él seleccionada, evitando el uso de la misma por terceros. En consecuencia, el Candidato es el único responsable de la utilización que, de su contraseña se realice, con completa indemnidad para CONDUPRO.
                <br></br><br></br>En el supuesto de que el Candidato conozca o sospeche del uso de su contraseña por terceros, deberá poner tal circunstancia en conocimiento de CONDUPRO con la mayor brevedad. El citado registro se efectuará en la forma expresamente indicada en el propio servicio.
                Protege tu contraseña. Si otras personas hicieran un mal uso de CONDUPRO a través de tu cuenta, correrás el riesgo de perder el acceso al servicio. Acuérdate de no usar nunca la misma palabra de usuario como contraseña.
                Toda la información que facilite el Candidato a través de los servicios deberá ser veraz. A estos efectos, el Candidato garantiza la autenticidad y veracidad de todos aquellos datos que comunique como consecuencia de la cumplimentación de los formularios existentes en la plataforma.
                Asimismo, el Candidato garantiza que es mayor de 18 años y que, en relación con los servicios de mensajería instantánea como WhatsApp, es el titular, abonado o usuario de los números móviles declarados y se hace responsable de comunicar a CONDUPRO cualquier cambio de situación sobre los mismos.
                <br></br><br></br>El Candidato se obliga a respetar las leyes aplicables y los derechos de terceros al utilizar los contenidos y servicios del Sitio Web. Queda prohibida la reproducción, distribución, transmisión, adaptación o modificación, por cualquier medio y en cualquier forma, de los contenidos del Sitio Web, salvo autorización previa de sus legítimos titulares o cuando así resulte permitido por la ley.
                De modo ilustrativo y no limitativo, está prohibido: utilizar contenidos injuriosos o calumniosos, emplear contenidos pornográficos, molestar a otros Candidatos, utilizar contenidos protegidos sin derecho a ello o fomentar acciones contrarias a la libre competencia.
                Asimismo, se prohíbe expresamente al Candidato: utilizar mecanismos o software que pongan en riesgo la seguridad de CONDUPRO, realizar ataques de hacking, divulgar información protegida por ley o intentar utilizar la cuenta de otra persona sin autorización.
                El Candidato que incumpla cualquiera de estas obligaciones responderá de todos los daños y perjuicios que cause, lo que puede implicar el bloqueo del servicio de CONDUPRO.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <strong>1.3. Responsabilidades de CONDUPRO y los candidatos</strong>
              <Typography component={'p'}>
                Desde CONDUPRO nos reservamos el derecho de bloquear aquellas cuentas que se estén inscribiendo en ofertas de manera masiva respecto a comportamientos estándar de otros usuarios. La interpretación de estas reglas de uso es competencia exclusiva de CONDUPRO y pueden modificarse en cualquier momento, sin necesidad de avisar o notificar a los usuarios. En caso de violar cualquiera de las condiciones que aquí hemos descrito, el registro de estos candidatos podrá ser retirado de nuestra plataforma.
                <br></br>Como usuario asumirás exclusivamente la responsabilidad de haber proporcionado información o realizado actividades en contra de la legalidad vigente, así como todos los perjuicios y consecuencias derivadas, eximiendo de cualquier responsabilidad a CONDUPRO.
                <br></br><br></br>
                Para informarte sobre cómo usar CONDUPRO, contacta con nosotros a través de la cuenta de correo electrónico info@condupro.es
                <br></br><br></br>
                Asimismo, los comentarios, opiniones, informaciones y manifestaciones realizadas como usuario de CONDUPRO, son de exclusiva responsabilidad del mismo, excluyendo la responsabilidad de CONDUPRO sobre el contenido del mismo.
                CONDUPRO no supervisa los comentarios, opiniones, informaciones y manifestaciones introducidos por los usuarios. No obstante, en el caso de que un usuario considere que algún comentario infringe las presentes condiciones de uso, podrá notificarlo a CONDUPRO (indicando su motivo) e CONDUPRO revisará y tomará las medidas oportunas.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <strong>1.4. Servicios de CONDUPRO para Candidatos</strong>
              <Typography component={'div'}>
                Se enumeran los servicios que CONDUPRO presta al Candidato:
                <ul>
                  <li>Inscripción del Candidato de forma gratuita en la Plataforma de CONDUPRO a través del proceso de creación de una cuenta.</li>
                  <li>Inscripción del Candidato en los servicios ofertados por CONDUPRO a fin de inscribirse en ofertas publicadas.</li>
                  <li>Servicios y herramientas para la gestión de la búsqueda de empleo a través de la plataforma CONDUPRO.</li>
                  <li>Servicio de alertas: serás alertado por correo electrónico de todo cambio en el estado de las ofertas en las que te hayas inscrito.</li>
                  <li>Recepción automática y gratuita de ofertas por vía electrónica. CONDUPRO ofrece la posibilidad de conocer a través de comunicaciones electrónicas las ofertas de empleo que más se adecuan al Candidato. Para ello, el Candidato debe crear Alertas dentro de su perfil estableciendo los criterios de su interés.</li>
                  <li>Otros servicios que CONDUPRO pueda crear y que considera de interés para los Candidatos como consejos, formación, red de contactos profesionales, espacios de diálogos, acceso a noticias, entre otros.</li>
                </ul>
              </Typography>
            </Box>
          </Box> 
        </AccordionComponent>
        <AccordionComponent title="2. CONDICIONES DE USO PARA EMPRESAS" expandedDefault={false}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <strong>2.1. Publicación de ofertas de empleo</strong>
              <Typography component={'p'}>
                Una oferta de empleo se caracteriza por ofrecer a los candidatos un empleo con un puesto vacante definido e inequívoco, con un ámbito geográfico, una experiencia requerida, el tipo de contrato que se ofrece, el salario bruto y aspectos adicionales a valorar. Por ello, en el momento de insertar una oferta de empleo es importante definir con cuidado el puesto vacante, provincia y categoría y resto de parámetros indicados por nuestra plataforma, porque son los que definirán la oferta a lo largo de su vigencia en CONDUPRO y no serán modificables posteriormente.
                Las ofertas estarán publicadas en la web durante el tiempo de publicación descrito en el cuadro. En este tiempo, se podrá desactivar en cualquier momento, pero una vez desactivada no podrá volver a activarse.
                Las ofertas pueden ser adquiridas en forma de packs adaptándose a la necesidad en volumen de contratación de personal y suponen un ahorro para la empresa.
              </Typography>
            </Box>
            <Box sx={{ p: 2}}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>Posibles Packs</Typography>
              <Grid container spacing={2} justifyContent="center">
                {plans && (
                  plans.map((plan: PlanDTO, index: number) => (
                    <Grid size={{xs: 12, sm: 6, md: 3}} key={index} sx={{ pointerEvents: 'none' }}>
                      <SubscriptionCard selected={false} plan={plan}  />
                    </Grid>
                  ))
                )}
              </Grid>
              <Typography component={'p'} sx={{ textAlign: 'justify',  mt: 2 }}>
                Si quieres obtener información adicional sobre cómo usar CONDUPRO, contacta con nosotros a través de la cuenta de correo electrónico info@condupro.es
                Las reglas de uso que aquí te presentamos hacen referencia a las ofertas que se publican en el portal y al uso que haces del servicio como empresa. Así, antes de registrarte en la página será necesario que aceptes estas reglas de uso. 
                <br></br> <br></br>¡Si te has enterado, vamos al lío!
              </Typography>
              
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <strong>2.2. Veracidad de la información</strong>
                <Typography component={'p'}>
                  Uno de los requisitos fundamentales a la hora de publicar una oferta es la veracidad. Todos los datos que incluyas tienen que ser reales y ajustarse a la legalidad 
                  vigente. Para CONDUPRO resulta complicado controlar todas y cada una de las ofertas que se publican, pero debes saber que antes de publicarlas las revisamos para 
                  asegurarnos de que estas reglas de uso se están cumpliendo con garantías, cuando la oferta sea verificada (menos de 24 horas en días laborables) aparecerá 
                  publicada en CONDUPRO y recibirás un correo electrónico confirmando su publicación.
                </Typography>
              </Box>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <strong>2.2. Legalidad de las ofertas de trabajo</strong>
                <Typography component={'p'}>
                  Las ofertas de trabajo publicadas en CONDUPRO tienen que ser totalmente legales. No aceptamos ninguna oferta que discrimine a las personas por razón de raza, 
                  sexo, religión, opinión, nacionalidad, discapacidad o cualquier otra circunstancia personal o social. Tampoco serán admitidas aquellas ofertas que soliciten 
                  al candidato realizar algún tipo de pago, que estén promocionadas por empresas piramidales, que sean negocios o que estén relacionadas con la industria del 
                  entretenimiento para adultos o el ocio nocturno.
                </Typography>
              </Box>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <strong>2.2. Obligación de la Empresa</strong>
                <Typography component={'p'}>
                  La Empresa se compromete a hacer un uso diligente de nuestra plataforma y de los servicios accesibles desde el mismo, con total sujeción a la Ley, a las buenas costumbres y las presentes Condiciones Legales y, en su caso, condiciones particulares, así como mantener el debido respeto a las demás Empresas y candidatos.
                </Typography>
                <Typography component={'p'}>
                  La Empresa y su personal con acceso a CONDUPRO, deberán guardar el debido secreto sobre toda aquella información que se incluya en CONDUPRO, en especial, a la información de los candidatos.
                </Typography>
                <Typography component={'p'}>
                  La Empresa debe seleccionar el identificador (ID o login) y la contraseña, información que se compromete a conservar y a usar con la diligencia debida. El uso de la contraseña es personal e intransferible, no estando permitida la cesión, ni siquiera temporal, a terceros. En tal sentido, la Empresa deberá adoptar las medidas necesarias para la custodia de la contraseña por él seleccionada, evitando el uso de la misma por terceros. En consecuencia, la Empresa es la única responsable de la utilización que, de su contraseña se realice, con completa indemnidad para CONDUPRO.
                </Typography>
                <Typography component={'p'}>
                  El uso de la contraseña es personal e intransferible, no estando permitida la cesión, ni siquiera temporal, a terceros. En tal sentido, la Empresa deberá adoptar las medidas necesarias para la custodia de la contraseña seleccionada, evitando el uso de la misma por terceros. En consecuencia, la Empresa es la única responsable de la utilización que, de su contraseña se realice, con completa indemnidad para CONDUPRO. En el supuesto de que la Empresa conozca o sospeche del uso de su contraseña por terceros deberá poner tal circunstancia en conocimiento de CONDUPRO con la mayor brevedad. El citado registro se efectuará en la forma expresamente indicada en el propio servicio.
                </Typography>
                <Typography component={'p'}>
                  Toda la información que facilite la Empresa a través de los servicios deberá ser veraz. A estos efectos, la Empresa garantiza la autenticidad y veracidad de todos aquellos datos que comunique como consecuencia de la cumplimentación de los formularios necesarios para la suscripción de los Servicios.
                </Typography>
                <Typography component={'p'}>
                  De igual forma, será responsabilidad de la Empresa mantener toda la información facilitada a CONDUPRO permanentemente actualizada de forma que responda, en cada momento a la situación real de la Empresa. En todo caso, la Empresa será la única responsable de las manifestaciones falsas o inexactas que realice y de los perjuicios que cause a CONDUPRO o a terceros por la información que facilite eximiendo a CONDUPRO de toda responsabilidad en este sentido.
                </Typography>
                <Typography component={'p'}>
                  La Empresa se obliga a respetar las leyes aplicables y los derechos de terceros al utilizar los contenidos y servicios del Sitio Web. Asimismo, queda prohibida la reproducción, distribución, transmisión, adaptación o modificación, por cualquier medio y en cualquier forma, de los contenidos del Sitio Web (textos, diseños, gráficos, informaciones, bases de datos, archivos de sonido y/o imagen, logos, etc.) y demás elementos de este Sitio Web, salvo autorización previa de sus legítimos titulares o cuando así resulte permitido por la ley.
                </Typography>
                <Typography component={'p'}>
                  De modo ilustrativo y no limitativo, está prohibido: utilizar contenidos injuriosos o calumniosos, con independencia de que esos contenidos afecten a otros 
                  candidatos o Empresas o, utilizar contenidos pornográficos o que vulneren las leyes de protección de menores, o hacer publicidad, ofrecer o distribuir productos 
                  pornográficos o que vulneren las leyes de protección de menores, molestar a otros candidatos o Empresas (especialmente mediante spam), utilizar contenidos protegidos 
                  legalmente (p. ej. por la legislación relativa a la propiedad intelectual, a marcas, a patentes, a modelos de utilidad o a modelos estéticos) sin tener derecho a ello,
                  o hacer publicidad, ofrecer o distribuir bienes o servicios protegidos legalmente, así como realizar o fomentar 
                  acciones contrarias a la libre competencia, incluidas las encaminadas a la captación de clientes progresiva (como sistemas en cadena, de bola de nieve o piramidales).
                </Typography>
                <Typography component={'p'}>
                  Las ideas que sean publicadas y la información que comparta con el resto de Empresas y candidatos en las ofertas publicadas pueden ser vistas y usadas por otros, 
                  y CONDUPRO no puede garantizar que esos otros no utilicen las ideas e información que comparta la Empresa en CONDUPRO. Por lo tanto, si la Empresa tiene una idea o 
                  información que desea sea confidencial o no quiere que sea utilizada por otras personas, o si está sujeta a derechos de terceros que podrían ser infringidos si la 
                  compartiera, no debe publicarla en ninguna otra parte del sitio de CONDUPRO.
                </Typography>
                <Typography component={'p'}>
                  Así pues, cuando la Empresa envía ideas, sugerencias, documentos o cualquier otra propuesta o contribución a CONDUPRO a través de los medios que ponemos a su disposición, reconoce y acepta que:
                </Typography>
                <ul>
                  <li>Dicho contenido no se puede considerar información confidencial ni es propiedad de terceros</li>
                  <li>Que CONDUPRO no posee ninguna obligación de confidencialidad, expresa o implícita, en relación con dicho contenido</li>
                  <li>CONDUPRO se reserva el derecho a usar o revelar (o no, en función de sus necesidades) todo el contenido aportado para cualquier finalidad lícita que el portal considere, de cualquier modo y en cualquier medio.</li>
                  <li>Cede de manera expresa e irrevocable a CONDUPRO todos tus derechos relativos a las publicaciones.</li>
                  <li>Renuncia de formar expresa a reclamar cualquier indemnización o reembolso de ningún tipo a CONDUPRO por este concepto.</li>
                </ul>
              </Box>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <strong>2.5. Servicios de CONDUPRO para Empresas</strong>
                <ul>
                  <li>Inserción de ofertas de empleo en nuestra plataforma.</li>
                  <li>Recepción de los conductores inscritos en las ofertas realizadas.</li>
                  <li>Servicio de Alertas. Recepción automática y gratuita de ofertas por vía electrónica. CONDUPRO ofrece la posibilidad de conocer a través de comunicaciones electrónicas de forma rápida, personal y gratuita, los CV de Candidatos que se han inscrito en las ofertas que ha publicado la Empresa.</li>
                  {/* <li>Servicio de comunicaciones electrónicas: Servicios de comunicaciones electrónicas y comerciales por vía electrónica o telefónica.</li> */}
                </ul>
              </Box>
            </Box>
          </Box>
        </AccordionComponent>
      </Box>
    </Container>
  )

}