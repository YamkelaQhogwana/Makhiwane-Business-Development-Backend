// Require:
var postmark = require("postmark");
const express = require("express");
const cors = require("cors");
const app =express();
const port = 5000;


app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});




app.use("/send-email",(req,res)=>{
  //Get the details the user entered
  const recipientEmail = req.body.recipient_email;
  const userInformation = req.body.userInformation;
  const { country, city, postalCode, address } = userInformation;
  const cartItems = req.body.cartItems;
  const total = req.body.total;
  const date = req.body.date;
  const invoiceNumber = req.body.invoiceNumber;

  //we then instantiate the postmark
  var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");
  
  //the order details
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

  //the invoice 
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

  
  client.sendEmail({
  "From": "ncby9zfs7@vossie.net",
  "To": "ncby9zfs7@vossie.net",
  "Subject": "Hello from Postmark",
  "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
  "TextBody": "Hello from Postmark!",
  "MessageStream": "notifications-1"
});

res.send("Hello")

})

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});


