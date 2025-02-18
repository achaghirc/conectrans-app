'use server';

import { ApplicationOfferStatusEnum } from "@/lib/enums";
import { ApplicationOfferDTO } from "@prisma/client";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const test_msg = {
  to: 'aminechaghir1999@gmail.com',
  from: 'info@condupro.es',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

export const sendMail = async () => {
  try {
    await sgMail.send(test_msg);
  } catch (error) {
    console.error(error);
  }
};

export const sendApplicationOfferMail = async (row: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => {
  const { Person, Offer } = row;
  const { name: personName, User: personUser } = Person || {};
  const { title: offerTitle, User: offerUser } = Offer || {};
  const { Company: company } = offerUser || {};
  const recipientEmail = personUser?.email;

  if (!recipientEmail || !offerTitle || !company?.name || !personName) {
    console.error('Missing required data to send the email');
    return;
  }

  const subject = `Candidatura a la oferta ${offerTitle}`;
  let messageText = '';
  let messageHtml = '';
  const companyPhone = company.phone ? company.phone : '';
  const companyLandline = company.landlinePhone ? '/ '.concat(company.landlinePhone) : '';
  switch (status) {
    case 'ACCEPTED':
      messageText = `Hola ${personName}, has sido seleccionado para la oferta ${offerTitle}. La empresa ${company.name} se pondrá en contacto contigo para formalizar la contratación. Si no recibes respuesta en 24 horas, te recomendamos ponerte en contacto directamente con ellos.`;
      messageHtml = `
        <h2>Hola ${personName},</h2>
        <p>¡Felicidades! Has sido seleccionado para la oferta <strong>${offerTitle}</strong>. La empresa <strong>${company.name}</strong> se pondrá en contacto contigo para formalizar la contratación.
        </p>
        <p>Si no recibes respuesta en 24 horas, puedes comunicarte directamente con la empresa mediante el siguiente teléfono <a href="tel:${company.phone}">${companyPhone}</a></p>
        <p>Atentamente,<br>El equipo de ConduPro</p>
      `;
      break;

    case 'REJECTED':
      messageText = `Hola ${personName}, lamentamos informarte que tras revisar cuidadosamente tu candidatura, la empresa ${company.name} ha decidido continuar el proceso con otros candidatos. Te animamos a seguir buscando nuevas oportunidades.`;
      messageHtml = `
        <h2>Hola ${personName},</h2>
        <p>Lamentamos informarte que tras revisar cuidadosamente tu candidatura, la empresa <strong>${company.name}</strong> ha decidido continuar el proceso con otros candidatos para la oferta <strong>${offerTitle}</strong>.</p>
        <p>Te animamos a seguir buscando nuevas oportunidades que se ajusten a tu perfil. No dudes en postularte a futuras ofertas.</p>
        <p>Atentamente,<br>El equipo de ConduPro</p>
      `;
      break;

    case 'IN_PROCESS':
      messageText = `Hola ${personName}, tu candidatura para la oferta ${offerTitle} ha sido recibida y está en proceso de revisión por la empresa ${company.name}. Muchas gracias por tu interés.`;
      messageHtml = `
        <h2>Hola ${personName},</h2>
        <p>Tu candidatura para la oferta <strong>${offerTitle}</strong> ha sido recibida y actualmente está en proceso de revisión por la empresa <strong>${company.name}</strong>.</p>
        <p>Pronto recibirás una respuesta. Agradecemos tu interés y confianza.</p>
        <p>Atentamente,<br>El equipo de ConduPro</p>
      `;
      break;

    default:
      console.error('Estado no válido para el correo');
      return;
  }

  const msg = {
    to: recipientEmail,
    from: 'info@condupro.es',
    subject: subject,
    text: messageText,
    html: messageHtml,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado correctamente');
  } catch (error) {
    console.log('Error enviando el correo:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.log('Error en el envío de correo de candidatura: ', error);
    }
  }
};
