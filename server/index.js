const postmark = require("postmark");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const bodyParser = require('body-parser');
const client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/send-email", (req, res) => {

  const recipientEmail = req.body.recipient_email;
  const userInformation = req.body.userInformation;
  const { country, city, postalCode, address } = userInformation;
  const cartItems = req.body.cartItems;
  const total = req.body.total;
  const date = req.body.date;
  const invoiceNumber = req.body.invoiceNumber;



  const emailData = {
    From: "ncby9zfs7@vossie.net",
    To: "ncby9zfs7@vossie.net",
    Subject: "Hello from Postmark",
    HtmlBody: "<strong>Hello</strong> dear Postmark user.",
    TextBody: "Hello from Postmark!",
    MessageStream: "notifications-1"
  };

  //Cart Items Content
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


  client.sendEmail(emailData, (error, result) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent successfully");
      res.send("Email sent successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
