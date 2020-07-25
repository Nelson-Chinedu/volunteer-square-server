import sgMail from '@sendgrid/mail';
import winstonEnvLogger from 'winston-env-logger';

sgMail.setApiKey(process.env.MAIL_APIKEY as string);

interface IMessage {
  name: string;
  body: string;
  link: string;
}

const sendMail = async (receiver:string, message:IMessage) => {
  try {
    const msg = {
      to: receiver,
      from: 'Volunteer Square <no-reply@volunteersquare.com>',
      subject: 'Volunteer Square <no-reply@volunteersquare.com>',
      html: `<p>${message.name}</p>
             <p>${message.body} </p>
             <a href='#'>${message.link}</a>`,
    };
    await sgMail.send(msg);
  } catch (error) {
      winstonEnvLogger.error({
        message: 'An error occured sending mail',
        error
      });
      throw new Error('An error occured');
  }
};

export default sendMail;