import { Box, Container, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.75rem' }} textAlign={'start'}>AVISO LEGAL</Typography>
        <Typography variant="body1" component={'p'} textAlign={'justify'}>
          Te damos la bienvenida a nuestro sitio web y te agradecemos tu interés por leer las condiciones legales del mismo. Somos conscientes de que este tema puede no ser tu preferido, pero es importante que conozcas toda la información relativa a los términos y condiciones legales que definen las relaciones entre las personas usuarias de nuestra web y nuestra empresa, como responsable de este sitio web. Como persona usuaria es importante que conozcas estos términos antes de continuar tu navegación.
        </Typography>
        <div>
          <Typography variant="body1" component={'p'} textAlign={'justify'}>
            En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa a los usuarios de la plataforma CONDUPRO (en adelante, "la Web") de los siguientes datos:
          </Typography>
          <ul>
            <li>Titular: CONDUPRO S.L</li>
            <li>NIF: 12345678</li>
            <li>Domicilio Social: Calle Olivo 1, Don Benito, Badajoz, España</li>
            <li>Teléfono: 924775839 </li>
            <li>Correo electrónico: <a href="mailto:info@condupro.es" style={{ fontWeight: 'bold'}}>info@condupro.es</a></li>
            <li>Datos de inscripción en el Registro Mercantil: Registro Mercantil de Badajoz, Tomo 1234, Folio 123, Hoja 12345</li>
          </ul>
        </div>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            1. Objeto de la Web
          </Typography>
          <Typography component={'p'}>
            La Web tiene como finalidad proporcionar una plataforma en la que conductores profesionales y empresas del sector puedan ponerse en contacto mediante ofertas de trabajo publicadas por las empresas. Las empresas pueden adquirir packs de publicación de ofertas, cuyo importe solo se podrá devolver en caso de no hacer uso del pack en un plazo de 14 días tras el pago.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            2. Condiciones de Uso
          </Typography>
          <Typography component={'p'}>
            El acceso y uso de la Web atribuye la condición de usuario, implicando la aceptación plena de las presentes condiciones. El usuario se compromete a utilizar la Web de conformidad con la ley, la moral, el orden público y las presentes condiciones de uso.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            3. Propiedad Intelectual e Industrial
          </Typography>
          <Typography component={'p'}>
            Todos los contenidos de la Web (textos, imágenes, marcas, logotipos, botones, archivos de software, combinaciones de colores, así como la estructura, selección, ordenación y presentación de sus contenidos) se encuentran protegidos por la legislación vigente en Propiedad Intelectual e Industrial, quedando expresamente prohibida su reproducción, distribución o comunicación pública sin la autorización del titular.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            4. Exclusión de Responsabilidad
          </Typography>
          <Typography component={'p'}>
            CONDUPRO S.L. no se responsabiliza del mal uso que se realice de los contenidos de la Web, siendo exclusiva responsabilidad del usuario que acceda a ellos o los utilice. Asimismo, no se garantiza la disponibilidad y continuidad del funcionamiento de la Web.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            5. Legislación Aplicable
          </Typography>
          <Typography component={'p'}>
            El presente Aviso Legal se rige en todos y cada uno de sus extremos por la legislación española.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            6. Modificaciones
          </Typography>
          <Typography component={'p'}>
            CONDUPRO S.L. se reserva el derecho de modificar el contenido del Aviso Legal en cualquier momento, sin necesidad de previo aviso. Se recomienda al usuario revisar periódicamente el Aviso Legal.
          </Typography>
        </Box>
        <Typography component={'p'}>
          Si tiene alguna duda sobre este Aviso Legal, puede contactar con nosotros en <a href="mailto:info@condupro.es">info@condupro.es</a>.
        </Typography>
      </Box>
    </Container>
  )
}