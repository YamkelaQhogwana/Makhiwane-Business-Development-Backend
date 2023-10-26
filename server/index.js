const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const nodemailer = require("nodemailer");
const { default: puppeteer } = require("puppeteer");

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

//PDF generation
async function generatePDF (content){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  await page.pdf({path : "MakhiwaneInvoice.pdf", format : "A4"});
  await browser.close();
}



app.post("/send-email", async (req, res) => {
  
  const recipientEmail = req.body.recipient_email;
  const userInformation = req.body.userInformation;
  const { country, city, postalCode, address } = userInformation;
  const cartItems = req.body.cartItems;
  const total = req.body.total;
  const date = req.body.date;
  const invoiceNumber = req.body.invoiceNumber;


  //cart Items
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
  
  //cart items for the owner

  const userCart =cartItems.map((item)=>{
      return item.serviceName + " "  + item.servicePrice + "-----";
    })

   //the order details for the owner
  const orderDetails = `Hi Mr Qhogwana. you've received an order from Makhiwane.com. This order was made on ${date} Order Details:
      Name: ${userInformation.name}
      Surname: ${userInformation.surname}
      Email: ${userInformation.email}
      Invoice Number : ${invoiceNumber}
      Address: ${address}, ${city}, ${country}, ${postalCode}
      Cart Total: R${total}: They have ordered the following:
       ${userCart}`;

  //the invoice details
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

  transporter.sendMail({
    from: myemail,
    to: recipientEmail,
    subject: 'New Order From Makhiwane',
    text : orderDetails
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

  try {
    generatePDF(content)
  } catch(error){
    res.send(error)
  }

   





});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
