import sgMail from '@sendgrid/mail';
import winstonEnvLogger from 'winston-env-logger';

import IMessage from '../interfaces/IMessage';

sgMail.setApiKey(process.env.SENDGRID_APIKEY as string);

const sendMail = async (receiver: string, data: IMessage): Promise<void> => {
  const { name, body, verificationLink, route, query } = data;
  try {
    const msg = {
      to: receiver,
      from: 'Volunteer Square <no-reply@volunteersquare.com>',
      subject: 'Volunteer Square <no-reply@volunteersquare.com>',
      html: `<p>${name}</p>
             <p>${body} </p>
             <a
              href='http://localhost:3000/auth/${route}?${query}=${verificationLink}'>
                ${verificationLink}
             </a>`,
    };
    await sgMail.send(msg);
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured sending mail',
      error,
    });
    throw new Error('An error occured sending mail');
  }
};

export default sendMail;
