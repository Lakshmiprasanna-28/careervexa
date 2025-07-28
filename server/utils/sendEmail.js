// server/utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log("📨 Email ENV config:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD ? "✅ Exists" : "❌ MISSING",
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Failed to send email.");
  }
};
