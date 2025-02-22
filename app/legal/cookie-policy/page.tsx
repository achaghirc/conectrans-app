import { Box, Container, Typography } from "@mui/material";

export default async function Page() {
  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.75rem' }} textAlign={'start'}>POLÍTICA DE COOKIES</Typography>
        <Typography variant="body1" component={'p'} textAlign={'justify'}>
          En CONDUPRO, S.L. (en adelante CONDUPRO) utilizamos las cookies u otros archivos de funcionalidad similar (en adelante, “cookies”) para prestarle un mejor servicio y 
          proporcionarle una mejor experiencia de navegación. CONDUPRO es responsable de las cookies, propias o de terceros y del tratamiento de los datos obtenidos a través de estas, 
          decidiendo sobre la finalidad, contenido y uso del tratamiento de la información recabada.
        </Typography>
        <Typography variant="body1" component={'p'} textAlign={'justify'}>
          El objetivo de esta política es informarle de manera clara y detallada de qué es una cookie, cuál es su finalidad, qué tipo de cookies utilizamos y qué supone aceptarlas o rechazarlas.
          La aceptación de la presente Política implica que el usuario ha sido informado de forma clara y completa sobre el uso de dispositivos de almacenamiento y recuperación de datos (cookies) así como que CONDUPRO dispone del consentimiento del usuario para el uso de las mismas en los términos del artículo 22 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE).
          En cumplimiento con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD) y la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, CONDUPRO S.L. informa sobre el uso de cookies en su plataforma (en adelante, “CONDUPRO”).
        </Typography>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            1. ¿Qué son las Cookies?
          </Typography>
          <Typography component={'p'}>
            Las cookies son pequeños archivos de datos que se almacenan en el dispositivo del usuario al visitar una página web. Se utilizan para recordar sus preferencias y mejorar su experiencia de navegación. Las cookies pueden ser de varios tipos, dependiendo de la finalidad para la que se utilicen.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            2. Tipo de Cookies Utilizadas
          </Typography>
          <Typography component={'p'}>
            En CONDUPRO de CONDUPRO S.L. solo se utilizan cookies de sesión y de stripe (nuestro proveedor de pasarela de pago segura). Las cookies de sesión son aquellas 
            que se eliminan automáticamente cuando el usuario cierra el navegador, mientras que las cookies de stripe son necesarias para el funcionamiento de la pasarela de pago.
            Estas cookies son estrictamente necesarias para el funcionamiento de la plataforma y no recopilan información personal.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            3. Finalidad de las Cookies
          </Typography>
          <Typography component={'p'}>
            Las cookies de sesión utilizadas en CONDUPRO permiten el correcto funcionamiento de la plataforma, así como mantener las sesiones de usuario activas durante la navegación.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            4. Consentimiento del Usuario
          </Typography>
          <Typography component={'p'}>
            Al acceder a CONDUPRO, el usuario es informado del uso de cookies de sesión y se considera que acepta su uso al continuar navegando. 
            Dado que solo se utilizan cookies técnicas esenciales, no es necesario el consentimiento explícito mediante un banner de aceptación, 
            de acuerdo con la normativa vigente.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            6. Desactivación de Cookies
          </Typography>
          <Typography component={'p'}>
            El usuario puede configurar su navegador para rechazar las cookies o ser avisado antes de que se almacenen en su dispositivo. 
            Sin embargo, la desactivación de cookies de sesión puede afectar el correcto funcionamiento de la plataforma.
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            7. Modificaciones en la Política de Cookies
          </Typography>
          <Typography component={'p'}>
            CONDUPRO S.L. se reserva el derecho de modificar esta Política de Cookies para adaptarla a novedades legislativas o a cambios en el uso de cookies en la plataforma. Se recomienda a los usuarios revisar periódicamente esta política.
          </Typography>
        </Box>
        <Typography component={'p'}>
          Si tiene alguna duda sobre esta Política de Cookies, puede contactar con nosotros en <a href="mailto:info@condupro.es">info@condupro.es</a>.
        </Typography>
      </Box>
    </Container>
  )
}