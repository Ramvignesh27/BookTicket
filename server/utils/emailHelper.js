const mailjet = require('node-mailjet');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { MAILJET_API_KEY, MAILJET_API_SECRET } = process.env;

function replaceContent(content, creds) {
  // creds = {name:"John", otp:1234}
  const allKeys = Object.keys(creds);
  allKeys.forEach(function (key) {
    content = content.replace(`#{${key}}`, creds[key]);
  });
  return content;
}

async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, 'email_templates', templateName);
    const content = await fs.promises.readFile(templatePath, 'utf-8');

    const mailjetClient = mailjet.apiConnect(MAILJET_API_KEY, MAILJET_API_SECRET);

    const emailDetails = {
      FromEmail: 'mgramvignesh@gmail.com', // Replace with your verified sender email
      FromName: 'ScalerShows',
      Recipients: [{ Email: receiverEmail }],
      Subject: 'Mail from ScalerShows',
      TextPart: `Hi ${creds.name}, Your OTP is ${creds.otp}`,
      HTMLPart: replaceContent(content, creds),
    };

    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: emailDetails.FromEmail,
            Name: emailDetails.FromName,
          },
          To: emailDetails.Recipients,
          Subject: emailDetails.Subject,
          TextPart: emailDetails.TextPart,
          HTMLPart: emailDetails.HTMLPart,
        },
      ],
    });

    request
      .then((result) => {
        console.log('Email sent successfully:', result.body);
      })
      .catch((err) => {
        console.log('Error sending email:', err);
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = EmailHelper;
