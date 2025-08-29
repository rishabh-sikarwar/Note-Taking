import nodemailer from "nodemailer";

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Setup the transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send the OTP email
export const sendOTPEmail = async (email: string) => {
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  const mailOptions = {
    from: `"Note Taking App" rishabhsikarwar1000@gmail.com`,
    to: email,
    subject: "Your One-Time Password",
    html: `<p>Your OTP for authentication is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  return { otp, otpExpiresAt };
};
