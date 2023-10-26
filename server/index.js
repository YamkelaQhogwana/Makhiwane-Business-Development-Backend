const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

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

// PDF generation function
const generatePDF = async (content) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const recipientEmail = req.body.recipient_email;
      const userInformation = req.body.userInformation;
      const { country, city, postalCode, address } = userInformation;
      const cartItems = req.body.cartItems;
      const total = req.body.total;
      const date = req.body.date;
      const invoiceNumber = req.body.invoiceNumber;

      // Cart Items
      const articleHTML = cartItems
        .map(
          (item) => `
          <article style="display: flex; justify-content: space-between">
            <p>${item.serviceName}</p>
            <p>R ${item.servicePrice}</p>
          </article>
        `
        )
        .join('');

      // Cart items for the owner
      const userCart = cartItems.map((item) => {
        return item.serviceName + " " + item.servicePrice + "-----";
      });

      // Order details for the owner
      const orderDetails = `Hi Mr Qhogwana. You've received an order from Makhiwane.com. This order was made on ${date} Order Details:
        Name: ${userInformation.name}
        Surname: ${userInformation.surname}
        Email: ${userInformation.email}
        Invoice Number : ${invoiceNumber}
        Address: ${address}, ${city}, ${country}, ${postalCode}
        Cart Total: R${total}: They have ordered the following:
        ${userCart}`;

      // Invoice details
      const content = `
        <html lang="en">
          <!-- Your HTML content here -->
        </html>
      `;

      const pdfBuffer = await generatePDF(content);

      // Send email with PDF attachment
      transporter.sendMail({
        from: myemail,
        to: recipientEmail,
        subject: 'New Order From Makhiwane',
        text: orderDetails,
        attachments: [
          {
            filename: 'MakhiwaneInvoice.pdf',
            content: pdfBuffer,
          },
        ],
      });

      res.status(200).send("Email sent successfully");
    } else {
      res.status(405).send("Method not allowed");
    }
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Failed to send email");
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
