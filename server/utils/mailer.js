import nodemailer from 'nodemailer';

export const sendNotificationEmail = async ({ to, subject, html }) => {
  try {
    // Ethereal / Mock transporter for zero-config immediate email preview
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user@ethereal.email' 
          ? process.env.SMTP_USER 
          : testAccount.user,
        pass: process.env.SMTP_PASS && process.env.SMTP_PASS !== 'mock_pass' 
          ? process.env.SMTP_PASS 
          : testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Resolution Hub" <notifications@complaint-system.org>',
      to,
      subject,
      html,
    });

    console.log(`[Mailer] Notification email sent to ${to}. MessageId: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[Mailer] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return true;
  } catch (error) {
    console.error('[Mailer] Email sending failed (non-fatal):', error.message);
    return false;
  }
};
