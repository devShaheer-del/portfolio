const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 📩 Contact Form Route
app.post("/api/v1/send", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        // ✅ Transporter setup (Gmail SMTP)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,   // your Gmail (sender)
                pass: process.env.EMAIL_PASS,   // your App Password (not normal password)
            },
        });

        // ✅ Mail 1: Send to YOU (Admin)
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER, 
            subject: `📩 New Contact Form Submission from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
            `,
        });

        // ✅ Mail 2: Auto-Reply to USER
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email, 
            subject: `Thanks for contacting us, ${name}!`,
            text: `
Hi ${name},

We have received your message:

"${message}"

Thank you for reaching out. We’ll get back to you shortly.

Best Regards,  
Shaheer
            `,
        });

        res.status(200).json({ success: true, msg: "Message sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, msg: "Failed to send message" });
    }
});

module.exports = app;
