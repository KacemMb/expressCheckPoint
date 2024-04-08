const express = require('express');
const nodemailer = require("nodemailer");
const fs = require('fs');

const app = express();


// Middleware to run the server from Monday to Friday

app.use((req, res, next) => {
    const today = new Date();
    const hour = today.getHours();
    const day = today.getDay();

    if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
        next();
    } else {
        res.status(403).send('Server is only available from 9am to 5pm, Monday to Friday');
    }
});

// Middleware to parse request body for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes for serving HTML files
app.get("/", (req, res) => {
    serveHTMLFile("./Home.html", res);
});

app.get("/contact", (req, res) => {
    serveHTMLFile("./Contact.html", res);
});

app.get("/services", (req, res) => {
    serveHTMLFile("./Services.html", res);
});

// Route for handling contact form submission
app.post("/contact", async (req, res) => {
    const { Email, Subject, Msg } = req.body;

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mabroukikacem2002@gmail.com",
            pass: "igse jige uone yzqz",
        },
    });

    const mailOptions = {
        from: "mabroukikacem2002@gmail.com",
        to: Email,
        subject: Subject,
        text: Msg,
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        // Respond with success message or redirect
        res.send("Email sent successfully");
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Error sending email');
    }
});

// Function to serve HTML file
function serveHTMLFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
            return;
        }
        res.end(data);
    });
}

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
