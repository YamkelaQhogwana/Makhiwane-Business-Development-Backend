const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");




const port = process.env.PORT || 5000;

//original node-mailer

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/", (req,res)=>{
    res.send("Hello Yamkela")
})

const myemail = 'ncby9zfs7@vossie.net'; // Replace with your Gmail email


function sendEmail(recipientEmail, pdfPath) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.postmarkapp.com',
      port : "587",
      secure : false,
      auth: {
        user: "b12aa721-e892-4c55-a3e3-ebfb1732bc11",
        pass: "b12aa721-e892-4c55-a3e3-ebfb1732bc11",
      },
    });

    const mailConfigs = {
      from: myemail,
      to: "ncby9zfs7@vossie.net",
      subject: 'MAKHIWANE BUSINESS DEVELOPMENT INVOICE',
      text : "Kindly view the invoice",
      attachments: [
        {
          filename: 'MakhiwaneInvoice.pdf',
          path: pdfPath,
        },
      ],
    };

    transporter.sendMail(mailConfigs, (error, info) => {
      if (error) {
        console.log(error);
        reject({ message: 'An error has occurred' });
      } else {
        resolve({ message: 'Email sent successfully' });
      }
    });
  });
}

app.use('/send-email', async (req, res) => {
  res.send("Hello")
  client.sendEmail({
  "From": "ncby9zfs7@vossie.net",
  "To": "ncby9zfs7@vossie.net",
  "Subject": "Hello from Postmark",
  "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
  "TextBody": "Hello from Postmark!",
  "MessageStream": "notifications-1"
});
  try {
    const recipientEmail = req.body.recipient_email;
    const userInformation = req.body.userInformation;
    const { country, city, postalCode, address } = userInformation;
    const cartItems = req.body.cartItems;
    const total = req.body.total;
    const date = req.body.date;
    const invoiceNumber = req.body.invoiceNumber;

    console.log(req.body);

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

    if (!recipientEmail) {
      return res.status(400).json({ message: 'Recipient email is required' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = `
      <html lang="en">
  <body
    style="
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
        'Lucida Sans', Arial, sans-serif;
    "
  >
    <section
      class="logo-and-slogan"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <div class="image-container">
        <img
          src="https://i.ibb.co/2vtgW2Y/makhiwane-logo.png"
          alt="makhiwane-logo"
          style="height: 60px"
        />
      </div>
      <p style="text-align: center">
        MAKHIWANE BUSINESS DEVELOPMENT SOLUTIONS <br /><span
          >Diversity leads to innovation culture</span
        >
      </p>
    </section>
    <section
      class="invoice-details"
      style="
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        padding-top: 2rem;
        border-top: 10px solid black;
      "
    >
      <section class="business">
        <h1 style="font-size: medium">
          MAKHIWANE BUSINESS DEVELOPMENT <br />PROPRIETY LIMITED
        </h1>
        <h2 style="font-size: medium">REGISTRATION NUMBER (2023/947821/07)</h2>
        <address style="font-style: normal; font-size: small">
          17 Ferero Street <br />
          Glenanda <br />
          Johannesburg South <br />
          Gauteng <br />
          2091
        </address>
      </section>

      <section
        class="bill-to"
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        "
      >
        <section class="bill-to-content">
          <h2 style="font-size: medium; text-transform: uppercase;">INVOICE TO: <br />${userInformation.companyName}</h2>
          <address
            style="
              font-style: normal;
              font-size: small;
            "
          >
            ${address} <br />
            ${city} <br />
            ${country} <br />
            ${postalCode} <br />
          </address>
        </section>
      </section>
    </section>

    <section
      class="invoice-date-and-number"
      style="
        display: flex;
        gap: 0;
        flex-direction: column;
        align-items: center;
        padding-bottom: 0rem;
        background-color: lightblue;
        color: white;
        color: black;
      "
    >
      <p style="font-size: small; text-transform: uppercase;">
        INVOICE NUMBER : ${invoiceNumber} <br />INVOICE DATE : ${date}
      </p>
    </section>

    <section
      class="services"
      style="display: flex; flex-direction: column; gap: 0.5rem"
    >
      <article style="display: flex; justify-content: space-between">
        <h3>SERVICE NAME</h3>
        <h3>PRICE</h3>
      </article>

      <section
        class="items"
        style="
          display: flex;
          flex-direction: column;
          padding-bottom: 0.3rem;
          border-bottom: 3px solid orange;
        "
      >
        ${articleHTML}
      </section>

      <section
        class="total"
        style="
          display: flex;
          justify-content: space-between;
          border-bottom: 3px solid orange;
        "
      >
        <h1>INVOICE TOTAL:</h1>
        <h1>R${total}</h1>
      </section>

      <section
        class="banking-details"
        style="display: flex; align-items: center; justify-content: center"
      >
        <h3>BANKING DETAILS</h3>
      </section>
      <article style="padding-bottom: 2rem; border-bottom: 10px solid black">
        Payment is due within 90 days <br />
        Account details <br />
        The account holder: MAKHIWANE BUSINESS DEVELOPMENT <br />
        Bank Name : FNB <br />
        Account Number : 63065723760 Branch Name : The Glen Mall Branch Code :
        259605
      </article>
    </section>
  </body>
</html>
    `;

    await page.setContent(content);

    const pdfPath = 'MakhiwaneInvoice.pdf';
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();

    // Send the email with the PDF attachment
    const response = await sendEmail(recipientEmail, pdfPath);
    res.send(response);
    const userCart =cartItems.map((item)=>{
      return item.serviceName + " "  + item.servicePrice + "-----";
    })

    console.log(userCart)
    // After sending the initial email, send a second email
    const orderDetails = `Hi Mr Qhogwana. you've received an order from Makhiwane.com. This order was made on ${date} Order Details:
      Name: ${userInformation.name}
      Surname: ${userInformation.surname}
      Email: ${userInformation.email}
      Invoice Number : ${invoiceNumber}
      Address: ${address}, ${city}, ${country}, ${postalCode}
      Cart Total: R${total}: They have ordered the following:
       ${userCart}`;

    const secondEmailRecipient = 'yamkela.qhogwana@gmail.com';

    const secondEmailConfigs = {
      from: myemail,
      to: "ncby9zfs7@vossie.net",
      subject: 'New Order Details',
      text: orderDetails,
    };

    const secondEmailTransporter = nodemailer.createTransport({
       host: 'smtp.postmarkapp.com',
      port : "587",
      secure : false,
      auth: {
        user: "b12aa721-e892-4c55-a3e3-ebfb1732bc11",
        pass: "b12aa721-e892-4c55-a3e3-ebfb1732bc11",
      },
    });

    secondEmailTransporter.sendMail(secondEmailConfigs, (error, info) => {
      if (error) {
        console.error('Error sending second email:', error);
        res.send(error)
      } else {
        console.log('Second email sent successfully');
        res.send("Email sent")
      }
    });

    res.json(response);
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
    res.status(500).json({ message: 'An error has occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
