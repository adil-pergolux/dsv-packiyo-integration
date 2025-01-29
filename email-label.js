const nodemailer = require("nodemailer");
const path = require('path');
const logger = require("./logger"); // Import logger

// Configure email sender
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rozella.armstrong95@ethereal.email',
        pass: 'VwPbWeJURRMqKv7yGE'
    }
});

// Function to send email
const sendEmail = async (bookingId) => {
    const mailOptions = {
        from: "Pergolux Logistics <jerrell.sawayn@ethereal.email>",
        to: "adil.ali@pergolux.de",
        subject: "Booking Confirmation",
        text: "Please find attached the PDF file.",
        attachments: [
            {
                filename: bookingId + "-labels.pdf",
                path: path.join(__dirname, "shipping-labels", bookingId + "-labels.pdf")
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        logger.error(`Error sending email with booking ID ${bookingId}: ${error.message}`);
        console.error("Error sending email:", error);
    }
}

module.exports = sendEmail;