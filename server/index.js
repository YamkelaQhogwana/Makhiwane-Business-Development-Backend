const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const nodemailer = require("nodemailer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const myemail = 'yamkela.qhogwana@gmail.com'; 
const mypassword = 'opvtoenlmdliyrip'; 

// Create the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: myemail,
    pass: mypassword,
  },
});

app.post("/send-email", (req, res) => {
  const recipientEmail = req.body.recipient_email;
  const userInformation = req.body.userInformation;
  const { country, city, postalCode, address } = userInformation;
  const cartItems = req.body.cartItems;
  const total = req.body.total;
  const date = req.body.date;
  const invoiceNumber = req.body.invoiceNumber;

  transporter.sendMail({
    from: myemail,
    to: recipientEmail,
    subject: 'Your Invoice',
    // Email body and attachments go here
  }, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      res.status(500).send("Failed to send email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
