import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import resp from './backendResponding.js';

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function sendMail(mailObject) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.CREATOR_MAILID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token, // Correctly use accessToken.token
      },
    });

    const mailOptions = {
      from: `GSBIKESERVICE <${mailObject.from}>`,
      to: `${mailObject.to}`,
      subject: mailObject.subject,
      text: mailObject.text,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error.message); // Improved logging
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

const emailNotification = async (mailObject) => {

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  try {
    const result = await sendMail(mailObject);
    return resp(
      200, 
      true,
      `Email sent Successfully`,
      '',
      '',
      ''
    );
  } catch (error) {
    return resp(
      500,
      false,
      "Email not sent",
      "",
      "",
      "Try again later"
    );
  }
}

export default emailNotification;
