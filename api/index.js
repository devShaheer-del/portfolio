const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 📩 Contact Form Route

app.get("/",function(req,res){
    res.send("server is running");
})

app.post("/api/v1/send", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        // ✅ Transporter setup (use Gmail or your SMTP service)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,   // your Gmail
                pass: process.env.EMAIL_PASS,   // app password (not normal password!)
            },
        });

        // ✅ Mail options
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // you will receive messages here
            subject: `New Contact Form Submission from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
        };

        // ✅ Send mail
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, msg: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, msg: "Failed to send message" });
    }
});

module.exports = app;
