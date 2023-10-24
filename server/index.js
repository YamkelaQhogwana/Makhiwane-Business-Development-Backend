// Require:
var postmark = require("postmark");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// Send an email:
var client = new postmark.ServerClient("b12aa721-e892-4c55-a3e3-ebfb1732bc11");

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use("/send-email", (req, res) => {
  res.send("Email Sent!");
  client.sendEmail({
    "From": "ncby9zfs7@vossie.net",
    "To": "ncby9zfs7@vossie.net",
    "Subject": "Hello from Postmark",
    "HtmlBody": "<strong>Hello</strong> dear Postmark user.",
    "TextBody": "Hello from Postmark!",
    "MessageStream": "outbound"
  });

})

app.get("/", (req, res) => {
  res.send('Welcome to My App'); // Your custom response message
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

