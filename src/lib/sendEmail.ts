import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    // Create a transporter object using your email service's SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Send the email
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, you might want to have more robust error handling
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
